/* TreinoHoje — sincronização opcional com o Supabase.
   O app continua funcionando sem conta: tudo é salvo primeiro no aparelho.
   Quem entra ganha backup na nuvem e o mesmo histórico no celular e no PC. */
const NUVEM = {
  url: 'https://lkajsfiwwwxacmwixkat.supabase.co',
  chave: 'sb_publishable_zQF8QmCnZyHrmGcqWuGwcw_nNrdvTf1',   // chave pública: quem protege os dados é o login + as regras da tabela
  tabela: 'treinohoje',
  site: 'https://espmikael.github.io/TreinoHoje/',   // para onde os links dos e-mails levam
};
const NUVEM_KEY = 'treinohoje:nuvem';
/* o que é só deste aparelho (treino em andamento, escolha do dia, avisos) não vai para a nuvem */
const SO_AQUI = ['hoje', 'rascunhos', 'desfazer', 'persistido', 'vistoInstalar', 'backupAdiadoAte', 'ultimoBackup'];

let nv = (() => { try{ return JSON.parse(localStorage.getItem(NUVEM_KEY)) || {}; }catch(e){ return {}; } })();
let nvEstado = nv.sessao ? 'ok' : 'fora';     // fora | ok | enviando | offline | erro | expirada
let nvEmail = '', nvMsg = '', nvForm = false, nvErro = '', nvTimer = null, nvRodando = false, nvAplicando = false;
const nvSalvar = () => { try{ localStorage.setItem(NUVEM_KEY, JSON.stringify(nv)); }catch(e){} };
const nvLogado = () => !!(nv.sessao && nv.sessao.refresh_token);

/* chamado pelo save() do app a cada mudança */
window.nuvemMudou = function(){
  if(nvAplicando) return;
  nv.mod = Date.now(); nvSalvar();
  if(!nvLogado()) return;
  clearTimeout(nvTimer); nvTimer = setTimeout(sincronizar, 2500);
};
/* com a nuvem em dia, o lembrete de backup manual some */
window.nuvemOk = () => nvLogado() && nv.sinc && Date.now() - nv.sinc < 7 * 864e5;

async function nvReq(caminho, opc = {}, comToken = true){
  const h = { apikey: NUVEM.chave, 'Content-Type': 'application/json', ...(opc.headers || {}) };
  if(comToken && nv.sessao) h.Authorization = 'Bearer ' + nv.sessao.access_token;
  const r = await fetch(NUVEM.url + caminho, { ...opc, headers: h, cache: 'no-store' });
  let corpo = null; try{ corpo = await r.json(); }catch(e){}
  return { ok: r.ok, status: r.status, corpo };
}
function nvGuardarSessao(c){
  nv.sessao = { access_token: c.access_token, refresh_token: c.refresh_token, expira: Date.now() + (c.expires_in || 3600) * 1000, email: c.user && c.user.email, id: c.user && c.user.id };
  nvSalvar();
}
async function nvToken(){
  if(!nvLogado()) return false;
  if(Date.now() < nv.sessao.expira - 60e3) return true;
  const r = await nvReq('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: JSON.stringify({ refresh_token: nv.sessao.refresh_token }) }, false);
  if(r.ok && r.corpo && r.corpo.access_token){ nvGuardarSessao(r.corpo); return true; }
  if(r.status >= 400 && r.status < 500){ nvEstado = 'expirada'; return false; }
  throw new Error('rede');
}
/* entrar com e-mail e senha (a mesma conta do MyFinance); criar conta é opcional */
let nvModo = 'entrar';
const msgErro = r => ((r.corpo && (r.corpo.error_description || r.corpo.msg || r.corpo.message || r.corpo.error_code)) || '') + ' ' + r.status;
async function nuvemEntrar(email, senha){
  nvErro = ''; nvEmail = email;
  try{
    const r = await nvReq('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password: senha }) }, false);
    if(!r.ok){
      const m = msgErro(r);
      nvErro = /not.?confirmed/i.test(m) ? 'Confirme o e-mail da conta (pelo link que chegou) e depois entre aqui.'
        : /invalid|credentials/i.test(m) ? 'E-mail ou senha incorretos.'
        : /429|rate/i.test(m) ? 'Muitas tentativas. Espere um pouco.' : 'Não deu pra entrar agora. Tente de novo em instantes.';
      render(); return;
    }
    nvGuardarSessao(r.corpo); nv.sinc = 0; nv.nuvemEm = null; nvSalvar();
    nvForm = false; nvModo = 'entrar'; nvEstado = 'enviando'; render();
    await sincronizar(true);
    toast('Conectado: seus treinos agora têm backup na nuvem');
  }catch(e){ nvErro = 'Sem conexão com a nuvem agora. Tente de novo mais tarde.'; render(); }
}
async function nuvemEsqueci(email){
  nvErro = '';
  if(!email){ nvErro = 'Digite seu e-mail acima e toque em "Esqueci a senha" de novo.'; render(); return; }
  nvEmail = email;
  try{
    const r = await nvReq('/auth/v1/recover?redirect_to=' + encodeURIComponent(NUVEM.site), { method: 'POST', body: JSON.stringify({ email }) }, false);
    if(!r.ok && /429|rate/i.test(msgErro(r))){ nvErro = 'Muitos pedidos. Espere um pouco antes de pedir outro e-mail.'; render(); return; }
    toast('Se esse e-mail tiver conta, chega um link para criar uma senha nova');
  }catch(e){ nvErro = 'Sem conexão com a nuvem agora. Tente de novo mais tarde.'; render(); }
}
async function nuvemCriar(email, senha){
  nvErro = ''; nvEmail = email;
  if(senha.length < 6){ nvErro = 'Use uma senha com pelo menos 6 caracteres.'; render(); return; }
  try{
    const r = await nvReq('/auth/v1/signup?redirect_to=' + encodeURIComponent(NUVEM.site), { method: 'POST', body: JSON.stringify({ email, password: senha }) }, false);
    if(!r.ok){
      const m = msgErro(r);
      nvErro = /already|registered|exists/i.test(m) ? 'Esse e-mail já tem conta. Use "Entrar".'
        : /429|rate/i.test(m) ? 'Muitas tentativas. Espere um pouco.' : 'Não deu pra criar a conta agora. Tente de novo em instantes.';
      render(); return;
    }
    if(r.corpo && r.corpo.access_token){ await nuvemEntrar(email, senha); return; }
    nvModo = 'entrar'; nvErro = ''; render();
    toast('Conta criada. Confirme pelo link no seu e-mail e depois entre aqui.');
  }catch(e){ nvErro = 'Sem conexão com a nuvem agora. Tente de novo mais tarde.'; render(); }
}
function nuvemSair(){
  if(!confirm('Sair da conta? Seus dados continuam neste aparelho.')) return;
  const t = nv.sessao && nv.sessao.access_token;
  if(t) fetch(NUVEM.url + '/auth/v1/logout', { method: 'POST', headers: { apikey: NUVEM.chave, Authorization: 'Bearer ' + t } }).catch(() => {});
  nv = { mod: nv.mod }; nvSalvar(); nvEstado = 'fora'; render();
}
/* assinatura curta dos dados sincronizáveis: evita reenviar quando só mudou o treino em andamento */
function assinatura(){ const s = JSON.stringify(semLocais(db)); let h = 0; for(let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return s.length + ':' + h; }
const semLocais = d => { const o = JSON.parse(JSON.stringify(d)); SO_AQUI.forEach(k => delete o[k]); return o; };
function mesclar(L, R, localMaisNovo){
  const base = localMaisNovo ? semLocais(L) : semLocais(R);
  const apagados = [...new Set([...(L.apagados || []), ...(R.apagados || [])].map(String))].slice(-500);
  const porId = new Map();
  (R.sessoes || []).forEach(s => porId.set(String(s.id), s));
  (L.sessoes || []).forEach(s => porId.set(String(s.id), s));     // a edição deste aparelho vence
  base.sessoes = [...porId.values()].filter(s => !apagados.includes(String(s.id))).sort((a, b) => new Date(a.data) - new Date(b.data));
  base.apagados = apagados;
  return base;
}
function aplicar(dados){
  const novo = { ...dados };
  SO_AQUI.forEach(k => { if(db[k] !== undefined) novo[k] = db[k]; else delete novo[k]; });
  nvAplicando = true;
  try{ localStorage.setItem(KEY, JSON.stringify(novo)); db = load(); save(); }
  finally{ nvAplicando = false; }
  const digitando = document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
  if(!digitando) render();
}
async function enviar(){
  const atualizado = new Date().toISOString();
  const r = await nvReq(`/rest/v1/${NUVEM.tabela}?on_conflict=user_id`, {
    method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ user_id: nv.sessao.id, dados: semLocais(db), atualizado }) });
  if(!r.ok) throw Object.assign(new Error('envio'), { status: r.status });
  nv.nuvemEm = atualizado; nv.enviado = assinatura();
}
async function sincronizar(forcar){
  if(!nvLogado() || nvRodando) return;
  if(!navigator.onLine){ nvEstado = 'offline'; nvAtualizarTela(); return; }
  nvRodando = true; const antes = nvEstado; nvEstado = 'enviando'; if(forcar || antes !== 'ok') nvAtualizarTela();
  try{
    if(!(await nvToken())){ nvAtualizarTela(); return; }
    let r = await nvReq(`/rest/v1/${NUVEM.tabela}?select=dados,atualizado&user_id=eq.${nv.sessao.id}`);
    if(r.status === 401 && (nv.sessao.expira = 0, await nvToken())) r = await nvReq(`/rest/v1/${NUVEM.tabela}?select=dados,atualizado&user_id=eq.${nv.sessao.id}`);
    if(!r.ok) throw Object.assign(new Error('leitura'), { status: r.status });
    const remoto = Array.isArray(r.corpo) && r.corpo[0];
    const temLocal = db.sessoes.length > 0;
    /* na primeira vez, o que já existe neste aparelho é juntado com a nuvem (nada se perde) */
    const localMudou = nv.sinc ? (nv.mod || 0) > nv.sinc && assinatura() !== nv.enviado : temLocal;
    const remotoMudou = remoto && (!nv.nuvemEm || new Date(remoto.atualizado) > new Date(nv.nuvemEm));
    if(!remoto){ await enviar(); }
    else if(remotoMudou && !localMudou){ aplicar(remoto.dados); nv.nuvemEm = remoto.atualizado; nv.enviado = assinatura(); }
    else if(remotoMudou && localMudou){
      /* primeira vez neste aparelho: o plano e as metas daqui valem (a nuvem pode ter vindo de um aparelho vazio) */
      const localVence = !nv.sinc || (nv.mod || 0) > new Date(remoto.atualizado);
      aplicar(mesclar(db, remoto.dados, localVence)); await enviar(); }
    else if(localMudou){ await enviar(); }
    nv.sinc = Date.now(); nvSalvar(); nvEstado = 'ok'; nvMsg = '';
  }catch(e){
    nvEstado = navigator.onLine ? 'erro' : 'offline';
    nvMsg = e && e.status === 404 ? 'A tabela da nuvem não foi encontrada.' : '';
  }finally{ nvRodando = false; nvAtualizarTela(); }
}
function nvAtualizarTela(){
  const box = document.getElementById('nuvem-box');
  if(box && !box.contains(document.activeElement)) box.outerHTML = blocoNuvem();
}
function quandoTxt(t){
  if(!t) return 'ainda não';
  const min = Math.round((Date.now() - t) / 60e3);
  if(min < 1) return 'agora';
  if(min < 60) return `há ${min} min`;
  const d = new Date(t);
  return d.toDateString() === new Date().toDateString() ? 'hoje às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}
window.blocoNuvem = function(){
  if(!nvLogado() && nvEstado !== 'expirada'){
    return `<div id="nuvem-box"><div class="sec"><span>Sincronizar</span><span>opcional</span></div>
      <div class="card txt">
        <p class="cs">Entre com sua conta para ter backup automático na nuvem e ver seus treinos também no PC. Sem entrar, tudo continua funcionando só neste aparelho.</p>
        ${!nvForm ? '' : `<form class="nuvem-form" data-nuvem-form="${nvModo}">
            <label class="nv-campo"><span>E-mail</span><input class="inp" type="email" name="email" autocomplete="username" inputmode="email" value="${esc(nvEmail)}" required></label>
            <label class="nv-campo"><span>Senha${nvModo === 'criar' ? ' (mínimo 6 caracteres)' : ''}</span><input class="inp" type="password" name="senha" autocomplete="${nvModo === 'criar' ? 'new-password' : 'current-password'}" required></label>
            ${nvErro ? `<p class="nv-erro" role="alert">${esc(nvErro)}</p>` : ''}
            <div class="acoes" style="align-items:center;gap:16px"><button type="submit" class="mini-btn">${nvModo === 'criar' ? 'Criar conta' : 'Entrar'}</button>
              <button type="button" class="lnk" data-nuvem="cancelar">Cancelar</button></div>
            <p class="cs" style="margin:0">${nvModo === 'criar' ? 'Já tem conta? <button type="button" class="lnk lnk-mini" data-nuvem="modo-entrar">Entrar</button>' : 'Não tem conta? <button type="button" class="lnk lnk-mini" data-nuvem="modo-criar">Criar conta</button> · <button type="button" class="lnk lnk-mini" data-nuvem="esqueci">Esqueci a senha</button>'}</p>
          </form>`}
        ${nvForm ? '' : `<div class="acoes"><button type="button" class="mini-btn" data-nuvem="abrir">Entrar</button></div>`}
      </div></div>`;
  }
  const st = { ok: ['st-ok', '✓ sincronizado'], enviando: ['', 'sincronizando…'], offline: ['', 'sem internet'], erro: ['st-alerta', 'nuvem indisponível'], expirada: ['st-alerta', 'entre de novo'] }[nvEstado] || ['', ''];
  const aviso = nvEstado === 'offline' ? 'Sem internet agora. Seus treinos ficam salvos aqui e sobem sozinhos quando a conexão voltar.'
    : nvEstado === 'erro' ? (nvMsg || 'Não deu pra falar com a nuvem (o projeto pode estar pausado). Seus dados continuam salvos neste aparelho.')
    : nvEstado === 'expirada' ? 'A sessão expirou. Entre de novo para continuar sincronizando.' : '';
  return `<div id="nuvem-box"><div class="sec"><span>Sincronizar</span></div>
    <div class="card txt">
      <div class="backup-st"><span>Conta</span><span>${esc((nv.sessao && nv.sessao.email) || '')}</span></div>
      <div class="backup-st"><span>Situação</span><span class="${st[0]}">${st[1]}</span></div>
      <div class="backup-st"><span>Última sincronização</span><span>${quandoTxt(nv.sinc)}</span></div>
      ${aviso ? `<p class="cs" style="margin-top:8px">${aviso}</p>` : ''}
      <div class="acoes" style="align-items:center;gap:16px">
        ${nvEstado === 'expirada' ? '<button type="button" class="mini-btn" data-nuvem="reentrar">Entrar de novo</button>' : '<button type="button" class="mini-btn" data-nuvem="agora">Sincronizar agora</button>'}
        <button type="button" class="lnk" data-nuvem="sair">Sair</button></div>
    </div></div>`;
};
document.getElementById('app').addEventListener('click', e => {
  const b = e.target.closest('[data-nuvem]'); if(!b) return;
  const a = b.dataset.nuvem;
  if(a === 'abrir'){ nvForm = true; nvErro = ''; render(); setTimeout(() => document.querySelector('[data-nuvem-form] input')?.focus(), 0); }
  if(a === 'cancelar'){ nvForm = false; nvErro = ''; nvModo = 'entrar'; render(); }
  if(a === 'esqueci'){ const f = document.querySelector('[data-nuvem-form]'); nuvemEsqueci(f ? f.email.value.trim() : ''); }
  if(a === 'modo-criar' || a === 'modo-entrar'){ const f = document.querySelector('[data-nuvem-form]'); if(f) nvEmail = f.email.value.trim(); nvModo = a === 'modo-criar' ? 'criar' : 'entrar'; nvErro = ''; render(); }
  if(a === 'agora') sincronizar(true);
  if(a === 'sair') nuvemSair();
  if(a === 'reentrar'){ nvEmail = (nv.sessao && nv.sessao.email) || nvEmail; nv = { mod: nv.mod, sinc: nv.sinc, nuvemEm: nv.nuvemEm }; nvSalvar(); nvEstado = 'fora'; nvForm = true; nvModo = 'entrar'; render(); }
});
document.getElementById('app').addEventListener('submit', e => {
  const f = e.target.closest('[data-nuvem-form]'); if(!f) return;
  e.preventDefault();
  const email = f.email.value.trim(), senha = f.senha.value;
  if(!email || !senha) return;
  f.querySelector('[type=submit]').disabled = true;
  if(f.dataset.nuvemForm === 'criar') nuvemCriar(email, senha); else nuvemEntrar(email, senha);
});
/* ---------- links dos e-mails: confirmar cadastro e criar senha nova ---------- */
function janelaSenha(){
  let m = document.getElementById('nuvem-janela');
  if(!m){ m = document.createElement('div'); m.id = 'nuvem-janela'; document.body.appendChild(m); }
  m.innerHTML = `<div class="folha-fundo"><section class="folha" role="dialog" aria-modal="true" aria-labelledby="nv-ns-t">
    <div class="folha-alca" aria-hidden="true"></div>
    <p class="rot">Sua conta · ${esc((nv.sessao && nv.sessao.email) || '')}</p>
    <h2 id="nv-ns-t" style="margin:4px 0 12px">Crie uma senha nova</h2>
    <form class="nuvem-form" id="nv-ns-form">
      <label class="nv-campo"><span>Senha nova (mínimo 6 caracteres)</span><input class="inp" type="password" name="senha" autocomplete="new-password" required></label>
      <p class="nv-erro" id="nv-ns-erro" role="alert"></p>
      <div class="acoes" style="align-items:center;gap:16px"><button type="submit" class="mini-btn">Salvar senha</button><button type="button" class="lnk" id="nv-ns-x">Agora não</button></div>
    </form></section></div>`;
  const fechar = () => { m.innerHTML = ''; };
  m.querySelector('#nv-ns-x').onclick = fechar;
  m.querySelector('#nv-ns-form').onsubmit = async e => {
    e.preventDefault(); const s = e.target.senha.value; const er = m.querySelector('#nv-ns-erro');
    if(s.length < 6){ er.textContent = 'Use pelo menos 6 caracteres.'; return; }
    try{
      await nvToken();
      const r = await nvReq('/auth/v1/user', { method: 'PUT', body: JSON.stringify({ password: s }) });
      if(!r.ok){ er.textContent = /same|different/i.test(msgErro(r)) ? 'Escolha uma senha diferente da antiga.' : 'Não deu pra salvar. Peça outro e-mail de recuperação.'; return; }
      fechar(); toast('Senha nova salva. Use ela também no app instalado.');
    }catch(err){ er.textContent = 'Sem conexão agora. Tente de novo.'; }
  };
  setTimeout(() => m.querySelector('input').focus(), 50);
}
async function voltaDoEmail(){
  const h = new URLSearchParams(location.hash.slice(1));
  if(!h.get('access_token') && !h.get('error')) return;
  history.replaceState(null, '', location.pathname + location.search);
  if(h.get('error')){ toast(/expired/i.test(h.get('error_code') || h.get('error_description') || '') ? 'Esse link expirou. Peça outro e-mail.' : 'Esse link não funcionou. Peça outro e-mail.'); return; }
  try{
    const tok = h.get('access_token');
    const r = await fetch(NUVEM.url + '/auth/v1/user', { headers: { apikey: NUVEM.chave, Authorization: 'Bearer ' + tok } });
    const u = await r.json(); if(!r.ok || !u.id) throw new Error('usuario');
    nvGuardarSessao({ access_token: tok, refresh_token: h.get('refresh_token'), expires_in: +h.get('expires_in') || 3600, user: u });
    nv.sinc = 0; nv.nuvemEm = null; nvSalvar(); nvEstado = 'enviando';
    if(h.get('type') === 'recovery') janelaSenha(); else toast('E-mail confirmado: você já está conectado');
    await sincronizar(true);
  }catch(e){ toast('Não deu pra entrar pelo link. Entre com e-mail e senha.'); }
}
voltaDoEmail();
window.addEventListener('hashchange', voltaDoEmail);
window.addEventListener('online', () => sincronizar());
document.addEventListener('visibilitychange', () => {
  if(document.visibilityState === 'hidden' && nvTimer){ clearTimeout(nvTimer); nvTimer = null; sincronizar(); }   // fechou o app logo depois de mexer
  if(document.visibilityState === 'visible' && Date.now() - (nv.sinc || 0) > 60e3) sincronizar();
});
if(nvLogado()) setTimeout(sincronizar, 800);

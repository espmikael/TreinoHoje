/* TreinoHoje — lógica do app (depende de exercicios.js) */
/* =========================================================
   TreinoHoje — planos, registros, calendário, dashboard e compartilhar.
   Os planos agora ficam salvos no app (aba Plano → Editar / Novo / Gerar).
   ========================================================= */

/* ---------- plano padrão ---------- */
const PLANO_PADRAO = {
  id: 'padrao', nome: 'ABC · padrão', rotacao: ['A', 'B', 'C'],
  treinos: {
    A: { foco: 'Peito, ombro e tríceps', ex: [
      { id: 'supino-reto',      nome: 'Supino reto (barra)',               series: 3, reps: [8, 12] },
      { id: 'supino-inclinado', nome: 'Supino inclinado (halteres)',       series: 2, reps: [8, 12] },
      { id: 'desenvolvimento',  nome: 'Desenvolvimento (halteres)',        series: 2, reps: [8, 12] },
      { id: 'elevacao-lateral', nome: 'Elevação lateral',                  series: 3, reps: [12, 20] },
      { id: 'triceps-frances',  nome: 'Tríceps francês (polia ou halter)', series: 2, reps: [10, 15] },
      { id: 'triceps-pulley',   nome: 'Tríceps pulley (corda)',            series: 2, reps: [10, 15] },
    ]},
    B: { foco: 'Costas e bíceps', ex: [
      { id: 'barra-fixa',        nome: 'Barra fixa (ou puxada alta)',    series: 3, reps: [6, 12], obs: 'peso = lastro, se houver' },
      { id: 'remada',            nome: 'Remada curvada ou serrote',      series: 3, reps: [8, 12] },
      { id: 'remada-maquina',    nome: 'Remada máquina (pegada aberta)', series: 2, reps: [10, 12] },
      { id: 'crucifixo-inverso', nome: 'Crucifixo inverso (posterior)',  series: 2, reps: [12, 20] },
      { id: 'rosca-direta',      nome: 'Rosca direta (barra reta/W)',    series: 2, reps: [8, 12] },
      { id: 'rosca-martelo',     nome: 'Rosca martelo (halteres)',       series: 2, reps: [10, 15] },
    ]},
    C: { foco: 'Pernas e core', ex: [
      { id: 'agachamento', nome: 'Agachamento livre (ou hack)',      series: 3, reps: [8, 12] },
      { id: 'stiff',       nome: 'Stiff (barra ou halteres)',        series: 2, reps: [8, 12] },
      { id: 'extensora',   nome: 'Cadeira extensora',                series: 2, reps: [10, 15] },
      { id: 'flexora',     nome: 'Mesa ou cadeira flexora',          series: 2, reps: [10, 15] },
      { id: 'panturrilha', nome: 'Panturrilha (em pé ou leg press)', series: 3, reps: [10, 15], obs: 'pausa de 1s embaixo' },
      { id: 'abdominal',   nome: 'Abdominal na polia ou supra',      series: 2, reps: [10, 15] },
    ]},
  }
};
const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];
const KEY = 'treinohoje:v1';
const TEMA_KEY = 'treinohoje:tema';
const clone = o => JSON.parse(JSON.stringify(o));

/* ---------- dados ---------- */
function load(){
  let d = null;
  try{ d = JSON.parse(localStorage.getItem(KEY)); }catch(e){}
  if(!d || !Array.isArray(d.sessoes)) d = { sessoes: [] };
  if(!d.rascunhos) d.rascunhos = {};
  if(!d.metas) d.metas = { academia: 0, corrida: 0, kmMes: 0, cargas: [], leveSemanas: [], ocultarConvite: false };
  d.metas = Object.assign({ academia: 0, corrida: 0, kmMes: 0, cargas: [], leveSemanas: [], ocultarConvite: false }, d.metas);
  if(!d.planos || !Object.keys(d.planos).length){ d.planos = { padrao: clone(PLANO_PADRAO) }; d.planoAtivo = 'padrao'; }
  if(!d.planos[d.planoAtivo]) d.planoAtivo = Object.keys(d.planos)[0];
  if(!d.migr12){
    Object.values(d.planos).forEach(p => Object.values(p.treinos).forEach(t => t.ex.forEach(e => {
      if(e.reps[0] === 6 && e.reps[1] === 10) e.reps = [8, 12];
      else if(e.reps[0] === 5 && e.reps[1] === 10) e.reps = [6, 12];
    })));
    d.migr12 = true;
  }
  return d;
}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(db)); }catch(e){} }
let db = load();

/* estado da interface */
let aba = 'hoje';
let tipoSel = (db.hoje && db.hoje.dia) ? db.hoje.tipo : null;
let pedidoInstalar = null;
let ultimaSalva = null;          // id do registro recém-salvo (banner de compartilhar)
let visao = 'semana';            // semana | mes
let mesOffset = 0;
let dashEx = null;
let ed = null;                   // cópia do plano em edição
let gen = { dias: 3, tempo: 50, eq: 'completa' };

const $ = s => document.querySelector(s);
const num = v => { const n = parseFloat(String(v ?? '').replace(',', '.')); return isNaN(n) ? null : n; };
const fmtNum = n => String(Math.round(n * 10) / 10).replace('.', ',');
const fmtMil = n => Math.round(n).toLocaleString('pt-BR');
const fmtData = (iso, opt = { day: '2-digit', month: '2-digit' }) => new Date(iso).toLocaleDateString('pt-BR', opt);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const SVG = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
const IC = {
  up: SVG('M12 19V5M5 12l7-7 7 7'), share: SVG('M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6'),
  x: SVG('M6 6l12 12M18 6L6 18'), cima: SVG('M6 15l6-6 6 6'), baixo: SVG('M6 9l6 6 6-6'),
  lixo: SVG('M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3'), esq: SVG('M15 6l-6 6 6 6'), dir: SVG('M9 6l6 6-6 6'),
};

function plano(){ return db.planos[db.planoAtivo]; }
function rotacao(){ return plano().rotacao; }
function doPlano(s, p){ return (s.planoId || 'padrao') === p.id; }
function ultimo(exId){
  for(let i = db.sessoes.length - 1; i >= 0; i--){
    const s = db.sessoes[i];
    if(s.ex && s.ex[exId] && s.ex[exId].length) return { data: s.data, sets: s.ex[exId] };
  }
  return null;
}
function nomeEx(id){
  for(const p of Object.values(db.planos)) for(const t of Object.values(p.treinos)){ const e = t.ex.find(x => x.id === id); if(e) return e.nome; }
  for(const t of Object.values(PLANO_PADRAO.treinos)){ const e = t.ex.find(x => x.id === id); if(e) return e.nome; }
  return BIB_ID[id]?.nome || id;
}
function tituloSessao(s){
  if(s.tipo === 'corrida') return { nome: 'Corrida', foco: 'Cardio' };
  if(s.nome) return { nome: s.nome, foco: s.foco || '' };
  return { nome: 'Treino ' + s.tipo, foco: PLANO_PADRAO.treinos[s.tipo]?.foco || '' };
}
function segunda(d){ const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - (x.getDay() + 6) % 7); return x; }
function pace(km, min){
  if(!km || !min) return null;
  const p = min / km; let m = Math.floor(p); let s = Math.round((p - m) * 60);
  if(s === 60){ m++; s = 0; }
  return `${m}:${String(s).padStart(2, '0')}`;
}
function melhorSerie(sets){
  let best = null;
  for(const s of sets){
    const kg = num(s.kg) || 0, r = num(s.reps) || 0;
    if(!best || kg > best.kg || (kg === best.kg && r > best.r)) best = { kg, r };
  }
  return best;
}
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2000); }

function calendario(){
  const d = new Date();
  const mes = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  const sem = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  const longa = d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  return `<div class="cal" role="img" aria-label="Hoje, ${longa}"><div class="m">${mes}</div><div class="d">${d.getDate()}</div><div class="w">${sem}</div></div>`;
}
const cab = (rot, h1, foco = '', direita = '') => `<div class="cab"><div><p class="rot">${rot}</p><h1>${h1}</h1>${foco ? `<p class="foco">${foco}</p>` : ''}</div>${direita}</div>`;

/* =========================================================
   METAS — começam vazias; o usuário define em Plano → Metas
   ========================================================= */
const pad2 = n => String(n).padStart(2, '0');
function isoSemana(d){ const x = segunda(d); return `${x.getFullYear()}-${pad2(x.getMonth() + 1)}-${pad2(x.getDate())}`; }
function metaAcad(ini){
  const m = db.metas; if(!m.academia) return 0;
  return m.leveSemanas.includes(isoSemana(ini)) ? Math.max(1, m.academia - 1) : m.academia;
}
function temMetaSemanal(){ return db.metas.academia > 0 || db.metas.corrida > 0; }
function temAlgumaMeta(){ const m = db.metas; return temMetaSemanal() || m.kmMes > 0 || m.cargas.length > 0; }
function contaSemana(ini){
  const a = segunda(ini), f = new Date(a); f.setDate(f.getDate() + 7);
  const ss = db.sessoes.filter(s => { const d = new Date(s.data); return d >= a && d < f; });
  return { g: ss.filter(s => s.tipo !== 'corrida').length, c: ss.filter(s => s.tipo === 'corrida').length };
}
function semanaNaMeta(ini){ const { g, c } = contaSemana(ini); return g >= metaAcad(ini) && c >= db.metas.corrida; }
function sequencia(){
  if(!temMetaSemanal()) return 0;
  const atual = segunda(new Date());
  let n = semanaNaMeta(atual) ? 1 : 0;
  const d = new Date(atual);
  for(let i = 0; i < 156; i++){ d.setDate(d.getDate() - 7); if(semanaNaMeta(d)) n++; else break; }
  return n;
}
function melhorCarga(exId){
  let mx = 0;
  db.sessoes.forEach(s => { if(s.ex && s.ex[exId]){ const b = melhorSerie(s.ex[exId]); if(b && b.kg > mx) mx = b.kg; } });
  return mx;
}
const metaTxt = (v, m) => m ? `${v}/${m}` : `${v}`;
const plural = (n, um, varios) => n === 1 ? um : varios;

function blocoMetas(){
  const m = db.metas;
  if(!temAlgumaMeta()) return '';
  const hoje = new Date();
  const ini = segunda(hoje);
  const restam = 7 - (hoje.getDay() + 6) % 7;
  const cards = [];
  if(temMetaSemanal()){
    const { g, c } = contaSemana(ini);
    const mA = metaAcad(ini), leve = m.leveSemanas.includes(isoSemana(ini));
    const linha = (nome, feito, meta) => {
      const n = Math.max(meta, feito);
      const segs = Array.from({ length: n }, (_, i) => `<i class="${i < feito ? 'on' : ''}"></i>`).join('');
      return `<div class="m-linha"><div class="m-top"><span class="m-nome">${nome}</span><span class="m-num">${feito}<small> / ${meta}</small></span></div>
        <div class="segs" style="grid-template-columns:repeat(${n},minmax(0,1fr))" role="img" aria-label="${nome}: ${feito} de ${meta}">${segs}</div></div>`;
    };
    const faltaG = Math.max(0, mA - g), faltaC = Math.max(0, m.corrida - c);
    let frase;
    if(!faltaG && !faltaC) frase = 'Meta da semana batida.';
    else {
      const partes = [];
      if(faltaG) partes.push(`${faltaG} ${plural(faltaG, 'treino', 'treinos')}`);
      if(faltaC) partes.push(`${faltaC} ${plural(faltaC, 'corrida', 'corridas')}`);
      frase = `${plural(faltaG + faltaC, 'Falta', 'Faltam')} ${partes.join(' e ')}.`;
    }
    cards.push(`<section class="card m-card">
      ${m.academia ? linha('Academia', g, mA) : ''}
      ${m.corrida ? linha('Corrida', c, m.corrida) : ''}
      <p class="m-frase">${frase}${leve ? ' <span class="tag-leve">semana leve</span>' : ''}</p></section>`);
    const seq = sequencia();
    let quadros = '';
    for(let w = 7; w >= 0; w--){ const d = new Date(ini); d.setDate(d.getDate() - 7 * w); quadros += `<i class="${semanaNaMeta(d) ? 'on' : ''}"></i>`; }
    cards.push(`<section class="card"><div class="card-head"><span class="t">Sequência</span><span class="t-brand">semanas na meta</span></div>
      <div class="seq"><div class="seq-n">${seq}<small> ${plural(seq, 'semana', 'semanas')}</small></div>
      <div class="quadros" role="img" aria-label="Últimas 8 semanas">${quadros}</div></div></section>`);
  }
  m.cargas.forEach(cg => {
    const atual = melhorCarga(cg.exId);
    const span = cg.kg - cg.inicio;
    const pct = span <= 0 ? (atual >= cg.kg ? 100 : 0) : Math.max(0, Math.min(100, (atual - cg.inicio) / span * 100));
    const falta = Math.max(0, cg.kg - atual);
    const prazo = cg.prazo ? 'até ' + cg.prazo.split('-').reverse().slice(0, 2).join('/') : 'sem prazo';
    cards.push(`<section class="card"><div class="card-head"><span class="t">Meta de carga</span><span class="t">${prazo}</span></div>
      <div class="m-top"><span class="m-nome">${esc(cg.nome)}</span><span class="m-kg">${fmtNum(atual)} <span>→ ${fmtNum(cg.kg)} kg</span></span></div>
      <div class="prog"><i style="width:${pct}%"></i></div>
      <p class="m-frase">${falta ? `Partiu de ${fmtNum(cg.inicio)} kg · faltam ${fmtNum(falta)} kg` : 'Meta batida.'}</p></section>`);
  });
  if(m.kmMes){
    const ref = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const km = db.sessoes.filter(s => s.tipo === 'corrida' && new Date(s.data) >= ref).reduce((a, s) => a + (num(s.corrida?.km) || 0), 0);
    cards.push(`<section class="card"><div class="card-head"><span class="t">Corrida no mês</span><span class="m-kg">${fmtNum(km)} <span>/ ${m.kmMes} km</span></span></div>
      <div class="prog"><i style="width:${Math.min(100, km / m.kmMes * 100)}%"></i></div></section>`);
  }
  return `<div class="sec"><span>${temMetaSemanal() ? 'Metas da semana' : 'Metas'}</span><span>${temMetaSemanal() ? (restam === 1 ? 'último dia' : `${restam} dias restantes`) : ''}</span></div>
    <div class="metas-grid">${cards.join('')}</div>
    <div class="acoes" style="margin:0 0 4px"><button type="button" class="lnk" data-acao="metas">Editar metas</button></div>`;
}

/* ---------- tela de configurar metas ---------- */
let me = null;
function abrirMetas(){
  me = clone(db.metas);
  me.leve = db.metas.leveSemanas.includes(isoSemana(new Date()));
  me.form = { aberto: false, exId: '', kg: '', prazo: '', erro: false };
  aba = 'metas';
}
function opcoesExMeta(){
  const doPlano = [], vistos = new Set();
  plano().rotacao.forEach(k => plano().treinos[k].ex.forEach(e => { if(!vistos.has(e.id)){ vistos.add(e.id); doPlano.push(e); } }));
  const outros = BIB.filter(e => !vistos.has(e.id));
  return `<option value="">Escolha…</option><optgroup label="Plano ativo">${doPlano.map(e => `<option value="${e.id}" ${me.form.exId === e.id ? 'selected' : ''}>${esc(e.nome)}</option>`).join('')}</optgroup>
    <optgroup label="Outros">${outros.map(e => `<option value="${e.id}" ${me.form.exId === e.id ? 'selected' : ''}>${esc(e.nome)}</option>`).join('')}</optgroup>`;
}
function telaMetas(){
  const step = (campo, nome, unid) => {
    const v = me[campo];
    return `<div class="st-linha"><div><p class="m-nome">${nome}</p><p class="st-sub ${v ? 'on' : ''}">${v ? `${v} ${unid}` : 'sem meta'}</p></div>
      <div class="stepper"><button type="button" data-step="${campo}" data-d="-1" aria-label="Diminuir ${nome.toLowerCase()}">−</button>
      <span>${v ? v + (campo === 'kmMes' ? '' : '×') : '—'}</span>
      <button type="button" data-step="${campo}" data-d="1" aria-label="Aumentar ${nome.toLowerCase()}">+</button></div></div>`;
  };
  const cargas = me.cargas.length ? `<section class="card" style="padding-top:4px;padding-bottom:4px">${me.cargas.map((c, i) =>
      `<div class="cg-linha"><div><p class="m-nome">${esc(c.nome)}</p><p class="st-sub">${fmtNum(c.kg)} kg · ${c.prazo ? 'até ' + c.prazo.split('-').reverse().slice(0, 2).join('/') : 'sem prazo'}</p></div>
       <button type="button" class="ico" data-rm-carga="${i}" aria-label="Remover meta de ${esc(c.nome)}">${IC.lixo}</button></div>`).join('')}</section>`
    : (me.form.aberto ? '' : `<p class="cs" style="margin-bottom:4px">Nenhuma meta de carga. Ex.: chegar a um peso no supino até uma data.</p>`);
  const form = me.form.aberto ? `<section class="card form-meta">
      <label class="lb" for="mf-ex">Exercício</label><select class="inp" id="mf-ex" data-mf="exId">${opcoesExMeta()}</select>
      <div class="grid2" style="margin-top:10px">
        <div><label class="lb" for="mf-kg">Alvo</label><span class="field"><input id="mf-kg" inputmode="decimal" data-mf="kg" value="${esc(me.form.kg)}" placeholder="0"><small>kg</small></span></div>
        <div><label class="lb" for="mf-prazo">Prazo (opcional)</label><input class="inp" type="date" id="mf-prazo" data-mf="prazo" value="${esc(me.form.prazo)}"></div>
      </div>
      ${me.form.erro ? '<p class="erro">Escolha o exercício e o peso-alvo.</p>' : ''}
      <div class="acoes"><button type="button" class="mini-btn" data-acao="add-carga">Adicionar</button><button type="button" class="lnk" data-acao="cancelar-carga">Cancelar</button></div>
    </section>` : `<button type="button" class="btn sec-btn tracejado" data-acao="abrir-carga">+ Meta de carga</button>`;
  const leveTxt = me.leve ? `Ativa até domingo: meta de ${Math.max(1, me.academia - 1)}× academia. A sequência não quebra.` : 'Para semana de prova ou entrega: baixa 1 treino sem quebrar a sequência.';
  return cab('Plano · ajustes', 'Metas') +
    `<p class="cs" style="margin-top:12px">Tudo começa sem meta. Defina só o que fizer sentido agora.</p>
    <div class="metas-cfg">
    <div><div class="sec"><span>Frequência por semana</span></div>
      <section class="card">${step('academia', 'Academia', me.academia === 1 ? 'treino por semana' : 'treinos por semana')}${step('corrida', 'Corrida', me.corrida === 1 ? 'corrida por semana' : 'corridas por semana')}</section>
      ${me.academia ? `<section class="card ${me.leve ? 'leve-on' : ''}"><div class="st-linha"><div><p class="m-nome">Semana leve</p><p class="cs">${leveTxt}</p></div>
        <button type="button" class="switch" role="switch" aria-checked="${me.leve}" aria-label="Semana leve" data-acao="leve"><span></span></button></div></section>` : ''}
      <div class="sec"><span>Corrida no mês</span><span>opcional</span></div>
      <section class="card">${step('kmMes', 'Distância', 'km por mês')}</section>
    </div>
    <div><div class="sec"><span>Metas de carga</span><span>opcional</span></div>${cargas}${form}</div>
    </div>
    <button type="button" class="btn" data-acao="salvar-metas">Salvar metas</button>
    <div class="acoes"><button type="button" class="lnk" data-acao="voltar-plano">Cancelar</button></div>`;
}
function salvarMetas(){
  const sem = isoSemana(new Date());
  let leveSemanas = db.metas.leveSemanas.filter(s => s !== sem);
  if(me.leve && me.academia) leveSemanas.push(sem);
  db.metas = { academia: me.academia, corrida: me.corrida, kmMes: me.kmMes, cargas: me.cargas, leveSemanas, ocultarConvite: db.metas.ocultarConvite };
  me = null; aba = 'hoje'; save(); render(); window.scrollTo(0, 0); toast('Metas salvas');
}

let fichaAberta = null;

/* =========================================================
   HOJE
   ========================================================= */
function diaISO(d = new Date()){ return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function escolherTipo(k){ tipoSel = k; db.hoje = { dia: diaISO(), tipo: k }; save(); }
function limparEscolha(){ tipoSel = null; db.hoje = null; }
/* a escolha do treino vale só para o dia em que foi feita */
function tipoAtual(){
  if(!db.hoje || db.hoje.dia !== diaISO()){ tipoSel = null; db.hoje = null; }
  const rot = rotacao();
  return (tipoSel && (tipoSel === 'corrida' || rot.includes(tipoSel))) ? tipoSel : null;
}
function quandoFoi(k){
  const p = plano();
  for(let i = db.sessoes.length - 1; i >= 0; i--){
    const s = db.sessoes[i];
    if(k === 'corrida' ? s.tipo === 'corrida' : (s.tipo === k && doPlano(s, p))){
      const dias = Math.round((new Date(diaISO()) - new Date(diaISO(new Date(s.data)))) / 864e5);
      return dias === 0 ? 'feito hoje' : dias === 1 ? 'ontem' : `há ${dias} dias`;
    }
  }
  return 'nunca';
}
const diasDesde = iso => Math.floor((Date.now() - new Date(iso)) / 864e5);
const vibrar = p => { try{ if(navigator.vibrate && !matchMedia('(prefers-reduced-motion: reduce)').matches) navigator.vibrate(p); }catch(e){} };
const kgTxt = v => esc(String(v ?? '').replace('.', ','));
const ehApp = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

/* estado só da tela de treino (não salvo) */
const abertos = new Set();      // exercícios completos reabertos para editar
let trocando = null;            // exercício com o painel "trocar" aberto
let recemFechado = null;        // anima só o cartão que acabou de encolher
let recemMarcado = null;        // anima só o ✓ que acabou de ser tocado
let soInstalar = /iphone|ipad|ipod/i.test(navigator.userAgent) ? 'ios' : 'android';

function bannerSalvo(){
  const s = ultimaSalva && db.sessoes.find(x => x.id === ultimaSalva);
  if(!s) return '';
  const pode = db.desfazer && db.desfazer.id === s.id && Date.now() - db.desfazer.em < 5 * 60e3;
  return `<div class="banner" role="status"><p>${esc(tituloSessao(s).nome)} salvo</p>
    ${pode ? `<button type="button" class="lnk" data-acao="desfazer">Desfazer</button>` : ''}
    <button type="button" class="mini-btn" data-share="${s.id}" aria-label="Compartilhar">${IC.share}<span class="so-largo">Compartilhar</span></button>
    <button type="button" class="x-btn" data-acao="fechar-banner" aria-label="Fechar">${IC.x}</button></div>`;
}
function lembreteBackup(){
  if(db.sessoes.length < 3) return '';
  if(db.backupAdiadoAte && Date.now() < new Date(db.backupAdiadoAte)) return '';
  const ref = db.ultimoBackup || db.sessoes[0].data;
  const dias = diasDesde(ref);
  if(dias < 30) return '';
  const txt = db.ultimoBackup ? `Último backup há ${dias} dias` : 'Você ainda não fez backup';
  return `<section class="lembrete" role="status"><div><p class="ct">${txt}</p><p class="cs">Leva 2 segundos e protege seus registros.</p></div>
    <button type="button" class="mini-btn" data-acao="exportar">Exportar</button>
    <button type="button" class="x-btn" data-acao="adiar-backup" aria-label="Lembrar depois">${IC.x}</button></section>`;
}
function metasLinha(){
  const m = db.metas;
  if(!temAlgumaMeta()){
    if(m.ocultarConvite) return '';
    return `<section class="convite"><div><p class="ct">Sem metas por enquanto</p><p class="cs">Quantas vezes por semana você quer treinar e correr?</p></div>
      <button type="button" class="mini-btn" data-acao="metas">Definir</button>
      <button type="button" class="x-btn" data-acao="ocultar-convite" aria-label="Ocultar">${IC.x}</button></section>`;
  }
  let txt;
  if(temMetaSemanal()){
    const ini = segunda(new Date()); const { g, c } = contaSemana(ini);
    const partes = [];
    if(m.academia) partes.push(`academia ${g}/${metaAcad(ini)}`);
    if(m.corrida) partes.push(`corrida ${c}/${m.corrida}`);
    txt = `<b>Semana</b> · ${partes.join(' · ')}`;
  } else {
    const n = m.cargas.length + (m.kmMes ? 1 : 0);
    txt = `<b>Metas</b> · ${n} em andamento`;
  }
  return `<button type="button" class="metas-linha" data-ir="semana"><span>${txt}</span><span class="ml-ver">ver metas →</span></button>`;
}
let instalarAberto = false;   // aberto pelo botão "Como instalar" em Ajustes
function folhaInstalar(forcar = false){
  if(!forcar && (ehApp() || db.vistoInstalar || !matchMedia('(pointer: coarse)').matches)) return '';
  const passos = soInstalar === 'ios'
    ? ['Abra o site no Safari', 'Toque em Compartilhar (quadrado com seta)', 'Escolha “Adicionar à Tela de Início”']
    : ['Abra o site no Chrome', 'Toque no menu ⋮ no canto superior', 'Escolha “Instalar app”'];
  return `<div class="folha-fundo"><section class="folha" role="dialog" aria-modal="true" aria-labelledby="folha-tit">
    <div class="folha-alca" aria-hidden="true"></div>
    <p class="rot">${forcar ? 'Passo a passo' : 'Primeiro uso'}</p><h2 id="folha-tit">Instale o app</h2>
    <p class="cs" style="font-size:14px;margin-top:8px">Instalado, ele abre em tela cheia, funciona sem internet e o celular não apaga seus registros por falta de uso.</p>
    <div class="seg n2" role="tablist" aria-label="Sistema" style="margin-top:16px">
      <button type="button" role="tab" data-so="ios" aria-selected="${soInstalar === 'ios'}" class="${soInstalar === 'ios' ? 'on' : ''}">iPhone</button>
      <button type="button" role="tab" data-so="android" aria-selected="${soInstalar === 'android'}" class="${soInstalar === 'android' ? 'on' : ''}">Android</button>
    </div>
    <ol class="passos">${passos.map((p, i) => `<li><span>${i + 1}</span>${p}</li>`).join('')}</ol>
    ${pedidoInstalar ? `<button type="button" class="btn" data-acao="instalar" style="margin-top:16px">Instalar agora</button>` : ''}
    <button type="button" class="btn sec-btn" data-acao="fechar-instalar" style="margin-top:10px">${forcar ? 'Fechar' : 'Agora não'}</button>
  </section></div>`;
}

function telaHoje(){
  const rot = rotacao();
  const t = tipoAtual();
  const keys = [...rot, 'corrida'];
  const topo = bannerSalvo() + lembreteBackup() + metasLinha();
  if(!t){
    const opcoes = keys.map(k => {
      const foco = k === 'corrida' ? 'Cardio' : plano().treinos[k].foco;
      return `<button type="button" class="escolha" data-tipo="${k}">
        <span class="e-letra">${k === 'corrida' ? 'R' : k}</span>
        <span class="e-txt"><span class="e-nome">${k === 'corrida' ? 'Corrida' : 'Treino ' + k}</span><span class="e-foco">${esc(foco)}</span></span>
        <span class="e-quando">${quandoFoi(k)}</span></button>`;
    }).join('');
    return topo + cab('Hoje', 'Qual treino?', '', calendario()) +
      `<div class="sec"><span>Escolha o de hoje</span><span>${esc(plano().nome)}</span></div><div class="escolhas">${opcoes}</div>` + folhaInstalar();
  }
  const seg = keys.map(k =>
    `<button type="button" role="tab" aria-selected="${k === t}" data-tipo="${k}" class="${k === t ? 'on' : ''}">${k === 'corrida' ? 'Corrida' : k}</button>`
  ).join('');
  return topo + `<div class="seg n${keys.length}" role="tablist" aria-label="Treino">${seg}</div>` +
    (t === 'corrida' ? telaCorrida() : telaTreino(t)) + folhaInstalar();
}

function rascKey(t){ return db.planoAtivo + ':' + t; }
function rascunho(t){
  const rk = rascKey(t);
  const rd = db.rascunhos[rk] || (db.rascunhos[rk] = { ex: {}, trocas: {} });
  if(!rd.trocas) rd.trocas = {};
  return rd;
}
/* exercícios do treino já com as trocas do dia aplicadas */
function exerciciosDoDia(t){
  const rd = rascunho(t);
  return plano().treinos[t].ex.map(e => {
    const alt = rd.trocas[e.id] && BIB_ID[rd.trocas[e.id]];
    return alt ? { ...e, id: alt.id, nome: alt.nome, obs: '', orig: e.id, trocado: true } : { ...e, orig: e.id, trocado: false };
  });
}
function setsDe(rd, e){
  let sets = rd.ex[e.id];
  if(!sets || sets.length !== e.series){
    const old = sets || [];
    sets = rd.ex[e.id] = Array.from({ length: e.series }, (_, i) => old[i] || { kg: '', reps: '' });
  }
  return sets;
}
const completo = sets => sets.length && sets.every(s => s.reps !== '');
function alternativas(e, lista){
  const g = (BIB_ID[e.orig] || BIB_ID[e.id] || {}).g;
  if(!g) return [];
  return BIB.filter(b => b.g === g && b.id !== e.id && b.id !== e.orig && !lista.some(x => x.id === b.id)).slice(0, 5);
}

function telaTreino(t){
  const p = plano().treinos[t];
  const rd = rascunho(t);
  const lista = exerciciosDoDia(t);
  const totalSeries = lista.reduce((a, e) => a + e.series, 0);
  const cards = lista.map(e => {
    const sets = setsDe(rd, e);
    const feitas = sets.filter(s => s.reps !== '').length;
    if(completo(sets) && !abertos.has(e.id)){
      const resumo = sets.map(s => (s.kg ? kgTxt(s.kg) + ' kg × ' : '') + esc(s.reps)).join(' · ');
      return `<button type="button" class="ex-feito ${recemFechado === e.id ? 'novo' : ''}" data-abrir="${e.id}" aria-label="Editar ${esc(e.nome)}">
        <span class="ef-ok" aria-hidden="true">✓</span>
        <span class="ef-txt"><span class="ef-nome">${esc(e.nome)}</span><span class="ef-res">${resumo}</span></span>
        <span class="ef-ed">editar</span></button>`;
    }
    const last = ultimo(e.id);
    let ult = 'Sem registro anterior', hint = '';
    if(last){
      const kgs = last.sets.map(s => s.kg).filter(Boolean);
      const mesmoKg = kgs.length && kgs.every(k => k === kgs[0]);
      ult = `Última · ${fmtData(last.data)} · ` + (mesmoKg
        ? `${kgTxt(kgs[0])} kg × ${last.sets.map(s => esc(s.reps)).join(', ')}`
        : last.sets.map(s => `${s.kg ? kgTxt(s.kg) + '×' : ''}${esc(s.reps)}`).join(', '));
      if(last.sets.length >= e.series && last.sets.every(s => (num(s.reps) ?? 0) >= e.reps[1]))
        hint = `<p class="hint">${IC.up}Topo da faixa: suba a carga</p>`;
    }
    const alts = alternativas(e, lista);
    const painel = trocando === e.orig ? `<div class="troca"><p class="troca-t">Aparelho ocupado? Troque só hoje</p><div class="chips">
        ${e.trocado ? `<button type="button" class="chip" data-alt="" data-orig="${e.orig}">Voltar: ${esc(nomeEx(e.orig))}</button>` : ''}
        ${alts.map(a => `<button type="button" class="chip" data-alt="${a.id}" data-orig="${e.orig}">${esc(a.nome)}</button>`).join('') || (e.trocado ? '' : '<span class="cs">Sem alternativas na biblioteca.</span>')}
      </div></div>` : '';
    const linhas = sets.map((s, i) => {
      const ls = last && last.sets[i];
      const rot = `${esc(e.nome)}, série ${i + 1}`;
      const ok = s.reps !== '';
      const anima = recemMarcado === e.id + ':' + i ? 'pop' : '';
      return `<div class="set ${ok ? 'ok' : ''}" data-row="${e.id}:${i}"><span class="n">${String(i + 1).padStart(2, '0')}</span>
        <label class="field"><input inputmode="decimal" aria-label="${rot}, carga" data-ex="${e.id}" data-i="${i}" data-f="kg" value="${esc(s.kg)}" placeholder="${ls && ls.kg ? kgTxt(ls.kg) : '—'}"><small>kg</small></label>
        <label class="field"><input inputmode="numeric" aria-label="${rot}, repetições" data-ex="${e.id}" data-i="${i}" data-f="reps" value="${esc(s.reps)}" placeholder="${ls ? esc(ls.reps) : e.reps[0] + '–' + e.reps[1]}"><small>reps</small></label>
        <button type="button" class="chk ${anima}" data-ok="${e.id}" data-i="${i}" aria-pressed="${ok}" aria-label="${ok ? `Desfazer série ${i + 1}` : (ls ? `Repetir ${esc(ls.kg ? ls.kg + ' kg × ' : '')}${esc(ls.reps)}` : `Marcar série ${i + 1}`)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></button>
      </div>`;
    }).join('');
    return `<section class="card">
      <div class="ex-head"><div class="nome-i"><h2>${esc(e.nome)}</h2>${FICHAS[e.id] ? `<button type="button" class="info" data-ficha="${e.id}" aria-label="Ver ficha de ${esc(e.nome)}"><span>i</span></button>` : ''}</div><span class="ex-meta">${feitas}/${e.series} · ${e.series} × ${e.reps[0]}–${e.reps[1]}</span></div>
      <div class="ex-sub"><p class="ultima">${ult}${e.obs ? ' · ' + esc(e.obs) : ''}</p>
        <button type="button" class="trocar" data-trocar="${e.orig}" aria-expanded="${trocando === e.orig}">${trocando === e.orig ? 'Fechar' : (e.trocado ? 'Trocado' : 'Trocar')}</button></div>
      ${hint}${painel}
      <div class="sets">${linhas}</div></section>`;
  }).join('');
  recemFechado = null; recemMarcado = null;
  return cab('Treino de hoje', 'Treino ' + t, esc(p.foco), calendario()) +
    `<div class="sec"><span>Exercícios</span><span>${lista.length} · ${totalSeries} séries · 1–2 da falha</span></div>
    <p class="dica">Toque no ✓ para repetir a última série. Digite só quando mudar.</p>
    <div class="lista-ex">${cards}</div>
    <div class="barra-fixa">${barraProgresso(t)}<button type="button" class="btn-fixo" data-acao="concluir" data-t="${t}">Concluir</button></div>`;
}
function barraProgresso(t){
  const rd = rascunho(t);
  const lista = exerciciosDoDia(t);
  const ok = lista.filter(e => completo(setsDe(rd, e))).length;
  return `<div class="bf-info" id="bf-info"><p>${ok} de ${lista.length} exercícios</p>
    <div class="bf-segs" style="grid-template-columns:repeat(${lista.length},minmax(0,1fr))">${lista.map(e => `<i class="${completo(setsDe(rd, e)) ? 'on' : ''}"></i>`).join('')}</div></div>`;
}
function atualizarBarra(t){
  const el = $('#bf-info'); if(!el) return;
  const tmp = document.createElement('div'); tmp.innerHTML = barraProgresso(t);
  el.replaceWith(tmp.firstElementChild);
}

/* ---------- tela acesa durante o treino ---------- */
let wakeLock = null;
async function gerirTela(){
  const quer = aba === 'hoje' && !!tipoAtual() && !document.hidden;
  try{
    if(quer && !wakeLock && 'wakeLock' in navigator){
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if(!quer && wakeLock){
      const w = wakeLock; wakeLock = null; await w.release();
    }
  }catch(e){ wakeLock = null; }
}

function telaCorrida(){
  const rd = db.rascunhos.corrida || (db.rascunhos.corrida = { km: '', min: '', sens: '' });
  const p = pace(num(rd.km), num(rd.min));
  const sens = ['Leve', 'Moderada', 'Puxada'].map(s => `<button type="button" class="chip ${rd.sens === s ? 'on' : ''}" aria-pressed="${rd.sens === s}" data-sens="${s}">${s}</button>`).join('');
  return cab('Cardio', 'Corrida', 'Ritmo confortável', calendario()) +
    `<div class="sec"><span>Registro</span></div>
    <section class="card">
      <div class="grid2">
        <div><label class="lb" for="run-km">Distância</label><span class="field"><input id="run-km" inputmode="decimal" data-run="km" value="${esc(rd.km)}" placeholder="0"><small>km</small></span></div>
        <div><label class="lb" for="run-min">Tempo</label><span class="field"><input id="run-min" inputmode="decimal" data-run="min" value="${esc(rd.min)}" placeholder="0"><small>min</small></span></div>
      </div>
      <p class="pace" id="pace">Pace <b>${p ? p + ' /km' : '—'}</b></p>
      <p class="lb" style="margin-top:16px">Esforço</p><div class="chips">${sens}</div>
    </section>
    <button type="button" class="btn" data-acao="concluir-corrida">Salvar corrida</button>`;
}

/* =========================================================
   SEMANA / MÊS
   ========================================================= */
function telaSemana(){
  const toggle = `<div class="toggle" role="group" aria-label="Visão">
    <button type="button" data-visao="semana" class="${visao === 'semana' ? 'on' : ''}" aria-pressed="${visao === 'semana'}">Semana</button>
    <button type="button" data-visao="mes" class="${visao === 'mes' ? 'on' : ''}" aria-pressed="${visao === 'mes'}">Mês</button></div>`;
  return cab(temMetaSemanal() ? `Meta: ${[db.metas.academia ? db.metas.academia + '× academia' : '', db.metas.corrida ? db.metas.corrida + '× corrida' : ''].filter(Boolean).join(' · ')}` : 'Sem metas definidas', visao === 'mes' ? 'Mês' : 'Semana', '', toggle) +
    (visao === 'mes' ? visaoMes() : visaoSemana());
}

function visaoSemana(){
  const ini = segunda(new Date());
  const fim = new Date(ini); fim.setDate(fim.getDate() + 7);
  const daSemana = db.sessoes.filter(s => { const d = new Date(s.data); return d >= ini && d < fim; });
  const acad = daSemana.filter(s => s.tipo !== 'corrida').length;
  const corr = daSemana.filter(s => s.tipo === 'corrida');
  const km = corr.reduce((a, s) => a + (num(s.corrida?.km) || 0), 0);
  const nomes = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const hj = (new Date().getDay() + 6) % 7;
  const dias = nomes.map((n, i) => {
    const doDia = daSemana.filter(s => (new Date(s.data).getDay() + 6) % 7 === i);
    const marca = doDia.map(s => s.tipo === 'corrida' ? '<b class="r">R</b>' : `<b>${esc(s.tipo)}</b>`).join('') || '<b>&nbsp;</b>';
    return `<div class="dia ${i === hj ? 'hj' : ''}"><small>${n}</small>${marca}</div>`;
  }).join('');
  let linhas = '';
  for(let w = 0; w < 8; w++){
    const a = new Date(ini); a.setDate(a.getDate() - 7 * w);
    const b = new Date(a); b.setDate(b.getDate() + 7);
    const ss = db.sessoes.filter(s => { const d = new Date(s.data); return d >= a && d < b; });
    const g = ss.filter(s => s.tipo !== 'corrida').length;
    const k = ss.filter(s => s.tipo === 'corrida').reduce((x, s) => x + (num(s.corrida?.km) || 0), 0);
    linhas += `<tr><td>${fmtData(a)}</td>
      <td>${metaTxt(g, metaAcad(a))}<div class="bar"><i style="width:${Math.min(100, g / (metaAcad(a) || Math.max(3, g)) * 100)}%"></i></div></td>
      <td class="num">${k ? fmtNum(k) + ' km' : '—'}</td></tr>`;
  }
  return blocoMetas() + `<div class="sec"><span>Esta semana</span></div>
    <div class="stats">
      <div class="stat"><b>${metaTxt(acad, metaAcad(ini))}</b><span>academia</span></div>
      <div class="stat"><b>${metaTxt(corr.length, db.metas.corrida)}</b><span>corrida</span></div>
      <div class="stat"><b>${km ? fmtNum(km) : '0'}</b><span>km</span></div>
    </div>
    <div class="sec"><span>Dias</span><span>R = corrida</span></div><div class="dias">${dias}</div>
    <div class="sec"><span>Últimas 8 semanas</span></div>
    <div class="card"><table><tr><th>Semana de</th><th>Academia</th><th class="num">Corrida</th></tr>${linhas}</table></div>` + blocoVolume();
}

function visaoMes(){
  const hoje = new Date();
  const ref = new Date(hoje.getFullYear(), hoje.getMonth() + mesOffset, 1);
  const ano = ref.getFullYear(), mes = ref.getMonth();
  const fimMes = new Date(ano, mes + 1, 1);
  const doMes = db.sessoes.filter(s => { const d = new Date(s.data); return d >= ref && d < fimMes; });
  const porDia = {};
  doMes.forEach(s => { const k = new Date(s.data).getDate(); (porDia[k] = porDia[k] || []).push(s); });
  const offset = (ref.getDay() + 6) % 7;
  const nDias = new Date(ano, mes + 1, 0).getDate();
  let cels = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map(h => `<div class="h">${h}</div>`).join('');
  for(let i = 0; i < offset; i++) cels += '<div class="c fora" aria-hidden="true"></div>';
  for(let dia = 1; dia <= nDias; dia++){
    const ss = porDia[dia] || [];
    const ehHoje = mesOffset === 0 && dia === hoje.getDate();
    const marcas = ss.map(s => s.tipo === 'corrida' ? '<b class="r">R</b>' : `<b>${esc(s.tipo)}</b>`).join(' ');
    const desc = ss.length ? ss.map(s => tituloSessao(s).nome).join(', ') : 'sem registro';
    cels += `<div class="c ${ss.length ? 'fez' : ''} ${ehHoje ? 'hj' : ''}" aria-label="Dia ${dia}: ${desc}"><small>${dia}</small><span>${marcas}</span></div>`;
  }
  const acad = doMes.filter(s => s.tipo !== 'corrida').length;
  const corr = doMes.filter(s => s.tipo === 'corrida');
  const km = corr.reduce((a, s) => a + (num(s.corrida?.km) || 0), 0);
  // semanas (seg–dom) que começam neste mês e bateram a meta de academia
  let semanasMeta = 0, semanasTotal = 0;
  for(let d = segunda(ref); d < fimMes; d.setDate(d.getDate() + 7)){
    if(d.getMonth() !== mes && d < ref) continue;
    const f = new Date(d); f.setDate(f.getDate() + 7);
    if(d > hoje) break;
    semanasTotal++;
    if(semanaNaMeta(d)) semanasMeta++;
  }
  const titulo = ref.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return `<div class="mes-wrap"><div class="mes-nav">
      <button type="button" class="icon-btn" data-mes="-1" aria-label="Mês anterior">${IC.esq}</button>
      <h2>${titulo}</h2>
      <button type="button" class="icon-btn" data-mes="1" aria-label="Próximo mês" ${mesOffset >= 0 ? 'disabled style="opacity:.35"' : ''}>${IC.dir}</button>
    </div>
    <div class="mes">${cels}</div>
    <div class="sec"><span>Resumo do mês</span><span>R = corrida</span></div>
    <div class="stats">
      <div class="stat"><b>${acad}</b><span>academia</span></div>
      <div class="stat"><b>${km ? fmtNum(km) : '0'}</b><span>km · ${corr.length} corr.</span></div>
      ${temMetaSemanal() ? `<div class="stat"><b>${semanasMeta}/${semanasTotal}</b><span>semanas na meta</span></div>` : `<div class="stat"><b>${Object.keys(porDia).length}</b><span>dias ativos</span></div>`}
    </div></div>`;
}

/* =========================================================
   HISTÓRICO + DASHBOARD
   ========================================================= */
function subidasDeCarga(){
  const max = {}; let n = 0;
  for(const s of db.sessoes){
    if(!s.ex) continue;
    for(const [id, sets] of Object.entries(s.ex)){
      const b = melhorSerie(sets); if(!b || !b.kg) continue;
      if(max[id] != null && b.kg > max[id]) n++;
      if(max[id] == null || b.kg > max[id]) max[id] = b.kg;
    }
  }
  return n;
}
function graficoLinha(pts){
  const W = 600, H = 240, L = 46, R = 18, T = 22, B = 34;
  const vs = pts.map(p => p.v);
  let mn = Math.min(...vs), mx = Math.max(...vs);
  if(mn === mx){ mn -= 5; mx += 5; }
  const pad = (mx - mn) * .15; mn = Math.max(0, mn - pad); mx += pad;
  const x = i => L + (pts.length === 1 ? (W - L - R) / 2 : i * (W - L - R) / (pts.length - 1));
  const y = v => T + (H - T - B) * (1 - (v - mn) / (mx - mn));
  let g = '';
  for(let k = 0; k <= 3; k++){
    const v = mn + (mx - mn) * k / 3, yy = y(v);
    g += `<line class="grade" x1="${L}" x2="${W - R}" y1="${yy}" y2="${yy}"/><text x="${L - 8}" y="${yy + 4}" text-anchor="end">${Math.round(v)}</text>`;
  }
  const linha = pts.map((p, i) => `${x(i)},${y(p.v)}`).join(' ');
  const ptsSvg = pts.map((p, i) => `<circle class="pt" cx="${x(i)}" cy="${y(p.v)}" r="5"><title>${fmtData(p.d)}: ${fmtNum(p.v)} kg</title></circle>`).join('');
  const ult = pts[pts.length - 1];
  const lab = `<text class="val" x="${x(pts.length - 1)}" y="${y(ult.v) - 12}" text-anchor="end">${fmtNum(ult.v)} kg</text>`;
  const xs = `<text x="${L}" y="${H - 8}">${fmtData(pts[0].d)}</text><text x="${W - R}" y="${H - 8}" text-anchor="end">${fmtData(ult.d)}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolução por treino, de ${fmtNum(pts[0].v)} a ${fmtNum(ult.v)} kg">${g}<polyline class="linha" points="${linha}"/>${ptsSvg}${lab}${xs}</svg>`;
}
function graficoFrequencia(){
  const W = 600, H = 220, L = 30, R = 10, T = 18, B = 34, N = 12;
  const ini = segunda(new Date());
  const semanas = [];
  for(let w = N - 1; w >= 0; w--){
    const a = new Date(ini); a.setDate(a.getDate() - 7 * w);
    const b = new Date(a); b.setDate(b.getDate() + 7);
    semanas.push({ a, n: db.sessoes.filter(s => { const d = new Date(s.data); return s.tipo !== 'corrida' && d >= a && d < b; }).length });
  }
  const mA = db.metas.academia;
  const mx = Math.max((mA || 3) + 1, ...semanas.map(s => s.n));
  const bw = (W - L - R) / N;
  const y = v => T + (H - T - B) * (1 - v / mx);
  let barras = '';
  semanas.forEach((s, i) => {
    const h = Math.max(3, (H - T - B) * s.n / mx);
    barras += `<rect class="barra ${s.n ? '' : 'zero'}" x="${L + i * bw + bw * .18}" y="${H - B - h}" width="${bw * .64}" height="${h}" rx="3"><title>Semana de ${fmtData(s.a)}: ${s.n}</title></rect>`;
    if(s.n) barras += `<text class="val" x="${L + i * bw + bw / 2}" y="${H - B - h - 6}" text-anchor="middle">${s.n}</text>`;
  });
  const meta = mA ? `<line class="meta" x1="${L}" x2="${W - R}" y1="${y(mA)}" y2="${y(mA)}"/>` : '';
  const xs = `<text x="${L}" y="${H - 8}">${fmtData(semanas[0].a)}</text><text x="${W - R}" y="${H - 8}" text-anchor="end">${fmtData(semanas[N - 1].a)}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Treinos de academia por semana nas últimas ${N} semanas">${meta}${barras}${xs}</svg>`;
}

/* ---------- força estimada (Epley) e carga máxima ---------- */
let dashModo = 'forca';
const forcaEst = (kg, r) => kg * (1 + r / 30);
function serieCarga(exId, modo = dashModo){
  return db.sessoes.filter(s => s.ex && s.ex[exId]).map(s => {
    let v = 0;
    for(const z of s.ex[exId]){
      const kg = num(z.kg) || 0, r = num(z.reps) || 0;
      if(!kg) continue;
      v = Math.max(v, modo === 'forca' ? forcaEst(kg, r) : kg);
    }
    return { d: s.data, v };
  }).filter(p => p.v > 0);
}

/* ---------- séries por músculo ---------- */
let volModo = 'semana';
function blocoVolume(){
  const ini = segunda(new Date());
  let a, b, div;
  if(volModo === 'semana'){ a = ini; b = new Date(ini); b.setDate(b.getDate() + 7); div = 1; }
  else { a = new Date(ini); a.setDate(a.getDate() - 28); b = ini; div = 4; }
  const conta = {};
  db.sessoes.forEach(s => {
    const d = new Date(s.data); if(!s.ex || d < a || d >= b) return;
    for(const [id, sets] of Object.entries(s.ex)){
      const f = FICHAS[id];
      if(f){ f.p.forEach(g => conta[g] = (conta[g] || 0) + sets.length); f.s.forEach(g => conta[g] = (conta[g] || 0) + sets.length / 2); }
      else { const g = BIB_ID[id]?.g; if(g) conta[g] = (conta[g] || 0) + sets.length; }
    }
  });
  const doPlanoG = new Set();
  plano().rotacao.forEach(k => plano().treinos[k].ex.forEach(e => { const g = BIB_ID[e.id]?.g; if(g) doPlanoG.add(g); }));
  const grupos = Object.keys(GRUPOS).filter(g => doPlanoG.has(g) || conta[g]);
  if(!grupos.length) return '';
  const linhas = grupos.map(g => {
    const v = Math.round((conta[g] || 0) / div * 10) / 10;
    const cls = v >= 10 ? 'na-faixa' : (v ? 'abaixo' : '');
    return `<div class="vol-l"><span>${GRUPOS[g]}</span>
      <div class="vol-b" role="img" aria-label="${GRUPOS[g]}: ${fmtNum(v)} séries"><i class="faixa"></i><i class="valor ${cls}" style="width:${Math.min(100, v / 24 * 100)}%"></i></div>
      <b>${fmtNum(v)}</b></div>`;
  }).join('');
  return `<div class="sec sec-vol"><span>Séries por músculo</span>
    <div class="toggle mini" role="group" aria-label="Período">
      <button type="button" data-vol="semana" class="${volModo === 'semana' ? 'on' : ''}" aria-pressed="${volModo === 'semana'}">Esta semana</button>
      <button type="button" data-vol="media" class="${volModo === 'media' ? 'on' : ''}" aria-pressed="${volModo === 'media'}">Média 4 sem.</button></div></div>
    <section class="card vol">
      <div class="vol-l vol-esc" aria-hidden="true"><span></span><div class="vol-escala"><span style="left:41.67%">10</span><span style="left:83.33%">20</span></div><b></b></div>
      ${linhas}
      <p class="m-frase vol-nota">Faixa verde: 10–20 séries por músculo por semana, referência da literatura para hipertrofia. Músculos secundários contam meia série. Abaixo da faixa ainda há ganho, só mais devagar.</p>
    </section>`;
}

function telaHistorico(){
  const topo = cab(`${db.sessoes.length} registros`, 'Histórico');
  if(!db.sessoes.length) return topo + `<p class="vazio">Nenhum treino registrado ainda.</p>`;
  const agora = new Date();
  const ini = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const doMes = db.sessoes.filter(s => new Date(s.data) >= ini);
  const kmMes = doMes.filter(s => s.tipo === 'corrida').reduce((a, s) => a + (num(s.corrida?.km) || 0), 0);

  const conta = {};
  db.sessoes.forEach(s => s.ex && Object.entries(s.ex).forEach(([id, sets]) => { if(sets.some(x => num(x.kg))) conta[id] = (conta[id] || 0) + 1; }));
  const exs = Object.keys(conta).sort((a, b) => conta[b] - conta[a]);
  if(!dashEx || !conta[dashEx]) dashEx = exs[0] || null;
  let cargaCard;
  if(!dashEx){
    cargaCard = `<p class="chart-vazio">Registre cargas para ver a evolução.</p>`;
  } else {
    const pts = serieCarga(dashEx);
    const opts = exs.map(id => `<option value="${id}" ${id === dashEx ? 'selected' : ''}>${esc(nomeEx(id))}</option>`).join('');
    const ult = pts[pts.length - 1], pri = pts[0];
    const delta = ult && pri ? ult.v - pri.v : 0;
    cargaCard = `<div class="card-head"><select id="dash-ex" aria-label="Exercício">${opts}</select>
        <div class="toggle mini" role="group" aria-label="Medida">
          <button type="button" data-modo="forca" class="${dashModo === 'forca' ? 'on' : ''}" aria-pressed="${dashModo === 'forca'}">Força</button>
          <button type="button" data-modo="carga" class="${dashModo === 'carga' ? 'on' : ''}" aria-pressed="${dashModo === 'carga'}">Carga</button></div></div>
      ${ult ? `<div class="forca-n"><b>${fmtNum(ult.v)}</b><span>kg</span>${pts.length >= 2 ? `<em>${delta >= 0 ? '+' : ''}${fmtNum(delta)} kg desde ${fmtData(pri.d)}</em>` : ''}</div>` : ''}
      <p class="cs">${dashModo === 'forca' ? 'Força estimada (1RM) da melhor série: junta peso e repetições, então 40×12 e 45×5 ficam comparáveis.' : 'Maior peso usado em cada treino.'}</p>` +
      (pts.length >= 2 ? `<div class="chart" style="margin-top:8px">${graficoLinha(pts)}</div>` : `<p class="chart-vazio">Mais um treino com ${esc(nomeEx(dashEx))} e a linha aparece aqui.</p>`);
  }

  const itens = db.sessoes.slice().reverse().map(s => {
    const data = fmtData(s.data, { weekday: 'short', day: '2-digit', month: '2-digit' });
    const ts = tituloSessao(s);
    let tit, corpo;
    if(s.tipo === 'corrida'){
      const c = s.corrida || {};
      const p = pace(num(c.km), num(c.min));
      tit = `Corrida · ${c.km ? esc(c.km) + ' km' : ''}`;
      corpo = `<p><span>Tempo</span> ${c.min ? esc(c.min) + ' min' : '—'}</p><p><span>Pace</span> ${p ? p + ' /km' : '—'}</p><p><span>Esforço</span> ${esc(c.sens) || '—'}</p>`;
    } else {
      tit = `${esc(ts.nome)} · ${esc(ts.foco)}`;
      corpo = Object.entries(s.ex || {}).map(([id, sets]) =>
        `<p>${esc(nomeEx(id))}<br><span>${sets.map(x => (x.kg ? esc(x.kg) + ' kg × ' : '') + esc(x.reps)).join(' · ')}</span></p>`).join('');
    }
    return `<details class="card"><summary><span class="h-tit">${tit}</span><span class="h-data">${data}</span></summary>
      <div class="h-body">${corpo}<div class="h-acoes">
        <button type="button" class="lnk" data-share="${s.id}">${IC.share}Compartilhar</button>
        <button type="button" class="del" data-del="${s.id}">Excluir</button></div></div></details>`;
  }).join('');

  return topo + `<div class="sec"><span>Painel</span><span>${agora.toLocaleDateString('pt-BR', { month: 'long' })}</span></div>
    <div class="stats">
      <div class="stat"><b>${doMes.filter(s => s.tipo !== 'corrida').length}</b><span>treinos</span></div>
      <div class="stat"><b>${kmMes ? fmtNum(kmMes) : '0'}</b><span>km</span></div>
      <div class="stat"><b>${subidasDeCarga()}</b><span>subidas de carga</span></div>
    </div>
    <div class="dash-grid" style="margin-top:12px">
      <div class="card">${cargaCard}</div>
      <div class="card"><div class="card-head"><span class="t">Treinos por semana</span></div>
        <div class="chart">${graficoFrequencia()}</div>
        ${db.metas.academia ? `<div class="legenda"><span><i></i>meta de ${db.metas.academia}</span></div>` : ''}</div>
    </div>
    <div class="sec"><span>Registros</span></div>${itens}`;
}

/* =========================================================
   PLANO + EDITOR + GERADOR
   ========================================================= */
const VERSAO = 'v12 · out/2026';
let planoSecao = 'plano';      // plano | ajustes
function telaPlano(){
  const p = plano();
  const lista = Object.values(db.planos);
  const abas = `<div class="seg n2" role="group" aria-label="Seção" style="margin-top:16px">
    <button type="button" data-secao="plano" class="${planoSecao === 'plano' ? 'on' : ''}" aria-pressed="${planoSecao === 'plano'}">Meu plano</button>
    <button type="button" data-secao="ajustes" class="${planoSecao === 'ajustes' ? 'on' : ''}" aria-pressed="${planoSecao === 'ajustes'}">Ajustes</button></div>`;
  const topo = cab(planoSecao === 'plano' ? `Rotação ${p.rotacao.join(' → ')}` : 'Metas, dados e app', 'Plano') + abas;

  if(planoSecao === 'ajustes'){
    const resumoMetas = temAlgumaMeta()
      ? [db.metas.academia ? db.metas.academia + '× academia' : '', db.metas.corrida ? db.metas.corrida + '× corrida' : '', db.metas.kmMes ? db.metas.kmMes + ' km/mês' : '', db.metas.cargas.length ? db.metas.cargas.length + ' de carga' : ''].filter(Boolean).join(' · ')
      : 'Nenhuma meta definida';
    const backup = db.ultimoBackup ? (diasDesde(db.ultimoBackup) ? 'há ' + diasDesde(db.ultimoBackup) + ' dias' : 'hoje') : 'nunca';
    return topo + `<div class="plano-grid ajustes">
      <div><div class="sec"><span>Metas</span></div>
        <div class="card"><div class="st-linha"><div><p class="m-nome">${resumoMetas}</p><p class="cs">Frequência semanal, carga e corrida. Tudo opcional.</p></div>
          <button type="button" class="mini-btn" data-acao="metas">${temAlgumaMeta() ? 'Editar' : 'Definir'}</button></div></div></div>
      <div><div class="sec"><span>Seus dados</span></div>
        <div class="card txt">
          <div class="backup-st"><span>Armazenamento protegido</span><span class="${db.persistido || ehApp() ? 'st-ok' : ''}">${db.persistido ? '✓ ativo' : (ehApp() ? '✓ app instalado' : 'não confirmado')}</span></div>
          <div class="backup-st"><span>Último backup</span><span class="${db.ultimoBackup && diasDesde(db.ultimoBackup) < 30 ? 'st-ok' : 'st-alerta'}">${backup}</span></div>
          <p class="cs">Registros, planos e metas ficam neste navegador. Exporte de vez em quando para não perder ao trocar de aparelho.</p>
          <div class="acoes" style="align-items:center;gap:16px">
            <button type="button" class="mini-btn" data-acao="exportar">Exportar backup</button>
            <button type="button" class="lnk" data-acao="importar">Importar</button>
          </div>
          <input type="file" id="arq" accept="application/json,.json" hidden>
        </div></div>
      <div><div class="sec"><span>App</span></div>
        <div class="card txt">
          <div class="backup-st"><span>Instalado na tela inicial</span><span class="${ehApp() ? 'st-ok' : ''}">${ehApp() ? '✓ sim' : 'não'}</span></div>
          <div class="backup-st"><span>Versão</span><span>${VERSAO}</span></div>
          ${ehApp() ? '' : `<p class="cs" style="margin-top:10px">Instalado, ele abre em tela cheia, funciona sem internet e o celular não apaga seus registros por falta de uso.</p>
          <div class="acoes"><button type="button" class="mini-btn" data-acao="como-instalar">Como instalar</button>
          <span class="instalar" id="instalarBox"><button type="button" class="mini-btn" data-acao="instalar">Instalar agora</button></span></div>`}
        </div></div>
    </div>`;
  }

  const seletor = lista.length > 1
    ? `<label class="lb" for="plano-ativo">Plano ativo</label><select class="inp" id="plano-ativo">${lista.map(x => `<option value="${x.id}" ${x.id === p.id ? 'selected' : ''}>${esc(x.nome)}</option>`).join('')}</select>`
    : `<p class="lb">Plano ativo</p><p style="font-weight:600;font-size:18px">${esc(p.nome)}</p>`;
  const series = p.rotacao.map(k => p.treinos[k].ex.reduce((a, e) => a + e.series, 0));
  const blocos = p.rotacao.map(k => {
    const t = p.treinos[k];
    return `<div><div class="sec"><span>Treino ${k}</span><span>${esc(t.foco)}</span></div><div class="card"><ul class="plano">${
      t.ex.map(e => `<li><span class="nome-i" style="color:inherit;font:inherit;flex:1;white-space:normal">${esc(e.nome)}${FICHAS[e.id] ? `<button type="button" class="info" data-ficha="${e.id}" aria-label="Ver ficha de ${esc(e.nome)}"><span>i</span></button>` : ''}</span><span>${e.series} × ${e.reps[0]}–${e.reps[1]}</span></li>`).join('')}</ul></div></div>`;
  }).join('');
  return topo + `<div class="sec"><span>Seus planos</span><span>${lista.length} ${lista.length === 1 ? 'plano' : 'planos'}</span></div>
    <div class="card">${seletor}
      <p class="cs" style="margin-top:4px">Rotação ${p.rotacao.join(' → ')} · ${Math.min(...series) === Math.max(...series) ? Math.min(...series) : Math.min(...series) + '–' + Math.max(...series)} séries por treino</p>
      <div class="acoes">
        <button type="button" class="mini-btn" data-acao="editar">Editar</button>
        <button type="button" class="mini-btn" data-acao="novo">Novo</button>
        <button type="button" class="mini-btn" data-acao="gerador">Gerar</button>
      </div></div>
    <div class="plano-grid">${blocos}</div>
    <div class="sec"><span>Método</span></div>
    <div class="card txt">
      <p><b>Séries de trabalho:</b> 2–3 por exercício, até 1–2 repetições da falha. Aquecimento não conta.</p>
      <p><b>Progressão dupla:</b> ao completar o topo da faixa em todas as séries, suba a carga (~2,5–5%) e volte ao início da faixa.</p>
      <p><b>Descanso:</b> 2–3 min nos compostos, 1–2 min nos isolados.</p>
    </div>`;
}

/* ---------- editor ---------- */
function abrirEditor(p){
  ed = p ? { id: p.id, nome: p.nome, novo: false, treinos: p.rotacao.map(k => clone(p.treinos[k])) }
         : { id: null, nome: '', novo: true, treinos: [{ foco: '', ex: [] }] };
  aba = 'editor';
}
function exDaBib(id){
  const b = BIB_ID[id];
  return { id: b.id, nome: b.nome, series: b.k === 'c' ? 3 : 2, reps: [...b.r] };
}
function opcoesBib(){
  let html = '<option value="">Adicionar exercício…</option>';
  for(const [g, nomeG] of Object.entries(GRUPOS)){
    html += `<optgroup label="${nomeG}">` + BIB.filter(e => e.g === g).map(e => `<option value="${e.id}">${esc(e.nome)}</option>`).join('') + '</optgroup>';
  }
  return html + '<option value="__outro">Outro (digitar nome)…</option>';
}
function telaEditor(){
  const ops = opcoesBib();
  const treinos = ed.treinos.map((t, ti) => {
    const linhas = t.ex.map((e, ei) => `<div class="ed-ex">
        <div class="ed-top"><span class="nome">${esc(e.nome)}</span>
          <button type="button" class="ico" data-ed="up" data-ti="${ti}" data-ei="${ei}" aria-label="Subir ${esc(e.nome)}" ${ei === 0 ? 'disabled' : ''}>${IC.cima}</button>
          <button type="button" class="ico" data-ed="down" data-ti="${ti}" data-ei="${ei}" aria-label="Descer ${esc(e.nome)}" ${ei === t.ex.length - 1 ? 'disabled' : ''}>${IC.baixo}</button>
          <button type="button" class="ico" data-ed="del" data-ti="${ti}" data-ei="${ei}" aria-label="Remover ${esc(e.nome)}">${IC.lixo}</button>
        </div>
        <div class="ed-nums">
          <label>Séries<input inputmode="numeric" data-pe="series" data-ti="${ti}" data-ei="${ei}" value="${e.series}"></label>
          <label>Reps mín.<input inputmode="numeric" data-pe="rmin" data-ti="${ti}" data-ei="${ei}" value="${e.reps[0]}"></label>
          <label>Reps máx.<input inputmode="numeric" data-pe="rmax" data-ti="${ti}" data-ei="${ei}" value="${e.reps[1]}"></label>
        </div></div>`).join('');
    return `<div><div class="sec"><span>Treino ${LETRAS[ti]}</span>${ed.treinos.length > 1 ? `<button type="button" class="del-treino" data-ed="del-treino" data-ti="${ti}">Remover treino</button>` : ''}</div>
      <div class="card">
        <label class="lb" for="foco-${ti}">Foco</label>
        <input class="inp" id="foco-${ti}" data-pe="foco" data-ti="${ti}" value="${esc(t.foco)}" placeholder="Ex.: Peito, ombro e tríceps">
        <div style="margin-top:14px">${linhas || '<p class="chart-vazio" style="padding:4px 0 0">Nenhum exercício ainda.</p>'}</div>
        <select class="inp ed-add" data-add-ex="${ti}" aria-label="Adicionar exercício ao treino ${LETRAS[ti]}">${ops}</select>
        ${ed.outro === ti ? `<div class="outro-box"><label class="lb" for="outro-nome">Nome do exercício</label>
          <input class="inp" id="outro-nome" data-pe="outroNome" value="${esc(ed.outroNome || '')}" placeholder="Ex.: Supino na máquina articulada">
          <p class="cs" style="margin-top:6px">Exercícios próprios entram sem ficha ilustrada.</p>
          <div class="acoes" style="align-items:center;gap:16px"><button type="button" class="mini-btn" data-ed="add-outro" data-ti="${ti}">Adicionar</button><button type="button" class="lnk" data-ed="cancel-outro">Cancelar</button></div></div>` : ''}
      </div></div>`;
  }).join('');
  return cab(ed.novo ? 'Novo plano' : 'Editando plano', 'Editor') +
    `<div class="sec"><span>Nome</span></div>
    <div class="card"><label class="lb" for="ed-nome">Nome do plano</label>
      <input class="inp" id="ed-nome" data-pe="nome" value="${esc(ed.nome)}" placeholder="Ex.: ABC · mestrado"></div>
    <div class="plano-grid">${treinos}</div>
    ${ed.treinos.length < LETRAS.length ? `<button type="button" class="btn sec-btn" data-ed="add-treino" style="margin-top:12px">+ Adicionar treino ${LETRAS[ed.treinos.length]}</button>` : ''}
    <button type="button" class="btn" data-ed="salvar">Salvar plano</button>
    <div class="acoes" style="justify-content:space-between">
      <button type="button" class="lnk" data-ed="cancelar">Cancelar</button>
      ${!ed.novo && Object.keys(db.planos).length > 1 ? `<button type="button" class="del" data-ed="excluir">Excluir plano</button>` : ''}
    </div>`;
}
function salvarEditor(){
  const nome = ed.nome.trim();
  if(!nome){ toast('Dê um nome ao plano'); return; }
  if(ed.treinos.some(t => !t.ex.length)){ toast('Cada treino precisa de ao menos um exercício'); return; }
  const id = ed.id || ('p' + Date.now().toString(36));
  const rot = ed.treinos.map((_, i) => LETRAS[i]);
  const treinos = {};
  ed.treinos.forEach((t, i) => {
    treinos[rot[i]] = { foco: t.foco.trim() || 'Treino ' + rot[i], ex: t.ex.map(e => {
      const a = Math.max(1, parseInt(e.reps[0]) || 1), b = Math.max(a, parseInt(e.reps[1]) || a);
      return { ...e, series: Math.min(10, Math.max(1, parseInt(e.series) || 1)), reps: [a, b] };
    })};
  });
  db.planos[id] = { id, nome, rotacao: rot, treinos };
  db.planoAtivo = id; limparEscolha(); ed = null; aba = 'plano';
  save(); render(); window.scrollTo(0, 0); toast('Plano salvo e ativado');
}

/* ---------- gerador ---------- */
const SLOTS = {
  peitoC: ['supino-reto', 'supino-reto-halteres', 'supino-maquina'], peitoInc: ['supino-inclinado', 'supino-inclinado-barra'], peitoIso: ['voador', 'crossover', 'crucifixo-halteres'],
  ombroC: ['desenvolvimento', 'desenvolvimento-barra', 'desenvolvimento-maquina'], ombroIso: ['elevacao-lateral', 'elevacao-lateral-polia'],
  triceps: ['triceps-overhead-polia', 'triceps-pulley', 'triceps-frances', 'triceps-testa', 'mergulho'],
  costasV: ['barra-fixa', 'puxada-alta', 'puxada-neutra'], costasH: ['remada', 'remada-cavalinho', 'remada-maquina', 'remada-baixa'], postOmbro: ['crucifixo-inverso', 'face-pull'],
  biceps: ['rosca-direta', 'rosca-inclinada', 'rosca-martelo', 'rosca-alternada', 'rosca-scott'],
  quadC: ['agachamento', 'hack-smith', 'leg-press', 'bulgaro'], postC: ['stiff', 'stiff-unilateral'], gluteo: ['elevacao-pelvica'],
  quadIso: ['extensora', 'afundo'], postIso: ['flexora-sentada', 'flexora', 'stiff-unilateral'], pant: ['panturrilha', 'panturrilha-leg-press', 'panturrilha-sentado'],
  core: ['abdominal', 'elevacao-pernas', 'prancha', 'pallof'],
};
const SESSOES = {
  push:  { foco: 'Peito, ombro e tríceps', s: ['peitoC', 'ombroC', 'peitoInc', 'ombroIso', 'triceps', 'triceps', 'peitoIso'] },
  pull:  { foco: 'Costas e bíceps',        s: ['costasV', 'costasH', 'costasH', 'postOmbro', 'biceps', 'biceps', 'core'] },
  legs:  { foco: 'Pernas e core',          s: ['quadC', 'postC', 'quadIso', 'postIso', 'pant', 'core', 'gluteo'] },
  upper: { foco: 'Superiores',             s: ['peitoC', 'costasH', 'ombroC', 'costasV', 'ombroIso', 'biceps', 'triceps'] },
  lower: { foco: 'Inferiores e core',      s: ['quadC', 'postC', 'gluteo', 'quadIso', 'postIso', 'pant', 'core'] },
  full:  { foco: 'Corpo inteiro',          s: ['quadC', 'peitoC', 'costasH', 'postC', 'ombroC', 'costasV', 'core'] },
};
const DIVISOES = {
  2: { nome: 'AB · corpo inteiro', s: ['full', 'full'], txt: 'Dois treinos de corpo inteiro, alternando exercícios.' },
  3: { nome: 'ABC · empurrar, puxar, pernas', s: ['push', 'pull', 'legs'], txt: 'Empurrar (peito, ombro, tríceps), puxar (costas, bíceps) e pernas.' },
  4: { nome: 'ABCD · superiores e inferiores', s: ['upper', 'lower', 'upper', 'lower'], txt: 'Superiores e inferiores, duas vezes cada, com variações.' },
  5: { nome: 'ABCDE · híbrido', s: ['push', 'pull', 'legs', 'upper', 'lower'], txt: 'Empurrar, puxar, pernas, depois superiores e inferiores.' },
};
const EX_POR_TEMPO = { 35: 4, 50: 6, 65: 7 };
function gerarPlano(){
  const div = DIVISOES[gen.dias];
  const n = EX_POR_TEMPO[gen.tempo];
  const usadosPlano = new Set();
  const treinos = div.s.map(tipo => {
    const sess = SESSOES[tipo];
    const usados = new Set(); const ex = [];
    for(const slot of sess.s){
      if(ex.length >= n) break;
      const cands = SLOTS[slot].filter(id => gen.eq === 'completa' || BIB_ID[id].eq === 'b').filter(id => !usados.has(id));
      if(!cands.length) continue;
      const id = cands.find(c => !usadosPlano.has(c)) || cands[0];
      usados.add(id); usadosPlano.add(id);
      const e = exDaBib(id);
      if(gen.tempo === 35 && BIB_ID[id].k === 'i') e.series = 2;
      ex.push(e);
    }
    return { foco: sess.foco, ex };
  });
  ed = { id: null, nome: div.nome, novo: true, treinos };
  aba = 'editor';
}
function telaGerador(){
  const op = (campo, vals, rot) => `<div class="gen-bloco"><p class="lb">${rot}</p><div class="chips">${
    vals.map(([v, t]) => `<button type="button" class="chip ${gen[campo] === v ? 'on' : ''}" aria-pressed="${gen[campo] === v}" data-gen="${campo}" data-v="${v}">${t}</button>`).join('')}</div></div>`;
  const div = DIVISOES[gen.dias];
  return cab('Novo plano automático', 'Gerador') +
    `<div class="sec"><span>Sua rotina</span></div>
    <div class="card">
      ${op('dias', [[2, '2 dias'], [3, '3 dias'], [4, '4 dias'], [5, '5 dias']], 'Dias de academia por semana')}
      <div style="height:14px"></div>
      ${op('tempo', [[35, '~35 min'], [50, '~50 min'], [65, '~65 min']], 'Tempo por treino')}
      <div style="height:14px"></div>
      ${op('eq', [['completa', 'Completa'], ['basica', 'Básica (pesos livres)']], 'Academia')}
    </div>
    <div class="sec"><span>Divisão</span><span>${EX_POR_TEMPO[gen.tempo]} exercícios por treino</span></div>
    <div class="card"><p style="font-weight:600">${div.nome}</p><p class="split">${div.txt} Compostos primeiro, 2–3 séries perto da falha.</p></div>
    <button type="button" class="btn" data-acao="gerar">Gerar e revisar</button>
    <div class="acoes"><button type="button" class="lnk" data-acao="voltar-plano">Cancelar</button></div>`;
}

/* =========================================================
   COMPARTILHAR (imagem 1080×1920, formato story)
   ========================================================= */
async function gerarImagem(s){
  const W = 1080, H = 1920, P = 96;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  const cs = getComputedStyle(document.documentElement);
  const v = n => cs.getPropertyValue(n).trim();
  try{
    await Promise.race([
      Promise.all(['800 100px "Big Shoulders Display"', '700 100px "Big Shoulders Display"', '500 30px "IBM Plex Mono"', '600 30px "IBM Plex Mono"', '600 30px Inter'].map(f => document.fonts.load(f))),
      new Promise(r => setTimeout(r, 2500))
    ]);
  }catch(e){}
  const D = '"Big Shoulders Display", Impact, sans-serif', M = '"IBM Plex Mono", ui-monospace, monospace', I = 'Inter, system-ui, sans-serif';
  const esp = px => { if('letterSpacing' in x) x.letterSpacing = px + 'px'; };
  const rr = (X, Y, w, h, r) => { x.beginPath(); if(x.roundRect) x.roundRect(X, Y, w, h, r); else x.rect(X, Y, w, h); };
  const caber = (txt, peso, tam, max, fam) => { let t = tam; do{ x.font = `${peso} ${t}px ${fam}`; t -= 4; } while(x.measureText(txt).width > max && t > 40); };
  const cortar = (txt, max) => { if(x.measureText(txt).width <= max) return txt; while(txt.length && x.measureText(txt + '…').width > max) txt = txt.slice(0, -1); return txt + '…'; };

  x.fillStyle = v('--bg'); x.fillRect(0, 0, W, H);
  // moldura
  x.strokeStyle = v('--rule'); x.lineWidth = 2; rr(40, 40, W - 80, H - 80, 28); x.stroke();

  // marca
  x.textBaseline = 'alphabetic'; esp(1);
  x.font = `800 112px ${D}`; x.fillStyle = v('--ink'); x.fillText('TREINO', P, 230);
  const w1 = x.measureText('TREINO').width; x.fillStyle = v('--brand'); x.fillText('HOJE', P + w1, 230);

  // carimbo da data
  const d = new Date(s.data);
  const cx = W - P - 168, cy = 110, cw = 168, ch = 200;
  x.fillStyle = v('--surface'); rr(cx, cy, cw, ch, 16); x.fill();
  x.strokeStyle = v('--line'); x.lineWidth = 2; x.stroke();
  x.save(); rr(cx, cy, cw, ch, 16); x.clip();
  x.fillStyle = v('--ink'); x.fillRect(cx, cy, cw, 52); x.restore();
  x.textAlign = 'center'; esp(6);
  x.font = `600 26px ${M}`; x.fillStyle = v('--bg'); x.fillText(d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase(), cx + cw / 2, cy + 37);
  esp(0); x.font = `800 104px ${D}`; x.fillStyle = v('--ink'); x.fillText(String(d.getDate()), cx + cw / 2, cy + 152);
  esp(3); x.font = `500 24px ${M}`; x.fillStyle = v('--muted'); x.fillText(d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase(), cx + cw / 2, cy + 186);
  x.textAlign = 'left';

  // linha tracejada
  x.strokeStyle = v('--rule'); x.lineWidth = 2; x.setLineDash([10, 10]);
  x.beginPath(); x.moveTo(P, 380); x.lineTo(W - P, 380); x.stroke(); x.setLineDash([]);

  const ts = tituloSessao(s);
  const corrida = s.tipo === 'corrida';
  esp(7); x.font = `500 32px ${M}`; x.fillStyle = v('--brand');
  x.fillText(corrida ? 'CORRIDA CONCLUÍDA' : 'TREINO CONCLUÍDO', P, 480);
  esp(1); caber(ts.nome.toUpperCase(), 800, 250, W - 2 * P, D); x.fillStyle = v('--ink'); x.fillText(ts.nome.toUpperCase(), P, 700);
  caber((corrida ? 'Cardio' : ts.foco).toUpperCase(), 700, 78, W - 2 * P, D); x.fillStyle = v('--muted'); x.fillText((corrida ? 'Cardio' : ts.foco).toUpperCase(), P, 800);

  // números
  let stats;
  if(corrida){
    const cr = s.corrida || {}; const p = pace(num(cr.km), num(cr.min));
    stats = [[cr.km ? fmtNum(num(cr.km)) : '—', 'KM'], [cr.min ? fmtNum(num(cr.min)) : '—', 'MINUTOS'], [p || '—', 'PACE /KM']];
  } else {
    const sets = Object.values(s.ex || {}).flat();
    const vol = sets.reduce((a, z) => a + (num(z.kg) || 0) * (num(z.reps) || 0), 0);
    stats = [[String(Object.keys(s.ex || {}).length), 'EXERCÍCIOS'], [String(sets.length), 'SÉRIES'], [vol ? fmtMil(vol) : '—', 'KG DE VOLUME']];
  }
  const gap = 24, bw = (W - 2 * P - 2 * gap) / 3, by = 880, bh = 230;
  stats.forEach(([val, lab], i) => {
    const bx = P + i * (bw + gap);
    x.fillStyle = v('--surface'); rr(bx, by, bw, bh, 20); x.fill(); x.strokeStyle = v('--line'); x.lineWidth = 2; x.stroke();
    esp(0); caber(val, 800, 112, bw - 48, D); x.fillStyle = v('--ink'); x.fillText(val, bx + 28, by + 140);
    esp(3); x.font = `500 24px ${M}`; x.fillStyle = v('--muted'); x.fillText(lab, bx + 28, by + 192);
  });

  // lista
  let y = 1210;
  if(corrida){
    esp(4); x.font = `500 26px ${M}`; x.fillStyle = v('--muted'); x.fillText('ESFORÇO', P, y);
    esp(0); x.font = `800 96px ${D}`; x.fillStyle = v('--brand'); x.fillText(((s.corrida || {}).sens || '—').toUpperCase(), P, y + 110);
  } else {
    esp(4); x.font = `500 26px ${M}`; x.fillStyle = v('--muted');
    x.fillText('EXERCÍCIO', P, y); x.textAlign = 'right'; x.fillText('MELHOR SÉRIE', W - P, y); x.textAlign = 'left';
    y += 30;
    const entradas = Object.entries(s.ex || {});
    const caberN = Math.floor((H - 220 - y) / 88);
    const mostrar = entradas.length > caberN ? entradas.slice(0, caberN - 1) : entradas;
    for(const [id, sets] of mostrar){
      x.strokeStyle = v('--line'); x.lineWidth = 2; x.beginPath(); x.moveTo(P, y); x.lineTo(W - P, y); x.stroke();
      const b = melhorSerie(sets);
      const txt = b ? (b.kg ? `${fmtNum(b.kg)} kg × ${b.r}` : `${b.r} reps`) : '—';
      esp(0); x.font = `600 34px ${M}`; x.fillStyle = v('--brand'); x.textAlign = 'right'; x.fillText(txt, W - P, y + 58);
      const wTxt = x.measureText(txt).width; x.textAlign = 'left';
      x.font = `600 38px ${I}`; x.fillStyle = v('--ink'); x.fillText(cortar(nomeEx(id), W - 2 * P - wTxt - 40), P, y + 58);
      y += 88;
    }
    if(mostrar.length < entradas.length){
      x.font = `500 30px ${M}`; x.fillStyle = v('--muted'); x.fillText(`+ ${entradas.length - mostrar.length} exercícios`, P, y + 54);
    }
  }

  // rodapé
  esp(4); x.font = `500 24px ${M}`; x.fillStyle = v('--muted');
  x.fillText('TREINOHOJE', P, H - 110);
  x.textAlign = 'right'; x.fillText(d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\./g, '').toUpperCase(), W - P, H - 110);
  x.textAlign = 'left';

  return new Promise(r => c.toBlob(r, 'image/png'));
}
async function compartilhar(id){
  const s = db.sessoes.find(x => String(x.id) === String(id)); if(!s) return;
  toast('Gerando imagem…');
  const blob = await gerarImagem(s);
  if(!blob){ toast('Não deu para gerar a imagem'); return; }
  const file = new File([blob], `treinohoje-${s.data.slice(0, 10)}.png`, { type: 'image/png' });
  if(navigator.canShare && navigator.canShare({ files: [file] })){
    try{ await navigator.share({ files: [file], title: 'TreinoHoje' }); }catch(e){}
  } else {
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast('Imagem salva');
  }
}

/* =========================================================
   RENDER + EVENTOS
   ========================================================= */
function render(){
  const telas = { hoje: telaHoje, semana: telaSemana, historico: telaHistorico, plano: telaPlano, editor: telaEditor, gerador: telaGerador, metas: telaMetas };
  let html = telas[aba]() + (fichaAberta ? folhaFicha(fichaAberta) : '');
  if(instalarAberto && !html.includes('folha-fundo')) html += folhaInstalar(true);
  $('#app').innerHTML = html;
  const navAba = (aba === 'editor' || aba === 'gerador' || aba === 'metas') ? 'plano' : aba;
  document.querySelectorAll('nav.menu button').forEach(b => {
    const on = b.dataset.aba === navAba;
    b.classList.toggle('on', on);
    if(on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
  });
  const ib = $('#instalarBox'); if(ib) ib.style.display = pedidoInstalar ? 'inline-flex' : 'none';
  gerirTela();
}

/* tema */
const TEMA_ESCOLHIDO = 'treinohoje:temaEscolhido';
function tema(){
  try{
    const t = localStorage.getItem(TEMA_KEY);
    if(localStorage.getItem(TEMA_ESCOLHIDO) && ['claro', 'escuro', 'auto'].includes(t)) return t;
  }catch(e){}
  return 'escuro';
}
const mqEscuro = matchMedia('(prefers-color-scheme: dark)');
function aplicarTema(t){
  const real = t === 'auto' ? (mqEscuro.matches ? 'escuro' : 'claro') : t;
  document.documentElement.dataset.theme = real;
  $('#themeColor').setAttribute('content', real === 'escuro' ? '#1c1c1b' : '#f2ece0');
  document.querySelectorAll('.tema button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tema === t)));
}
mqEscuro.addEventListener?.('change', () => { if(tema() === 'auto') aplicarTema('auto'); });
document.querySelector('.tema').addEventListener('click', e => {
  const b = e.target.closest('button[data-tema]');
  if(b){ aplicarTema(b.dataset.tema); try{ localStorage.setItem(TEMA_KEY, b.dataset.tema); localStorage.setItem(TEMA_ESCOLHIDO, '1'); }catch(e){} }
});

document.querySelector('nav.menu').addEventListener('click', e => {
  const b = e.target.closest('button[data-aba]'); if(!b) return;
  if((aba === 'editor') && !confirm('Sair do editor sem salvar?')) return;
  aba = b.dataset.aba; ed = null; me = null; trocando = null; fichaAberta = null; render(); window.scrollTo(0, 0);
});

$('#app').addEventListener('input', e => {
  const el = e.target;
  if(el.dataset.ex){
    const t = tipoAtual();
    const rd = rascunho(t);
    const e = exerciciosDoDia(t).find(x => x.id === el.dataset.ex);
    const sets = setsDe(rd, e);
    sets[+el.dataset.i][el.dataset.f] = el.value.trim();
    save();
    const row = el.closest('.set');
    if(row){
      const ok = sets[+el.dataset.i].reps !== '';
      row.classList.toggle('ok', ok);
      row.querySelector('.chk')?.setAttribute('aria-pressed', String(ok));
    }
    atualizarBarra(t);
  } else if(el.dataset.run){
    db.rascunhos.corrida[el.dataset.run] = el.value.trim(); save();
    const p = pace(num(db.rascunhos.corrida.km), num(db.rascunhos.corrida.min));
    $('#pace').innerHTML = `Pace <b>${p ? p + ' /km' : '—'}</b>`;
  } else if(el.dataset.mf && me){
    me.form[el.dataset.mf] = el.value;
  } else if(el.dataset.pe && ed){
    const f = el.dataset.pe, ti = +el.dataset.ti, ei = +el.dataset.ei;
    if(f === 'nome') ed.nome = el.value;
    else if(f === 'foco') ed.treinos[ti].foco = el.value;
    else if(f === 'series') ed.treinos[ti].ex[ei].series = el.value;
    else if(f === 'rmin') ed.treinos[ti].ex[ei].reps[0] = el.value;
    else if(f === 'rmax') ed.treinos[ti].ex[ei].reps[1] = el.value;
    else if(f === 'outroNome') ed.outroNome = el.value;
  }
});

$('#app').addEventListener('change', e => {
  const el = e.target;
  if(el.id === 'plano-ativo'){ db.planoAtivo = el.value; limparEscolha(); save(); render(); toast('Plano ativado'); return; }
  if(el.id === 'dash-ex'){ dashEx = el.value; render(); return; }
  if(el.dataset.mf && me){ me.form[el.dataset.mf] = el.value; return; }
  if(el.dataset.addEx != null && ed){
    const ti = +el.dataset.addEx; const v = el.value;
    if(!v) return;
    if(v === '__outro'){ ed.outro = ti; ed.outroNome = ''; render(); setTimeout(() => $('#outro-nome')?.focus(), 0); return; }
    ed.treinos[ti].ex.push(exDaBib(v));
    render(); return;
  }
  if(el.id === 'arq' && el.files[0]){
    const r = new FileReader();
    r.onload = () => {
      try{
        const d = JSON.parse(r.result);
        if(!Array.isArray(d.sessoes)) throw 0;
        const okSessao = s => s && (typeof s.id === 'number' || typeof s.id === 'string') && !isNaN(new Date(s.data)) && typeof s.tipo === 'string' && s.tipo.length <= 12;
        if(!d.sessoes.every(okSessao)) throw 0;
        if(d.planos){
          const okPlano = p => p && typeof p.nome === 'string' && Array.isArray(p.rotacao) && p.rotacao.length && p.treinos &&
            p.rotacao.every(k => p.treinos[k] && Array.isArray(p.treinos[k].ex) && p.treinos[k].ex.every(e => e && e.id && e.nome && Array.isArray(e.reps)));
          if(!Object.values(d.planos).every(okPlano)) throw 0;
        }
        if(!confirm(`Substituir os dados atuais por ${d.sessoes.length} registros do backup?`)) return;
        db.sessoes = d.sessoes.sort((a, b) => new Date(a.data) - new Date(b.data));
        if(d.metas) db.metas = Object.assign({ academia: 0, corrida: 0, kmMes: 0, cargas: [], leveSemanas: [], ocultarConvite: false }, d.metas);
        if(d.planos && Object.keys(d.planos).length){ db.planos = d.planos; db.planoAtivo = d.planos[d.planoAtivo] ? d.planoAtivo : Object.keys(d.planos)[0]; }
        save(); render(); toast('Backup importado');
      }catch(err){ toast('Arquivo inválido'); }
    };
    r.readAsText(el.files[0]);
  }
});

$('#app').addEventListener('click', e => {
  if(e.target.dataset && e.target.dataset.fecharFicha){ fichaAberta = null; render(); return; }
  const el = e.target.closest('button'); if(!el || el.disabled) return;
  if(el.dataset.ficha){ fichaAberta = el.dataset.ficha; render(); return; }
  if(el.dataset.acao === 'fechar-ficha'){ fichaAberta = null; render(); return; }
  if(el.dataset.tipo){ escolherTipo(el.dataset.tipo); render(); window.scrollTo(0, 0); return; }
  if(el.dataset.sens){ db.rascunhos.corrida.sens = db.rascunhos.corrida.sens === el.dataset.sens ? '' : el.dataset.sens; save(); render(); return; }
  if(el.dataset.visao){ visao = el.dataset.visao; mesOffset = 0; render(); return; }
  if(el.dataset.mes){ mesOffset = Math.min(0, mesOffset + +el.dataset.mes); render(); return; }
  if(el.dataset.share){ compartilhar(el.dataset.share); return; }
  if(el.dataset.ok){
    const t = tipoAtual(); if(!t) return;
    const rd = rascunho(t);
    const e = exerciciosDoDia(t).find(x => x.id === el.dataset.ok);
    const sets = setsDe(rd, e); const i = +el.dataset.i; const s = sets[i];
    if(s.reps !== ''){ sets[i] = { kg: '', reps: '' }; }
    else {
      const ls = ultimo(e.id)?.sets[i];
      const kg = s.kg || (ls ? String(ls.kg || '').replace('.', ',') : '');
      const reps = ls ? ls.reps : '';
      if(!reps){ const inp = el.closest('.set').querySelector('[data-f="reps"]'); inp?.focus(); toast('Digite as repetições'); return; }
      sets[i] = { kg, reps };
      recemMarcado = e.id + ':' + i;
      vibrar(12);
      if(completo(sets)){ abertos.delete(e.id); recemFechado = e.id; recemMarcado = null; }
    }
    save(); render(); return;
  }
  if(el.dataset.abrir){ abertos.add(el.dataset.abrir); render(); return; }
  if(el.dataset.trocar){ trocando = trocando === el.dataset.trocar ? null : el.dataset.trocar; render(); return; }
  if(el.dataset.alt != null && el.dataset.orig){
    const rd = rascunho(tipoAtual());
    if(el.dataset.alt) rd.trocas[el.dataset.orig] = el.dataset.alt; else delete rd.trocas[el.dataset.orig];
    trocando = null; save(); render(); return;
  }
  if(el.dataset.ir){ aba = el.dataset.ir; visao = 'semana'; render(); window.scrollTo(0, 0); return; }
  if(el.dataset.vol){ volModo = el.dataset.vol; render(); return; }
  if(el.dataset.secao){ planoSecao = el.dataset.secao; render(); return; }
  if(el.dataset.modo){ dashModo = el.dataset.modo; render(); return; }
  if(el.dataset.so){ soInstalar = el.dataset.so; render(); return; }
  if(el.dataset.step && me){
    const c = el.dataset.step, passo = c === 'kmMes' ? 5 : 1, max = c === 'kmMes' ? 500 : 7;
    me[c] = Math.min(max, Math.max(0, me[c] + passo * +el.dataset.d));
    if(c === 'academia' && !me.academia) me.leve = false;
    render(); return;
  }
  if(el.dataset.rmCarga != null && me){ me.cargas.splice(+el.dataset.rmCarga, 1); render(); return; }
  if(el.dataset.gen){ gen[el.dataset.gen] = isNaN(+el.dataset.v) ? el.dataset.v : +el.dataset.v; render(); return; }
  if(el.dataset.del){
    if(confirm('Excluir este registro?')){ db.sessoes = db.sessoes.filter(s => String(s.id) !== el.dataset.del); if(String(ultimaSalva) === el.dataset.del) ultimaSalva = null; save(); render(); }
    return;
  }
  if(el.dataset.ed && ed){
    const a = el.dataset.ed, ti = +el.dataset.ti, ei = +el.dataset.ei;
    const lista = ed.treinos[ti] && ed.treinos[ti].ex;
    if(a === 'up' && ei > 0) [lista[ei - 1], lista[ei]] = [lista[ei], lista[ei - 1]];
    if(a === 'down' && ei < lista.length - 1) [lista[ei + 1], lista[ei]] = [lista[ei], lista[ei + 1]];
    if(a === 'del') lista.splice(ei, 1);
    if(a === 'add-treino') ed.treinos.push({ foco: '', ex: [] });
    if(a === 'del-treino' && confirm(`Remover o treino ${LETRAS[ti]}?`)) ed.treinos.splice(ti, 1);
    if(a === 'add-outro'){
      const nome = (ed.outroNome || '').trim();
      if(!nome){ toast('Digite o nome do exercício'); return; }
      const slug = nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      ed.treinos[ti].ex.push({ id: 'custom-' + slug, nome, series: 2, reps: [8, 12] });
      ed.outro = null; ed.outroNome = '';
    }
    if(a === 'cancel-outro'){ ed.outro = null; ed.outroNome = ''; }
    if(a === 'salvar'){ salvarEditor(); return; }
    if(a === 'cancelar'){ ed = null; aba = 'plano'; render(); window.scrollTo(0, 0); return; }
    if(a === 'excluir'){
      if(!confirm(`Excluir o plano "${ed.nome}"? Os registros continuam no histórico.`)) return;
      delete db.planos[ed.id];
      if(db.planoAtivo === ed.id) db.planoAtivo = Object.keys(db.planos)[0];
      ed = null; aba = 'plano'; limparEscolha(); save(); render(); toast('Plano excluído'); return;
    }
    render(); return;
  }
  const acao = el.dataset.acao;
  if(acao === 'concluir'){
    const t = el.dataset.t; const rd = rascunho(t); const ex = {};
    for(const e of exerciciosDoDia(t)){
      const feitos = setsDe(rd, e).filter(s => s.reps !== '').map(s => ({ kg: s.kg, reps: s.reps }));
      if(feitos.length) ex[e.id] = feitos;
    }
    if(!Object.keys(ex).length){ toast('Preencha ao menos uma série'); return; }
    const id = Date.now();
    db.sessoes.push({ id, data: new Date().toISOString(), tipo: t, planoId: db.planoAtivo, nome: 'Treino ' + t, foco: plano().treinos[t].foco, ex });
    db.desfazer = { id, rk: rascKey(t), rascunho: clone(rd), tipo: t, em: Date.now() };
    delete db.rascunhos[rascKey(t)]; limparEscolha(); abertos.clear(); trocando = null; ultimaSalva = id;
    vibrar([12, 50, 12]); save(); render(); window.scrollTo(0, 0);
  }
  if(acao === 'concluir-corrida'){
    const rd = db.rascunhos.corrida;
    if(!num(rd.km)){ toast('Informe a distância'); return; }
    const id = Date.now();
    db.sessoes.push({ id, data: new Date().toISOString(), tipo: 'corrida', corrida: { ...rd } });
    db.desfazer = { id, rk: 'corrida', rascunho: clone(rd), tipo: 'corrida', em: Date.now() };
    delete db.rascunhos.corrida; limparEscolha(); ultimaSalva = id;
    vibrar([12, 50, 12]); save(); render(); window.scrollTo(0, 0);
  }
  if(acao === 'desfazer' && db.desfazer){
    const d = db.desfazer;
    db.sessoes = db.sessoes.filter(s => s.id !== d.id);
    db.rascunhos[d.rk] = d.rascunho; escolherTipo(d.tipo);
    db.desfazer = null; ultimaSalva = null; save(); render(); window.scrollTo(0, 0); toast('Registro desfeito');
  }
  if(acao === 'adiar-backup'){ const x = new Date(); x.setDate(x.getDate() + 7); db.backupAdiadoAte = x.toISOString(); save(); render(); }
  if(acao === 'fechar-instalar'){ db.vistoInstalar = true; instalarAberto = false; save(); render(); }
  if(acao === 'como-instalar'){ instalarAberto = true; render(); }
  if(acao === 'fechar-banner'){ ultimaSalva = null; render(); }
  if(acao === 'editar'){ abrirEditor(plano()); render(); window.scrollTo(0, 0); }
  if(acao === 'novo'){ abrirEditor(null); render(); window.scrollTo(0, 0); }
  if(acao === 'gerador'){ aba = 'gerador'; render(); window.scrollTo(0, 0); }
  if(acao === 'gerar'){ gerarPlano(); render(); window.scrollTo(0, 0); toast('Revise e salve o plano'); }
  if(acao === 'voltar-plano'){ aba = 'plano'; me = null; render(); window.scrollTo(0, 0); }
  if(acao === 'metas'){ abrirMetas(); render(); window.scrollTo(0, 0); }
  if(acao === 'ocultar-convite'){ db.metas.ocultarConvite = true; save(); render(); toast('Dá para definir metas depois em Plano'); }
  if(acao === 'leve' && me){ me.leve = !me.leve; render(); }
  if(acao === 'abrir-carga' && me){ me.form = { aberto: true, exId: '', kg: '', prazo: '', erro: false }; render(); }
  if(acao === 'cancelar-carga' && me){ me.form.aberto = false; render(); }
  if(acao === 'add-carga' && me){
    const kg = num(me.form.kg);
    if(!me.form.exId || !kg){ me.form.erro = true; render(); return; }
    me.cargas.push({ id: 'm' + Date.now().toString(36), exId: me.form.exId, nome: nomeEx(me.form.exId), kg, inicio: melhorCarga(me.form.exId), prazo: me.form.prazo || '' });
    me.form = { aberto: false, exId: '', kg: '', prazo: '', erro: false }; render();
  }
  if(acao === 'salvar-metas' && me){ salvarMetas(); }
  if(acao === 'exportar'){
    const blob = new Blob([JSON.stringify({ sessoes: db.sessoes, planos: db.planos, planoAtivo: db.planoAtivo, metas: db.metas }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `treinohoje-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(a.href);
    db.ultimoBackup = new Date().toISOString(); db.backupAdiadoAte = null; save(); render(); toast('Backup salvo');
  }
  if(acao === 'importar') $('#arq').click();
  if(acao === 'instalar' && pedidoInstalar){ pedidoInstalar.prompt(); pedidoInstalar.userChoice.finally(() => { pedidoInstalar = null; render(); }); }
});

document.addEventListener('keydown', e => { if(e.key === 'Escape' && fichaAberta){ fichaAberta = null; render(); } });

/* atualiza a data ao voltar para o app num outro dia */
document.addEventListener('visibilitychange', () => {
  if(!document.hidden && aba !== 'editor' && aba !== 'metas' && !document.activeElement?.matches('input,select')) render();
  else gerirTela();
});

/* app instalável */
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); pedidoInstalar = e; if(aba === 'plano') render(); });
if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  const tinhaControle = !!navigator.serviceWorker.controller;
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if(!tinhaControle || document.getElementById('nova-versao')) return;
    const d = document.createElement('div');
    d.id = 'nova-versao'; d.className = 'nova-versao'; d.setAttribute('role', 'status');
    d.innerHTML = '<span>Nova versão do app disponível</span><button type="button" class="mini-btn">Atualizar</button>';
    d.querySelector('button').addEventListener('click', () => location.reload());
    document.body.appendChild(d);
  });
}

/* pede ao navegador para não apagar os dados por falta de uso */
try{
  if(navigator.storage && navigator.storage.persisted){
    navigator.storage.persisted().then(p => p ? true : (navigator.storage.persist ? navigator.storage.persist() : false))
      .then(r => { if(db.persistido !== !!r){ db.persistido = !!r; save(); } }).catch(() => {});
  }
}catch(e){}

aplicarTema(tema());
render();

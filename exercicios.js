/* TreinoHoje — biblioteca de exercícios, fichas e ilustrações.
   Para adicionar um exercício: inclua em BIB e, se quiser ficha, em FICHAS (e um desenho em POSES). */

/* ---------- biblioteca de exercícios (editor e gerador) ----------
   g = grupo · k = c (composto) / i (isolado) · eq = b (academia básica serve) / m (precisa de máquina)
   r = faixa de repetições sugerida */
const GRUPOS = { peito: 'Peito', costas: 'Costas', ombro: 'Ombros', biceps: 'Bíceps', triceps: 'Tríceps',
  pernas: 'Quadríceps', posterior: 'Posterior de coxa', gluteos: 'Glúteos', panturrilha: 'Panturrilha', adutores: 'Adutores', core: 'Core', antebraco: 'Antebraço', cardio: 'Cardio' };
const BIB = [
  ['supino-reto', 'Supino reto (barra)', 'peito', 'c', 'b', 8, 12],
  ['supino-reto-halteres', 'Supino reto (halteres)', 'peito', 'c', 'b', 8, 12],
  ['supino-inclinado', 'Supino inclinado (halteres)', 'peito', 'c', 'b', 8, 12],
  ['supino-inclinado-barra', 'Supino inclinado (barra)', 'peito', 'c', 'b', 8, 12],
  ['voador', 'Voador / peck deck', 'peito', 'i', 'm', 10, 15],
  ['crucifixo-halteres', 'Crucifixo (halteres)', 'peito', 'i', 'b', 10, 15],
  ['barra-fixa', 'Barra fixa', 'costas', 'c', 'b', 6, 12],
  ['puxada-alta', 'Puxada alta', 'costas', 'c', 'm', 8, 12],
  ['remada', 'Remada curvada ou serrote', 'costas', 'c', 'b', 8, 12],
  ['remada-maquina', 'Remada máquina (pegada aberta)', 'costas', 'c', 'm', 10, 12],
  ['remada-maquina-neutra', 'Remada máquina (pegada neutra)', 'costas', 'c', 'm', 8, 12],
  ['remada-baixa', 'Remada baixa (polia)', 'costas', 'c', 'm', 8, 12],
  ['desenvolvimento', 'Desenvolvimento (halteres)', 'ombro', 'c', 'b', 8, 12],
  ['desenvolvimento-maquina', 'Desenvolvimento (máquina)', 'ombro', 'c', 'm', 8, 12],
  ['elevacao-lateral', 'Elevação lateral', 'ombro', 'i', 'b', 12, 20],
  ['elevacao-lateral-polia', 'Elevação lateral (polia)', 'ombro', 'i', 'm', 12, 20],
  ['crucifixo-inverso', 'Crucifixo inverso (posterior)', 'ombro', 'i', 'b', 12, 20],
  ['face-pull', 'Face pull (polia)', 'ombro', 'i', 'm', 12, 20],
  ['rosca-direta', 'Rosca direta (barra reta/W)', 'biceps', 'i', 'b', 8, 12],
  ['rosca-martelo', 'Rosca martelo (halteres)', 'biceps', 'i', 'b', 10, 15],
  ['rosca-alternada', 'Rosca alternada', 'biceps', 'i', 'b', 10, 12],
  ['rosca-scott', 'Rosca Scott (máquina)', 'biceps', 'i', 'm', 10, 12],
  ['triceps-pulley', 'Tríceps pulley (corda)', 'triceps', 'i', 'm', 10, 15],
  ['triceps-frances', 'Tríceps francês (polia ou halter)', 'triceps', 'i', 'b', 10, 15],
  ['triceps-testa', 'Tríceps testa', 'triceps', 'i', 'b', 8, 12],
  ['mergulho', 'Mergulho (paralelas ou banco)', 'triceps', 'c', 'b', 6, 12],
  ['agachamento', 'Agachamento livre (ou hack)', 'pernas', 'c', 'b', 8, 12],
  ['leg-press', 'Leg press', 'pernas', 'c', 'm', 8, 12],
  ['bulgaro', 'Agachamento búlgaro', 'pernas', 'c', 'b', 8, 12],
  ['afundo', 'Afundo (halteres)', 'pernas', 'c', 'b', 10, 12],
  ['extensora', 'Cadeira extensora', 'pernas', 'i', 'm', 10, 15],
  ['stiff', 'Stiff (barra ou halteres)', 'posterior', 'c', 'b', 8, 12],
  ['stiff-unilateral', 'Stiff unilateral (halter)', 'posterior', 'c', 'b', 10, 12],
  ['flexora', 'Mesa ou cadeira flexora', 'posterior', 'i', 'm', 10, 15],
  ['elevacao-pelvica', 'Elevação pélvica', 'gluteos', 'c', 'b', 8, 12],
  ['panturrilha', 'Panturrilha em pé', 'panturrilha', 'i', 'b', 10, 15],
  ['panturrilha-sentado', 'Panturrilha sentado', 'panturrilha', 'i', 'm', 12, 20],
  ['abdominal', 'Abdominal na polia ou supra', 'core', 'i', 'b', 10, 15],
  ['elevacao-pernas', 'Elevação de pernas', 'core', 'i', 'b', 10, 15],
  ['supino-maquina', 'Supino na máquina', 'peito', 'c', 'm', 8, 12],
  ['crossover', 'Crossover na polia', 'peito', 'i', 'm', 12, 15],
  ['remada-cavalinho', 'Remada cavalinho (barra T)', 'costas', 'c', 'b', 8, 12],
  ['puxada-neutra', 'Puxada com pegada neutra', 'costas', 'c', 'm', 8, 12],
  ['pullover-polia', 'Pullover na polia', 'costas', 'i', 'm', 12, 15],
  ['encolhimento', 'Encolhimento (halteres)', 'costas', 'i', 'b', 10, 15],
  ['desenvolvimento-barra', 'Desenvolvimento com barra (em pé)', 'ombro', 'c', 'b', 8, 12],
  ['rosca-inclinada', 'Rosca inclinada (halteres)', 'biceps', 'i', 'b', 10, 15],
  ['rosca-scott-halter', 'Rosca Scott (halter)', 'biceps', 'i', 'b', 10, 12],
  ['triceps-overhead-polia', 'Tríceps acima da cabeça (polia)', 'triceps', 'i', 'm', 10, 15],
  ['hack-smith', 'Agachamento no smith ou hack', 'pernas', 'c', 'm', 8, 12],
  ['terra', 'Levantamento terra', 'posterior', 'c', 'b', 5, 8],
  ['flexora-sentada', 'Cadeira flexora (sentada)', 'posterior', 'i', 'm', 10, 15],
  ['adutora', 'Cadeira adutora', 'adutores', 'i', 'm', 12, 15],
  ['abdutora', 'Cadeira abdutora', 'gluteos', 'i', 'm', 12, 20],
  ['panturrilha-leg-press', 'Panturrilha no leg press', 'panturrilha', 'i', 'm', 12, 20],
  ['prancha', 'Prancha (segundos)', 'core', 'i', 'b', 20, 60],
  ['pallof', 'Pallof press', 'core', 'i', 'm', 10, 12],
  ['supino-declinado', 'Supino declinado', 'peito', 'c', 'b', 8, 12],
  ['flexao', 'Flexão de braço', 'peito', 'c', 'b', 8, 15],
  ['crossover-baixo', 'Crossover polia baixa', 'peito', 'i', 'm', 12, 15],
  ['barra-supinada', 'Barra fixa supinada', 'costas', 'c', 'b', 6, 12],
  ['puxada-supinada', 'Puxada supinada', 'costas', 'c', 'm', 8, 12],
  ['elevacao-frontal', 'Elevação frontal', 'ombro', 'i', 'b', 10, 15],
  ['desenvolvimento-arnold', 'Desenvolvimento Arnold', 'ombro', 'c', 'b', 8, 12],
  ['elevacao-lateral-maquina', 'Elevação lateral (máquina)', 'ombro', 'i', 'm', 12, 20],
  ['crucifixo-inverso-maquina', 'Crucifixo inverso (máquina)', 'ombro', 'i', 'm', 12, 20],
  ['rosca-polia-reta', 'Rosca na polia (barra reta)', 'biceps', 'i', 'm', 10, 15],
  ['rosca-polia-w', 'Rosca na polia (barra W)', 'biceps', 'i', 'm', 10, 15],
  ['rosca-concentrada', 'Rosca concentrada', 'biceps', 'i', 'b', 10, 12],
  ['rosca-martelo-corda', 'Rosca martelo na polia (corda)', 'biceps', 'i', 'm', 10, 15],
  ['triceps-pulley-barra', 'Tríceps pulley (barra reta)', 'triceps', 'i', 'm', 10, 15],
  ['triceps-coice', 'Tríceps coice', 'triceps', 'i', 'b', 12, 15],
  ['triceps-banco', 'Tríceps no banco', 'triceps', 'c', 'b', 10, 15],
  ['supino-fechado', 'Supino pegada fechada', 'triceps', 'c', 'b', 8, 12],
  ['agachamento-goblet', 'Agachamento goblet', 'pernas', 'c', 'b', 8, 12],
  ['agachamento-sumo', 'Agachamento sumô', 'pernas', 'c', 'b', 8, 12],
  ['passada', 'Passada (avanço caminhando)', 'pernas', 'c', 'b', 10, 12],
  ['gluteo-polia', 'Glúteo na polia (coice)', 'gluteos', 'i', 'm', 12, 15],
  ['elevacao-pelvica-maquina', 'Elevação pélvica (máquina)', 'gluteos', 'c', 'm', 8, 12],
  ['abdominal-maquina', 'Abdominal na máquina', 'core', 'i', 'm', 10, 15],
  ['abdominal-infra', 'Abdominal infra (deitado)', 'core', 'i', 'b', 10, 15],
  ['prancha-lateral', 'Prancha lateral (segundos)', 'core', 'i', 'b', 20, 45],
  ['abdominal-bicicleta', 'Abdominal bicicleta', 'core', 'i', 'b', 12, 20],
  ['abdominal-obliquo', 'Abdominal oblíquo', 'core', 'i', 'b', 12, 20],
  ['abdominal-carga', 'Abdominal com carga (anilha)', 'core', 'i', 'b', 10, 15],
  ['crunch-reverso', 'Crunch reverso', 'core', 'i', 'b', 10, 15],
  ['abdominal-canivete', 'Abdominal canivete (V-up)', 'core', 'i', 'b', 8, 15],
  ['dead-bug', 'Dead bug', 'core', 'i', 'b', 8, 12],
  ['canoa', 'Canoa / hollow (segundos)', 'core', 'i', 'b', 20, 45],
  ['giro-russo', 'Giro russo', 'core', 'i', 'b', 12, 20],
  ['roda-abdominal', 'Roda abdominal', 'core', 'i', 'b', 6, 12],
  ['elevacao-pernas-paralela', 'Elevação de pernas na paralela', 'core', 'i', 'b', 10, 15],
  ['hiperextensao', 'Hiperextensão lombar (banco romano)', 'posterior', 'i', 'b', 10, 15],
  ['superman', 'Superman (lombar)', 'core', 'i', 'b', 10, 15],
  ['terra-romeno', 'Levantamento terra romeno', 'posterior', 'c', 'b', 8, 12],
  ['pullover-halter', 'Pullover com halter', 'costas', 'i', 'b', 10, 15],
  ['remada-invertida', 'Remada invertida (barra australiana)', 'costas', 'c', 'b', 8, 15],
  ['flexao-diamante', 'Flexão diamante', 'triceps', 'c', 'b', 8, 15],
  ['flexao-inclinada', 'Flexão inclinada (mãos no banco)', 'peito', 'c', 'b', 10, 15],
  ['step-up', 'Subida no banco (step-up)', 'pernas', 'c', 'b', 8, 12],
  ['afundo-reverso', 'Afundo reverso', 'pernas', 'c', 'b', 8, 12],
  ['ponte-gluteo', 'Ponte de glúteo (no chão)', 'gluteos', 'i', 'b', 12, 20],
  ['agachamento-frontal', 'Agachamento frontal', 'pernas', 'c', 'b', 6, 10],
  ['crucifixo-inclinado', 'Crucifixo inclinado (halteres)', 'peito', 'i', 'b', 10, 15],
  ['encolhimento-barra', 'Encolhimento com barra', 'costas', 'i', 'b', 10, 15],
  ['panturrilha-unilateral', 'Panturrilha unilateral (halter)', 'panturrilha', 'i', 'b', 10, 15],
  /* antebraço: punho e braquiorradial, faixas mais altas */
  ['rosca-punho-polia', 'Rosca de punho em pé na polia (barra reta)', 'antebraco', 'i', 'm', 12, 20],
  ['rosca-punho-halter', 'Rosca de punho sentado com halter', 'antebraco', 'i', 'b', 12, 20],
  ['rosca-punho-invertida', 'Rosca de punho invertida (palma para baixo)', 'antebraco', 'i', 'b', 15, 20],
  ['rosca-inversa-polia', 'Rosca inversa na polia (barra reta)', 'antebraco', 'i', 'm', 10, 15],
  /* cardio: registrado por tempo (min) e distância opcional (km), sem carga */
  ['bike', 'Bike ergométrica', 'cardio', 'i', 'm', 10, 20],
  ['esteira', 'Esteira (caminhada ou corrida)', 'cardio', 'i', 'm', 10, 20],
  ['eliptico', 'Elíptico (transport)', 'cardio', 'i', 'm', 10, 20],
  ['escada', 'Escada (simulador)', 'cardio', 'i', 'm', 10, 15],
  ['remo-ergometro', 'Remo ergômetro', 'cardio', 'i', 'm', 8, 15],
  ['pular-corda', 'Pular corda', 'cardio', 'i', 'b', 5, 10],
].map(([id, nome, g, k, eq, a, b]) => ({ id, nome, g, k, eq, r: [a, b] }));
const BIB_ID = Object.fromEntries(BIB.map(e => [e.id, e]));
const ehCardio = id => BIB_ID[id]?.g === 'cardio';

/* =========================================================
   FICHAS — ilustrações próprias, músculos e execução
   ========================================================= */
/* ---------- ilustrações: boneco sem rosto (silhueta) ----------
   Cada pose tem início (A) e fim (B). Vista de lado (padrão) ou de frente (v: 'f').
   Ângulos em graus: 0 = apontando para baixo; positivo gira para a frente do corpo
   (o boneco de lado olha para a direita). Tronco: t = inclinação a partir da vertical.
   Lado: H quadril | P tornozelo (o quadril é calculado), t, a [braço, antebraço],
         l [coxa, canela], a2/l2 lado de trás (padrão = igual), ar 1 = braço relativo ao tronco,
         m mão (ângulo), pf pé (ajuste), se ombro sobe, w pesos, k cabos, o partes móveis.
   Frente: y desloca o corpo, s sentado, a/l lado esquerdo (espelhado), a2/l2 lado direito. */
const SEG = { braco: 39, ante: 37, coxa: 46, canela: 44, mao: 11 };
const TORSO_L = 'M100 52 C92 56 87 62 86 72 C85 84 87 96 89 106 C90 114 86 122 86 130 C86 136 88 141 92 142 L113 142 C116 134 116 124 116 116 C117 106 121 96 122 84 C123 74 119 64 114 58 C112 55 111 53 110 51 Z';
const TORSO_F = 'M92 56 C84 58 80 64 81 72 C83 90 92 104 93 116 C92 124 89 130 89 138 L131 138 C131 130 128 124 127 116 C128 104 137 90 139 72 C140 64 136 58 128 56 Z';
const QUADRIL = [100, 134];
const vet = (a, n) => [n * Math.sin(a * Math.PI / 180), n * Math.cos(a * Math.PI / 180)];
const soma = (p, v) => [p[0] + v[0], p[1] + v[1]];
const meio = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const angDe = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
function girar(p, H, t){
  const x = p[0] - QUADRIL[0], y = p[1] - QUADRIL[1], c = Math.cos(t * Math.PI / 180), s = Math.sin(t * Math.PI / 180);
  return [H[0] + x * c - y * s, H[1] + x * s + y * c];
}
const n1 = v => Math.round(v * 10) / 10;
const ln = (a, b, w, cls) => `<line class="${cls}" x1="${n1(a[0])}" y1="${n1(a[1])}" x2="${n1(b[0])}" y2="${n1(b[1])}" stroke-width="${w}"/>`;
const elp = (c, rx, ry, rot, cls) => `<ellipse class="${cls}" cx="${n1(c[0])}" cy="${n1(c[1])}" rx="${rx}" ry="${ry}" transform="rotate(${n1(rot)} ${n1(c[0])} ${n1(c[1])})"/>`;
/* lado de fora do membro: anterior = -1, posterior = +1 */
function ladoDe(a, b, s){ const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [-(b[1] - a[1]) / d * s, (b[0] - a[0]) / d * s]; }
function sobre(a, b, t, s, off){ const m = meio(a, b, t), p = ladoDe(a, b, s); return [m[0] + p[0] * off, m[1] + p[1] * off]; }

function propsSvg(lista, J){
  const pt = v => typeof v === 'string' ? J[v] : v;
  return (lista || []).map(p => {
    if(p[0] === 'r') return `<rect class="pr-f" x="${p[1]}" y="${p[2]}" width="${p[3]}" height="${p[4]}" rx="${p[5] ?? 3}"/>`;
    if(p[0] === 'c') return `<circle class="pr-f" cx="${p[1]}" cy="${p[2]}" r="${p[3]}"/>`;
    if(p[0] === 'j'){ const a = pt(p[1]); return ln(a, [p[2], p[3]], p[4] || 5, 'pr-l'); }   // de uma articulação até um ponto
    return ln([p[1], p[2]], [p[3], p[4]], p[5] || 4, 'pr-l');
  }).join('');
}
function pesosSvg(lista, J, peso, frente){
  return (lista || []).map(([tipo, onde, ang]) => {
    const t = tipo === '*' ? peso : tipo; const c = typeof onde === 'string' ? J[onde] : onde; if(!c) return '';
    if(t === 'barra') return frente ? '' : `<circle class="pz" cx="${n1(c[0])}" cy="${n1(c[1])}" r="14"/><circle class="pzc" cx="${n1(c[0])}" cy="${n1(c[1])}" r="4"/>`;
    if(t === 'halter') return `<circle class="pz" cx="${n1(c[0])}" cy="${n1(c[1])}" r="8.5"/>`;
    if(t === 'rolo') return `<circle class="pz" cx="${n1(c[0])}" cy="${n1(c[1])}" r="7"/>`;
    if(t === 'placa'){ const v = vet((ang || 0), 22); return ln([c[0] - v[0], c[1] - v[1]], [c[0] + v[0], c[1] + v[1]], 7, 'pr-l pz-l'); }
    if(t === 'barraf') return ln([c[0] - 70, c[1]], [c[0] + 70, c[1]], 6, 'pz-l');   // barra vista de frente
    return '';
  }).join('');
}
const MUS_LADO = {
  peito:   { tronco: [[113, 79, 10, 8, -25]] },
  costas:  { tronco: [[91, 86, 6.5, 17, 4]] },
  core:    { tronco: [[113, 110, 5, 13, -6]] },
  gluteos: { tronco: [[91, 131, 9, 10, 0]] },
};
function boneco(id, quadro){
  const f = FICHAS[id]; const T = f && POSES[f.d]; if(!T) return '';
  const Q = T[quadro]; const p1 = new Set(f.p), s1 = new Set(f.s);
  const mus = g => p1.has(g) ? 'mu' : (s1.has(g) ? 'mu mu2' : '');
  const o = [];
  const vb = T.vb || (T.v === 'f' ? '0 -8 220 252' : '-24 -18 284 262');
  if(!T.semChao) o.push(`<line class="chao" x1="-40" y1="232" x2="300" y2="232"/>`);
  if(T.v === 'f') return quadroFrente(T, Q, f, mus, o, vb, id, quadro);
  /* ---- vista de lado ---- */
  const t = Q.t || 0, l = Q.l || [0, 0], l2 = Q.l2 || l;
  let H = Q.H;
  if(!H && Q.P2){ const K = soma(Q.P2, vet(l2[1], -SEG.canela)), h = soma(K, vet(l2[0], -SEG.coxa)); H = [h[0] + 4, h[1]]; }
  if(!H){ const K = soma(Q.P, vet(l[1], -SEG.canela)); H = soma(K, vet(l[0], -SEG.coxa)); }
  const K = soma(H, vet(l[0], SEG.coxa)), P = soma(K, vet(l[1], SEG.canela));
  const H2 = [H[0] - 4, H[1]], K2 = soma(H2, vet(l2[0], SEG.coxa)), P2 = soma(K2, vet(l2[1], SEG.canela));
  const S = girar([103, 67 - (Q.se || 0)], H, t);
  const ar = Q.ar ? t : 0;
  const a = Q.a || [0, 0], a2 = Q.a2 || a;
  const E = soma(S, vet(a[0] + ar, SEG.braco)), W = soma(E, vet(a[1] + ar, SEG.ante));
  const S2 = [S[0] - 4, S[1]], E2 = soma(S2, vet(a2[0] + ar, SEG.braco)), W2 = soma(E2, vet(a2[1] + ar, SEG.ante));
  const M = Q.m != null ? soma(W, vet(Q.m, SEG.mao)) : W;
  const J = { H, K, P, S, E, W, M, K2, P2, E2, W2, nuca: girar([89, 63], H, t), peito: girar([118, 86], H, t), pelve: girar([116, 126], H, t), cabeca: girar([108, 33], H, t) };
  o.push(propsSvg(T.pr, J));
  o.push(propsSvg(Q.o, J));
  /* lado de trás */
  const pe = (A, Kn, cls, extra) => { const ang = angDe(Kn, A) - 90 + (Q.pf || 0) + (extra || 0); const v = [Math.cos((ang) * Math.PI / 180), Math.sin((ang) * Math.PI / 180)]; return ln([A[0] - v[0] * 3, A[1] - v[1] * 3], [A[0] + v[0] * 15, A[1] + v[1] * 15], 9, cls); };
  o.push(ln(H2, K2, 24, 'bt'), ln(K2, P2, 16, 'bt'), pe(P2, K2, 'bt'));
  o.push(ln(S2, E2, 13, 'bt'), ln(E2, W2, 10, 'bt'));
  (Q.k2 || []).forEach(k => o.push(ln(J[k[0]], [k[1], k[2]], 1.5, 'cabo')));
  /* tronco, pescoço e cabeça giram juntos em torno do quadril */
  const g = [ln([106, 44 + (Q.se || 0) * .5], [105, 58], 11, 'b'), `<path class="b" d="${TORSO_L}"/>`, `<ellipse class="b" cx="108" cy="33" rx="11.5" ry="13.5"/>`];
  ['peito', 'costas', 'core', 'gluteos'].forEach(m => { const c = mus(m); if(c) MUS_LADO[m].tronco.forEach(e => g.push(elp([e[0], e[1]], e[2], e[3], e[4], c))); });
  if(mus('ombro') && f.p.includes('ombro') && /posterior/.test(f.pad)) g.push(elp([93, 70], 7, 8, 0, mus('ombro')));
  o.push(`<g transform="translate(${n1(H[0] - QUADRIL[0])} ${n1(H[1] - QUADRIL[1])}) rotate(${t} ${QUADRIL[0]} ${QUADRIL[1]})">${g.join('')}</g>`);
  /* perna da frente */
  o.push(ln(H, K, 26, 'b'), ln(K, P, 18, 'b'), pe(P, K, 'b'));
  if(mus('pernas')) o.push(elp(sobre(H, K, .52, -1, 6), 19, 7, angDe(H, K), mus('pernas')));
  if(mus('posterior')) o.push(elp(sobre(H, K, .55, 1, 6), 17, 6, angDe(H, K), mus('posterior')));
  if(mus('adutores')) o.push(elp(sobre(H, K, .4, -1, 0), 14, 6, angDe(H, K), mus('adutores')));
  if(mus('panturrilha')) o.push(elp(sobre(K, P, .32, 1, 4), 13, 6, angDe(K, P), mus('panturrilha')));
  (Q.k || []).forEach(k => o.push(ln(J[k[0]], [k[1], k[2]], 1.5, 'cabo')));
  /* braço da frente, com um contorno da cor do fundo para descolar do tronco */
  o.push(ln(S, E, 20, 'bh'), ln(E, W, 17, 'bh'), ln(S, E, 15, 'b'), ln(E, W, 12, 'b'));
  if(Q.m != null) o.push(ln(W, M, 9, 'b'));
  if(mus('ombro') && !/posterior/.test(f.pad)) o.push(elp([S[0] + 1, S[1] + 3], 8, 8.5, 0, mus('ombro')));
  if(mus('biceps')) o.push(elp(sobre(S, E, .58, -1, 3.5), 11, 4.6, angDe(S, E), mus('biceps')));
  if(mus('triceps')) o.push(elp(sobre(S, E, .55, 1, 3.5), 11, 4.4, angDe(S, E), mus('triceps')));
  if(mus('antebraco')) o.push(elp(sobre(E, W, .35, -1, 1.5), 10, 3.8, angDe(E, W), mus('antebraco')));
  o.push(pesosSvg(Q.w, J, f.peso));
  o.push(`<circle class="b" cx="${n1(M[0])}" cy="${n1(M[1])}" r="6"/>`);
  return svgPose(vb, o, id, quadro);
}
function quadroFrente(T, Q, f, mus, o, vb, id, quadro){
  const y = Q.y || 0, C = 110, esp = p => [2 * C - p[0], p[1]];
  const sh = (p) => [p[0], p[1] + y];
  const a = Q.a || [0, 0], a2 = Q.a2 || a, l = Q.l || [0, 0], l2 = Q.l2 || l;
  const S = sh([86, 66]), E = soma(S, vet(-a[0], SEG.braco)), W = soma(E, vet(-a[1], SEG.ante));
  const Sd = esp(S), Ed = soma(Sd, vet(a2[0], SEG.braco)), Wd = soma(Ed, vet(a2[1], SEG.ante));
  const Hq = sh([99, 136]), Hd = esp(Hq);
  const cx = Q.s ? 14 : SEG.coxa;   // sentado: a coxa vem na direção de quem olha e fica curta
  const K = soma(Hq, vet(-l[0], cx)), P = soma(K, vet(-l[1], Q.cn || SEG.canela));
  const Kd = soma(Hd, vet(l2[0], cx)), Pd = soma(Kd, vet(l2[1], Q.cn || SEG.canela));
  const J = { S, E, W, Sd, Ed, Wd, H: Hq, K, P, Kd, Pd, meio: meio(W, Wd, .5) };
  o.push(propsSvg(T.pr, J)); o.push(propsSvg(Q.o, J));
  (Q.k || []).forEach(k => o.push(ln(J[k[0]], [k[1], k[2]], 1.5, 'cabo')));
  const pes = (Pp, dir) => `<rect class="b" x="${n1(Pp[0] - 10)}" y="${n1(Pp[1] - 4)}" width="20" height="10" rx="5"/>`;
  [[Hq, K, P], [Hd, Kd, Pd]].forEach(([h, k, p]) => { o.push(ln(h, k, Q.s ? 27 : 24, 'b'), ln(k, p, 17, 'b'), pes(p)); });
  if(mus('pernas')) [[Hq, K], [Hd, Kd]].forEach(([h, k]) => o.push(elp(meio(h, k, .55), Q.s ? 9 : 7, Q.s ? 6 : 17, Q.s ? 0 : angDe(h, k) - 90, mus('pernas'))));
  if(mus('adutores')) [[Hq, K, 1], [Hd, Kd, -1]].forEach(([h, k, s]) => o.push(elp([meio(h, k, .45)[0] + 5 * s, meio(h, k, .45)[1]], 4.5, Q.s ? 7 : 14, 0, mus('adutores'))));
  if(mus('gluteos')) [[Hq, -1], [Hd, 1]].forEach(([h, s]) => o.push(elp([h[0] + 9 * s, h[1] - 6], 5, 9, 0, mus('gluteos'))));
  o.push(`<path class="b" transform="translate(0 ${y})" d="${TORSO_F}"/>`);
  if(mus('peito')) [[101, 80], [119, 80]].forEach(c => o.push(elp(sh(c), 9.5, 7, 0, mus('peito'))));
  if(mus('costas')) [[91, 104, -8], [129, 104, 8]].forEach(c => o.push(elp(sh([c[0], c[1]]), 5.5, 17, c[2], mus('costas'))));
  if(mus('core')) o.push(elp(sh([110, 110]), 7, 15, 0, mus('core')));
  o.push(ln(sh([110, 44]), sh([110, 58]), 12, 'b'), `<ellipse class="b" cx="${C}" cy="${32 + y}" rx="12" ry="14"/>`);
  if(Q.barraAtras) o.push(pesosSvg([['barraf', [C, W[1]]]], J, f.peso, true));
  [[S, E, W], [Sd, Ed, Wd]].forEach(([s, e, w]) => o.push(ln(s, e, 20, 'bh'), ln(e, w, 17, 'bh')));
  [[S, E, W], [Sd, Ed, Wd]].forEach(([s, e, w]) => o.push(ln(s, e, 15, 'b'), ln(e, w, 12, 'b')));
  if(mus('ombro')) [[S, 1], [Sd, -1]].forEach(([s, d]) => o.push(elp([s[0] - 2 * d, s[1] + 1], 8, 9, -15 * d, mus('ombro'))));
  if(mus('biceps')) [[S, E], [Sd, Ed]].forEach(([s, e]) => o.push(elp(meio(s, e, .55), 4.2, 10, angDe(s, e) - 90, mus('biceps'))));
  if(mus('triceps')) [[S, E], [Sd, Ed]].forEach(([s, e]) => o.push(elp(meio(s, e, .55), 4.2, 10, angDe(s, e) - 90, mus('triceps'))));
  if(!Q.barraAtras) o.push(pesosSvg(Q.w, J, f.peso, true));
  [W, Wd].forEach(w => o.push(`<circle class="b" cx="${n1(w[0])}" cy="${n1(w[1])}" r="6.5"/>`));
  return svgPose(vb, o, id, quadro);
}
function svgPose(vb, o, id, quadro){
  const rot = quadro === 'A' ? 'posição inicial' : 'posição final';
  return `<svg class="pose fig" viewBox="${vb}" role="img" aria-label="${esc(nomeEx(id))}: ${rot}">${o.join('')}</svg>`;
}

/* ---------- poses (início A, fim B) ---------- */
const CH = 224;                                     // tornozelo de quem está em pé
const EMPE = { P: [100, CH], t: 0, l: [0, 0] };
const BANCO = [['r', 20, 186, 156, 8], ['l', 40, 194, 40, 232, 5], ['l', 158, 194, 158, 232, 5]];   // banco reto, deitado
const DEITADO = { H: [140, 172], t: -90, l: [80, 0] };
const ASSENTO_L = [['r', 88, 186, 64, 8], ['l', 120, 194, 120, 232, 5]];
const SENTADO = { H: [118, 172], t: 0, l: [82, 0] };
const SENTA_F = { y: 36, s: 1 };
const BANCO_F = [['r', 76, 178, 68, 9], ['l', 110, 187, 110, 232, 5]];
const ENCOSTO_F = [['r', 84, 70, 52, 108, 8]];
const pe = (o) => ({ ...EMPE, ...o });
const deit = (o) => ({ ...DEITADO, ...o });
const sent = (o) => ({ ...SENTADO, ...o });
const sf = (o) => ({ ...SENTA_F, ...o });
const POSES = {
  /* ----- peito ----- */
  supino: { pr: BANCO, A: deit({ a: [180, 180], w: [['*', 'W']] }), B: deit({ a: [55, 180], w: [['*', 'W']] }) },
  inclinado: { pr: [['r', 120, 186, 56, 8], ['l', 132, 184, 62, 135, 9], ['l', 148, 194, 148, 232, 5], ['l', 80, 160, 80, 232, 4]],
    A: { H: [140, 172], t: -55, l: [80, 0], a: [180, 180], w: [['*', 'W']] }, B: { H: [140, 172], t: -55, l: [80, 0], a: [28, 178], w: [['*', 'W']] } },
  supinoMaquina: { pr: [...ASSENTO_L, ['l', 102, 182, 88, 96, 9], ['l', 214, 50, 214, 232, 6]],
    A: sent({ t: -10, a: [-58, 88], o: [['j', 'W', 200, 214, 6]] }), B: sent({ t: -10, a: [86, 90], o: [['j', 'W', 200, 214, 6]] }) },
  crucifixo: { v: 'f', semChao: true, pr: [['r', 90, 40, 40, 196, 8]],
    A: { a: [90, 96], w: [['*', 'W'], ['*', 'Wd']] }, B: { a: [-12, -26], w: [['*', 'W'], ['*', 'Wd']] } },
  crossover: { v: 'f', pr: [['l', 14, 20, 14, 232, 5], ['l', 206, 20, 206, 232, 5]],
    A: { a: [96, 104], k: [['W', 14, 30], ['Wd', 206, 30]] }, B: { a: [-12, -26], k: [['W', 14, 30], ['Wd', 206, 30]] } },
  voador: { v: 'f', pr: [...ENCOSTO_F, ...BANCO_F],
    A: sf({ a: [92, 178] }), B: sf({ a: [-22, 176] }) },
  /* ----- ombro ----- */
  lateral: { v: 'f', A: { a: [9, 3], w: [['*', 'W'], ['*', 'Wd']] }, B: { a: [83, 85], w: [['*', 'W'], ['*', 'Wd']] } },
  desenvolvimento: { v: 'f', pr: [...ENCOSTO_F, ...BANCO_F],
    A: sf({ a: [96, 180], w: [['*', 'W'], ['*', 'Wd']] }), B: sf({ a: [160, 176], w: [['*', 'W'], ['*', 'Wd']] }) },
  desenvBarra: { A: pe({ a: [28, 172], w: [['*', 'W']] }), B: pe({ a: [176, 180], w: [['*', 'W']] }) },
  frontal: { A: pe({ a: [6, 6], w: [['*', 'W']] }), B: pe({ a: [90, 90], w: [['*', 'W']] }) },
  encolhimento: { A: pe({ a: [2, 2], w: [['*', 'W']] }), B: pe({ a: [2, 2], se: 7, w: [['*', 'W']] }) },
  facePull: { pr: [['l', 236, 20, 236, 232, 6]],
    A: pe({ a: [100, 100], k: [['W', 236, 52]] }), B: pe({ a: [-96, 150], k: [['W', 236, 52]] }) },
  inversoCurvado: { A: pe({ t: 72, l: [16, -14], a: [0, 2], w: [['*', 'W']] }), B: pe({ t: 72, l: [16, -14], a: [168, 172], w: [['*', 'W']] }) },
  voadorInverso: { v: 'f', pr: [...ENCOSTO_F, ...BANCO_F], A: sf({ a: [-16, -24] }), B: sf({ a: [92, 92] }) },
  /* ----- costas ----- */
  puxada: { v: 'f', pr: [['r', 78, 166, 64, 8], ['l', 110, 174, 110, 232, 5], ['r', 74, 156, 72, 7]],
    A: { y: 30, s: 1, a: [160, 166], w: [['barraf', 'meio']], k: [['meio', 110, -6]] },
    B: { y: 30, s: 1, a: [42, 172], w: [['barraf', 'meio']], k: [['meio', 110, -6]] } },
  barraFixa: { v: 'f', semChao: true, pr: [['l', 10, 14, 210, 14, 6]],
    A: { y: 23, cn: 30, a: [168, 176] }, B: { y: -18, cn: 30, a: [64, 172] } },
  remadaCurvada: { A: pe({ t: 62, l: [22, -18], a: [0, 0], w: [['*', 'W']] }), B: pe({ t: 62, l: [22, -18], a: [-62, 6], w: [['*', 'W']] }) },
  remadaSentado: { pr: [['r', 40, 200, 70, 8], ['l', 75, 208, 75, 232, 5], ['l', 222, 150, 222, 232, 6], ['r', 170, 186, 8, 40, 3]],
    A: { H: [78, 186], t: 18, l: [70, 80], a: [86, 86], k: [['W', 222, 172]] },
    B: { H: [78, 186], t: -6, l: [70, 80], a: [-42, 90], k: [['W', 222, 172]] } },
  remadaInvertida: { pr: [['c', 86, 90, 5], ['l', 64, 90, 64, 232, 5]],
    A: { H: [150, 192], t: -70, l: [70, 70], a: [180, 180] }, B: { H: [150, 176], t: -60, l: [62, 62], a: [-127, 132] } },
  pullover: { pr: [['l', 236, 20, 236, 232, 6]],
    A: pe({ t: 16, l: [6, -4], a: [150, 150], k: [['W', 236, 34]] }), B: pe({ t: 16, l: [6, -4], a: [12, 12], k: [['W', 236, 34]] }) },
  pulloverHalter: { pr: BANCO, A: deit({ a: [-74, -78], w: [['*', 'W']] }), B: deit({ a: [180, 180], w: [['*', 'W']] }) },
  /* ----- braços ----- */
  rosca: { A: pe({ a: [4, 4], w: [['*', 'W']] }), B: pe({ a: [4, 148], w: [['*', 'W']] }) },
  roscaInclinada: { pr: [['r', 120, 186, 56, 8], ['l', 130, 182, 74, 126, 9], ['l', 148, 194, 148, 232, 5]],
    A: { H: [140, 172], t: -40, l: [80, 0], a: [0, 0], w: [['*', 'W']] }, B: { H: [140, 172], t: -40, l: [80, 0], a: [0, 150], w: [['*', 'W']] } },
  roscaPolia: { pr: [['l', 170, 232, 170, 212, 6]],
    A: pe({ a: [4, 4], k: [['W', 170, 214]] }), B: pe({ a: [4, 148], k: [['W', 170, 214]] }) },
  scott: { pr: [...ASSENTO_L, ['l', 120, 104, 156, 140, 9], ['l', 150, 140, 150, 186, 5]],
    A: sent({ t: 14, a: [48, 32], w: [['*', 'W']] }), B: sent({ t: 14, a: [48, 168], w: [['*', 'W']] }) },
  coice: { pr: [['r', 18, 160, 90, 8], ['l', 30, 168, 30, 232, 4], ['l', 96, 168, 96, 232, 4]],
    A: { P: [120, CH], t: 74, l: [8, -6], a: [-74, 0], a2: [0, 0], w: [['*', 'W']] },
    B: { P: [120, CH], t: 74, l: [8, -6], a: [-74, -74], a2: [0, 0], w: [['*', 'W']] } },
  pulley: { pr: [['l', 180, 20, 180, 232, 6]],
    A: pe({ t: 6, a: [6, 150], k: [['W', 180, 30]] }), B: pe({ t: 6, a: [6, 12], k: [['W', 180, 30]] }) },
  frances: { A: pe({ a: [172, -16], w: [['*', 'W']] }), B: pe({ a: [172, 178], w: [['*', 'W']] }) },
  francesPolia: { pr: [['l', 0, 232, 0, 200, 6]],
    A: { P: [120, CH], t: 24, l: [10, -8], a: [160, -18], k: [['W', 2, 204]] }, B: { P: [120, CH], t: 24, l: [10, -8], a: [158, 162], k: [['W', 2, 204]] } },
  testa: { pr: BANCO, A: deit({ a: [178, 178], w: [['*', 'W']] }), B: deit({ a: [-166, -62], w: [['*', 'W']] }) },
  mergulho: { pr: [['l', 70, 137, 150, 137, 6], ['l', 136, 137, 136, 232, 5]],
    A: { H: [104, 128], t: 2, l: [20, -120], a: [2, 2] }, B: { H: [100, 156], t: 14, l: [30, -110], a: [-60, 42] } },
  punhoBanco: { pr: [['r', 46, 186, 62, 8], ['l', 76, 194, 76, 232, 5]],
    A: { H: [96, 172], t: 22, l: [84, 0], a: [32, 90], m: 40, w: [['*', 'M']] }, B: { H: [96, 172], t: 22, l: [84, 0], a: [32, 90], m: 150, w: [['*', 'M']] } },
  punhoPoliaPe: { pr: [['l', 186, 232, 186, 212, 6]],
    A: pe({ a: [0, 90], m: 36, k: [['M', 186, 214]] }), B: pe({ a: [0, 90], m: 150, k: [['M', 186, 214]] }) },
  /* ----- pernas ----- */
  agachamento: { A: { P: [100, CH], t: 4, l: [0, 0], ar: 1, a: [-50, 160], w: [['barra', 'nuca']] },
    B: { P: [102, CH], t: 42, l: [77, -31], ar: 1, a: [-50, 160], w: [['barra', 'nuca']] } },
  agachFrente: { A: { P: [100, CH], t: 3, l: [0, 0], ar: 1, a: [32, 176], w: [['*', 'W']] },
    B: { P: [102, CH], t: 30, l: [80, -32], ar: 1, a: [32, 176], w: [['*', 'W']] } },
  legPress: { pr: [['r', 92, 198, 60, 8], ['l', 98, 196, 46, 150, 9], ['l', 124, 206, 124, 232, 5], ['l', 210, 232, 252, 120, 6]],
    A: { H: [120, 184], t: -52, l: [150, 92], a: [40, 70], w: [['placa', 'P', 120]] },
    B: { H: [120, 184], t: -52, l: [122, 122], a: [40, 70], w: [['placa', 'P', 120]] } },
  extensora: { pr: [...ASSENTO_L, ['l', 96, 184, 92, 104, 9]],
    A: sent({ t: -8, a: [10, 60], w: [['rolo', 'P']] }), B: sent({ t: -8, a: [10, 60], l: [82, 82], w: [['rolo', 'P']] }) },
  flexora: { pr: [['r', 20, 186, 186, 8], ['l', 50, 194, 50, 232, 5], ['l', 180, 194, 180, 232, 5]],
    A: { H: [92, 171], t: 90, l: [-90, -90], a: [52, 30], w: [['rolo', 'P']] }, B: { H: [92, 171], t: 90, l: [-90, -158], a: [52, 30], w: [['rolo', 'P']] } },
  flexoraSentada: { pr: [...ASSENTO_L, ['l', 96, 184, 92, 104, 9]],
    A: sent({ t: -8, l: [82, 82], a: [10, 60], w: [['rolo', 'P']] }), B: sent({ t: -8, l: [82, -8], a: [10, 60], w: [['rolo', 'P']] }) },
  stiff: { A: pe({ l: [4, -2], a: [2, 2], w: [['*', 'W']] }), B: pe({ t: 74, l: [16, -4], a: [0, 0], w: [['*', 'W']] }) },
  terra: { A: { P: [104, CH], t: 52, l: [62, -26], a: [0, 0], w: [['*', 'W']] }, B: pe({ P: [104, CH], a: [2, 2], w: [['*', 'W']] }) },
  afundo: { A: pe({ a: [0, 0], w: [['*', 'W']] }),
    B: { H: [96, 172], t: 4, l: [88, 0], l2: [-18, -84], a: [0, 0], w: [['*', 'W']] } },
  bulgaro: { pr: [['r', -6, 170, 62, 8], ['l', 20, 178, 20, 232, 5]],
    A: { H: [104, 130], t: 4, l: [6, -6], l2: [-34, -128], a: [0, 0], w: [['*', 'W']] },
    B: { H: [98, 168], t: 12, l: [70, -14], l2: [-10, -96], a: [0, 0], w: [['*', 'W']] } },
  stepUp: { pr: [['r', 124, 200, 70, 32, 4]],
    A: { H: [104, 134], t: 8, l: [64, -4], l2: [0, 0], a: [0, 0], w: [['*', 'W']] },
    B: { H: [140, 112], t: 0, l: [0, 0], l2: [-20, -60], a: [0, 0], w: [['*', 'W']] } },
  panturrilha: { pr: [['r', 92, 216, 30, 16, 3]], A: { P: [100, 220], t: 0, l: [0, 0], pf: -14, a: [0, 0], w: [['*', 'W']] }, B: { P: [100, 206], t: 0, l: [0, 0], pf: 40, a: [0, 0], w: [['*', 'W']] } },
  panturrilhaSentado: { pr: [...ASSENTO_L, ['r', 150, 216, 30, 16, 3]],
    A: sent({ l: [82, 0], pf: -12, a: [40, 70], w: [['rolo', 'K']] }), B: sent({ H: [118, 164], l: [82, 0], pf: 36, a: [40, 70], w: [['rolo', 'K']] }) },
  pelvica: { pr: [['r', 18, 182, 50, 50, 4]],
    A: { H: [118, 206], t: -64, l: [124, -16], a: [60, 80], w: [['*', 'pelve']] }, B: { H: [130, 172], t: -92, l: [96, -6], a: [60, 80], w: [['*', 'pelve']] } },
  /* ----- core ----- */
  prancha: { A: { H: [100, 205], t: 78, l: [-78, -78], a: [0, 90] }, B: { H: [100, 205], t: 78, l: [-78, -78], a: [0, 90] } },
  flexao: { A: { H: [100, 186], t: 72, l: [-72, -72], a: [0, 0] }, B: { H: [100, 208], t: 82, l: [-82, -82], a: [-46, 18] } },
  abdominal: { A: { H: [140, 218], t: -90, l: [128, -28], ar: 1, a: [150, -110] }, B: { H: [140, 218], t: -58, l: [128, -28], ar: 1, a: [150, -110] } },
  infra: { A: { H: [130, 218], t: -90, l: [96, 96], a: [90, 90] }, B: { H: [130, 218], t: -90, l: [176, 176], a: [90, 90] } },
  deadBug: { A: { H: [130, 218], t: -90, l: [178, 90], a: [180, 180] },
    B: { H: [130, 218], t: -90, l: [100, 100], l2: [178, 90], a: [-84, -86], a2: [180, 180] } },
  superman: { A: { H: [110, 218], t: 90, l: [-90, -90], a: [92, 92] }, B: { H: [110, 214], t: 78, l: [-104, -104], a: [112, 112] } },
  roda: { A: { H: [100, 182], t: 30, l: [6, -90], a: [16, 16], w: [['rolo', 'W']] }, B: { H: [84, 196], t: 78, l: [-50, -90], a: [96, 96], w: [['rolo', 'W']] } },
  canoa: { A: { H: [130, 218], t: -90, l: [90, 90], a: [-90, -90] }, B: { H: [130, 214], t: -72, l: [104, 104], a: [-106, -106] } },
  canivete: { A: { H: [130, 218], t: -90, l: [90, 90], a: [-90, -90] }, B: { H: [130, 220], t: -32, l: [148, 148], a: [148, 148] } },
  hiper: { pr: [['l', 106, 160, 150, 120, 9], ['c', 46, 198, 7], ['l', 40, 232, 150, 120, 5]],
    A: { H: [116, 146], t: 138, l: [-44, -44], ar: 1, a: [150, -150] }, B: { H: [116, 146], t: 46, l: [-44, -44], ar: 1, a: [150, -150] } },
  ponte: { A: { H: [140, 218], t: -90, l: [125, -25], a: [90, 90] }, B: { H: [140, 193], t: -115, l: [100, -15], a: [90, 90] } },
  pallof: { pr: [['l', 0, 120, 0, 232, 6]], A: pe({ a: [20, 150], k: [['W', 2, 140]] }), B: pe({ a: [90, 90], k: [['W', 2, 140]] }) },
  elevacaoPernas: { pr: [['l', 82, 90, 82, 232, 6], ['l', 82, 150, 140, 150, 7]],
    A: { H: [102, 172], t: 0, l: [0, 0], a: [0, 90] }, B: { H: [102, 172], t: -4, l: [90, 90], a: [0, 90] } },
  giroRusso: { v: 'f', A: { y: 60, s: 1, l: [-176, -6], a: [36, 64], a2: [-30, -62], w: [['*', 'W']] }, B: { y: 60, s: 1, l: [-176, -6], a: [-30, -62], a2: [36, 64], w: [['*', 'Wd']] } },
  /* ----- inferiores de frente ----- */
  abdutora: { v: 'f', pr: [...ENCOSTO_F, ...BANCO_F], A: sf({ l: [4, 2], w: [['rolo', 'K'], ['rolo', 'Kd']] }), B: sf({ l: [62, 16], w: [['rolo', 'K'], ['rolo', 'Kd']] }) },
  adutora: { v: 'f', pr: [...ENCOSTO_F, ...BANCO_F], A: sf({ l: [62, 16], w: [['rolo', 'K'], ['rolo', 'Kd']] }), B: sf({ l: [4, 2], w: [['rolo', 'K'], ['rolo', 'Kd']] }) },
};
POSES.coicePolia = { pr: [['l', 236, 60, 236, 232, 6], ['l', 196, 120, 236, 120, 5]],
  A: { P2: [126, CH], t: 20, l: [0, 0], l2: [0, 0], a: [64, 70], k: [['P', 236, 222]] }, B: { P2: [126, CH], t: 20, l: [-42, -36], l2: [0, 0], a: [64, 70], k: [['P', 236, 222]] } };
POSES.panturrilhaLP = { pr: POSES.legPress.pr, A: { ...POSES.legPress.B, pf: -16 }, B: { ...POSES.legPress.B, pf: 34 } };

const FICHAS = {
  'rosca-punho-polia':     { d: 'punhoPoliaPe', peso: 'punho', pad: 'Isolado · flexão de punho', p: ['antebraco'], s: [], dicas: ['Em pé, de frente para a polia baixa com barra reta, pegada com as palmas para cima.', 'Cotovelos colados ao corpo e dobrados a 90°: deixe o punho descer e enrole a barra para cima. Só o punho mexe.', 'Sem balançar o corpo nem mexer os cotovelos; movimento curto e controlado.'] },
  'rosca-punho-halter':    { d: 'punhoBanco', peso: 'halter', pad: 'Isolado · flexão de punho', p: ['antebraco'], s: [], dicas: ['Sentado no banco, antebraço apoiado na coxa, palma para cima e punho para fora do joelho.', 'Desça o halter devagar e suba enrolando o punho. Um braço de cada vez ou os dois juntos.', 'Carga leve e reps altas: o antebraço responde melhor a 12–20 reps perto da falha.'] },
  'rosca-punho-invertida': { d: 'punhoBanco', peso: 'halter', pad: 'Isolado · extensão de punho', p: ['antebraco'], s: [], dicas: ['Mesma posição da rosca de punho, mas com a palma para baixo. Vale com halter, barra ou na polia baixa.', 'Levante o dorso da mão para cima e desça devagar.', 'Use bem menos carga que na rosca de punho: os extensores são mais fracos.'] },
  'rosca-inversa-polia':   { d: 'roscaPolia', peso: 'punho', pad: 'Isolado · flexão de cotovelo', p: ['antebraco'], s: ['biceps'], dicas: ['Polia baixa com barra reta, pegada pronada (palmas para baixo), na largura dos ombros.', 'Cotovelos colados ao corpo; suba até a barra chegar perto do peito.', 'Punho firme e reto o tempo todo: quem trabalha é o braquiorradial, o músculo grande do antebraço.'] },
  'supino-reto':           { d: 'supino', peso: 'barra', pad: 'Composto · empurrar horizontal', p: ['peito'], s: ['triceps', 'ombro'], dicas: ['Escápulas encaixadas e pés firmes no chão.', 'Desça controlando até a barra tocar o meio do peito.', 'Empurre até estender os braços sem tirar os ombros do banco.'] },
  'supino-reto-halteres':  { d: 'supino', peso: 'halter', pad: 'Composto · empurrar horizontal', p: ['peito'], s: ['triceps', 'ombro'], dicas: ['Halteres alinhados com o meio do peito.', 'Desça até sentir o alongamento do peito, cotovelos a ~45° do tronco.', 'Suba aproximando os halteres sem bater.'] },
  'supino-inclinado':      { d: 'inclinado', peso: 'halter', pad: 'Composto · empurrar inclinado', p: ['peito'], s: ['ombro', 'triceps'], dicas: ['Banco entre 30° e 45°.', 'Desça os halteres até a linha do peito superior.', 'Empurre para cima e levemente para dentro.'] },
  'supino-inclinado-barra':{ d: 'inclinado', peso: 'barra', pad: 'Composto · empurrar inclinado', p: ['peito'], s: ['ombro', 'triceps'], dicas: ['Banco entre 30° e 45°.', 'A barra desce até a parte alta do peito.', 'Mantenha as escápulas encaixadas durante todo o movimento.'] },
  'voador':                { d: 'voador', peso: 'punho', pad: 'Isolado · adução horizontal', p: ['peito'], s: ['ombro'], dicas: ['Ajuste o banco para as pegadas ficarem na altura do peito.', 'Cotovelos levemente flexionados e fixos.', 'Feche até as mãos quase se tocarem e volte devagar.'] },
  'crucifixo-halteres':    { d: 'crucifixo', peso: 'halter', pad: 'Isolado · adução horizontal', p: ['peito'], s: ['ombro'], dicas: ['Cotovelos levemente dobrados, como se abraçasse uma árvore.', 'Abra até sentir o peito alongar, sem forçar o ombro.', 'Feche pelo peito, não pelos braços.'] },
  'barra-fixa':            { d: 'barraFixa', peso: 'punho', pad: 'Composto · puxar vertical', p: ['costas'], s: ['biceps'], dicas: ['Pegada um pouco mais larga que os ombros.', 'Puxe levando os cotovelos para baixo e para trás.', 'Desça até estender os braços, sem balançar.'] },
  'puxada-alta':           { d: 'puxada', peso: 'punho', pad: 'Composto · puxar vertical', p: ['costas'], s: ['biceps'], dicas: ['Coxas presas no apoio, tronco levemente inclinado para trás.', 'Puxe a barra até a parte alta do peito.', 'Volte controlando até alongar as costas.'] },
  'remada':                { d: 'remadaCurvada', peso: 'barra', pad: 'Composto · puxar horizontal', p: ['costas'], s: ['biceps', 'ombro'], dicas: ['Tronco inclinado à frente, coluna neutra.', 'Puxe em direção ao umbigo, cotovelos rentes ao corpo.', 'Desça até estender os braços sem arredondar as costas.'] },
  'remada-maquina':        { d: 'remadaSentado', peso: 'punho', pad: 'Composto · puxar horizontal', p: ['costas'], s: ['ombro', 'biceps'], dicas: ['Peito no apoio, pegue nas alças horizontais com as palmas para baixo, mãos afastadas.', 'Puxe com os cotovelos abertos, perto da altura dos ombros, e aperte as escápulas no fim.', 'Pega mais a parte alta das costas e o ombro posterior. Volte devagar, sem soltar o peito do apoio.'] },
  'remada-maquina-neutra': { d: 'remadaSentado', peso: 'punho', pad: 'Composto · puxar horizontal', p: ['costas'], s: ['biceps'], dicas: ['Peito no apoio, pegue nas alças verticais com as palmas viradas uma para a outra.', 'Puxe com os cotovelos rentes ao corpo, levando as mãos em direção à cintura.', 'Pega mais o latíssimo (as "asas"). Estique os braços inteiros na volta, sem tirar o peito do apoio.'] },
  'remada-baixa':          { d: 'remadaSentado', peso: 'punho', pad: 'Composto · puxar horizontal', p: ['costas'], s: ['biceps'], dicas: ['Joelhos levemente dobrados, tronco ereto.', 'Puxe o triângulo até o abdômen.', 'Não balance o tronco para ajudar.'] },
  'desenvolvimento':       { d: 'desenvolvimento', peso: 'halter', pad: 'Composto · empurrar vertical', p: ['ombro'], s: ['triceps'], dicas: ['Costas apoiadas, halteres na altura das orelhas.', 'Empurre até quase estender os braços.', 'Desça controlando até a altura inicial.'] },
  'desenvolvimento-maquina':{ d: 'desenvolvimento', peso: 'punho', pad: 'Composto · empurrar vertical', p: ['ombro'], s: ['triceps'], dicas: ['Ajuste o banco para as pegadas ficarem na altura dos ombros.', 'Empurre sem tirar as costas do encosto.', 'Desça até a altura das orelhas.'] },
  'elevacao-lateral':      { d: 'lateral', peso: 'halter', pad: 'Isolado · abdução de ombro', p: ['ombro'], s: [], dicas: ['Cotovelos levemente dobrados.', 'Suba até a linha dos ombros, liderando com os cotovelos.', 'Desça devagar, sem balançar o corpo.'] },
  'elevacao-lateral-polia':{ d: 'lateral', peso: 'punho', pad: 'Isolado · abdução de ombro', p: ['ombro'], s: [], dicas: ['Cabo saindo da polia baixa, do lado oposto.', 'Suba até a linha do ombro.', 'A polia mantém tensão também no início do movimento.'] },
  'crucifixo-inverso':     { d: 'inversoCurvado', peso: 'halter', pad: 'Isolado · ombro posterior', p: ['ombro'], s: ['costas'], dicas: ['Tronco inclinado, coluna neutra.', 'Abra os braços para os lados com cotovelos levemente dobrados.', 'Pense em levar as mãos para longe, não para cima.'] },
  'face-pull':             { d: 'facePull', peso: 'punho', pad: 'Isolado · ombro posterior', p: ['ombro'], s: ['costas'], dicas: ['Corda na altura do rosto.', 'Puxe em direção à testa abrindo os cotovelos.', 'Gire os punhos para fora no final.'] },
  'rosca-direta':          { d: 'rosca', peso: 'barra', pad: 'Isolado · flexão de cotovelo', p: ['biceps'], s: [], dicas: ['Cotovelos fixos ao lado do corpo.', 'Suba sem jogar o tronco para trás.', 'Desça até estender totalmente os braços.'] },
  'rosca-martelo':         { d: 'rosca', peso: 'halter', pad: 'Isolado · flexão de cotovelo', p: ['biceps'], s: ['antebraco'], dicas: ['Pegada neutra, palmas viradas uma para a outra.', 'Cotovelos fixos.', 'Suba e desça controlando, sem balanço.'] },
  'rosca-alternada':       { d: 'rosca', peso: 'halter', pad: 'Isolado · flexão de cotovelo', p: ['biceps'], s: [], dicas: ['Um braço de cada vez, girando a palma para cima ao subir.', 'Cotovelo parado ao lado do corpo.', 'Desça até estender totalmente.'] },
  'rosca-scott':           { d: 'scott', peso: 'barra', pad: 'Isolado · flexão de cotovelo', p: ['biceps'], s: [], dicas: ['Parte de trás do braço apoiada no banco.', 'Desça até quase estender, sem travar.', 'Suba sem tirar o braço do apoio.'] },
  'triceps-pulley':        { d: 'pulley', peso: 'punho', pad: 'Isolado · extensão de cotovelo', p: ['triceps'], s: [], dicas: ['Cotovelos colados ao corpo.', 'Estenda até os braços ficarem retos.', 'Volte até o antebraço passar da horizontal.'] },
  'triceps-frances':       { d: 'frances', peso: 'halter', pad: 'Isolado · extensão de cotovelo', p: ['triceps'], s: [], dicas: ['Braços acima da cabeça, cotovelos apontando para a frente.', 'Desça o peso atrás da cabeça alongando o tríceps.', 'Estenda sem abrir os cotovelos.'] },
  'triceps-testa':         { d: 'testa', peso: 'barra', pad: 'Isolado · extensão de cotovelo', p: ['triceps'], s: [], dicas: ['Braços apontando para o teto.', 'Dobre só os cotovelos, levando a barra em direção à testa.', 'Estenda sem mexer os ombros.'] },
  'mergulho':              { d: 'mergulho', peso: 'punho', pad: 'Composto · empurrar vertical', p: ['triceps'], s: ['peito', 'ombro'], dicas: ['Tronco mais ereto foca o tríceps; inclinado, o peito.', 'Desça até os cotovelos formarem ~90°.', 'Suba até estender sem travar.'] },
  'agachamento':           { d: 'agachamento', peso: 'barra', pad: 'Composto · agachar', p: ['pernas'], s: ['gluteos'], dicas: ['Pés na largura dos ombros, pontas levemente para fora.', 'Desça empurrando o quadril para trás, joelhos na direção dos pés.', 'Suba mantendo o peito aberto e a coluna neutra.'] },
  'leg-press':             { d: 'legPress', peso: 'punho', pad: 'Composto · agachar', p: ['pernas'], s: ['gluteos'], dicas: ['Lombar apoiada o tempo todo.', 'Desça até os joelhos chegarem perto de 90° ou um pouco mais.', 'Empurre sem travar os joelhos no final.'] },
  'bulgaro':               { d: 'bulgaro', peso: 'halter', pad: 'Composto · unilateral', p: ['pernas'], s: ['gluteos'], dicas: ['Pé de trás apoiado no banco.', 'Desça na vertical até o joelho de trás quase tocar o chão.', 'Empurre pelo pé da frente.'] },
  'afundo':                { d: 'afundo', peso: 'halter', pad: 'Composto · unilateral', p: ['pernas'], s: ['gluteos'], dicas: ['Passo longo à frente, tronco ereto.', 'Desça até os dois joelhos formarem ~90°.', 'Volte empurrando pelo calcanhar da frente.'] },
  'extensora':             { d: 'extensora', peso: 'rolo', pad: 'Isolado · extensão de joelho', p: ['pernas'], s: [], dicas: ['Joelho alinhado com o eixo da máquina.', 'Estenda até as pernas ficarem retas.', 'Desça devagar, sem deixar o peso bater.'] },
  'stiff':                 { d: 'stiff', peso: 'barra', pad: 'Composto · dobrar o quadril', p: ['posterior'], s: ['gluteos', 'costas'], dicas: ['Joelhos levemente dobrados e fixos.', 'Desça empurrando o quadril para trás, barra rente às pernas.', 'Suba contraindo glúteos e posteriores, coluna neutra.'] },
  'stiff-unilateral':      { d: 'stiff', peso: 'halter', pad: 'Composto · dobrar o quadril', p: ['posterior'], s: ['gluteos'], dicas: ['Apoie o peso numa perna e leve a outra para trás.', 'Quadril nivelado, sem girar.', 'Desça até sentir o posterior alongar.'] },
  'flexora':               { d: 'flexora', peso: 'rolo', pad: 'Isolado · flexão de joelho', p: ['posterior'], s: [], dicas: ['Joelho alinhado com o eixo da máquina.', 'Dobre até o máximo que conseguir sem tirar o quadril do apoio.', 'Volte devagar até estender.'] },
  'elevacao-pelvica':      { d: 'pelvica', peso: 'barra', pad: 'Composto · extensão de quadril', p: ['gluteos'], s: ['posterior'], dicas: ['Parte alta das costas apoiada no banco.', 'Suba o quadril até o tronco ficar alinhado com as coxas.', 'Queixo levemente recolhido, sem arquear a lombar.'] },
  'panturrilha':           { d: 'panturrilha', peso: 'halter', pad: 'Isolado · flexão plantar', p: ['panturrilha'], s: [], dicas: ['Ponta dos pés num degrau.', 'Desça o calcanhar até alongar bem.', 'Suba ao máximo e segure 1 segundo.'] },
  'panturrilha-sentado':   { d: 'panturrilhaSentado', peso: 'rolo', pad: 'Isolado · flexão plantar', p: ['panturrilha'], s: [], dicas: ['Apoio sobre as coxas, perto dos joelhos.', 'Desça o calcanhar até alongar.', 'Suba ao máximo, sem quicar.'] },
  'abdominal':             { d: 'abdominal', peso: '', pad: 'Isolado · flexão de tronco', p: ['core'], s: [], dicas: ['Enrole o tronco aproximando as costelas do quadril.', 'Não puxe o pescoço com as mãos.', 'Desça controlando.'] },
  'supino-maquina':        { d: 'supinoMaquina', peso: 'punho', pad: 'Composto · empurrar horizontal', p: ['peito'], s: ['triceps', 'ombro'], dicas: ['Ajuste o banco para as pegadas ficarem na altura do meio do peito.', 'Empurre até quase estender os braços.', 'Volte devagar até sentir o peito alongar.'] },
  'crossover':             { d: 'crossover', peso: 'punho', pad: 'Isolado · adução horizontal', p: ['peito'], s: ['ombro'], dicas: ['Polias no alto, um passo à frente, tronco levemente inclinado.', 'Traga as mãos para baixo e para a frente, cotovelos levemente dobrados.', 'Volte abrindo até sentir o peito alongar.'] },
  'remada-cavalinho':      { d: 'remadaCurvada', peso: 'barra', pad: 'Composto · puxar horizontal', p: ['costas'], s: ['biceps'], dicas: ['Tronco inclinado, coluna neutra e joelhos levemente dobrados.', 'Puxe a barra em direção ao abdômen, cotovelos rentes.', 'Desça até estender os braços sem arredondar as costas.'] },
  'puxada-neutra':         { d: 'puxada', peso: 'punho', pad: 'Composto · puxar vertical', p: ['costas'], s: ['biceps'], dicas: ['Triângulo ou pegada neutra, palmas viradas uma para a outra.', 'Puxe até a parte alta do peito, levando os cotovelos para baixo.', 'Volte controlando até alongar as costas.'] },
  'pullover-polia':        { d: 'pullover', peso: 'punho', pad: 'Isolado · extensão de ombro', p: ['costas'], s: [], dicas: ['De frente para a polia alta, quadril levemente para trás.', 'Com os braços quase retos, traga a barra até as coxas.', 'Volte devagar até os braços passarem da linha da cabeça.'] },
  'encolhimento':          { d: 'encolhimento', peso: 'halter', pad: 'Isolado · trapézio', p: ['costas'], s: [], dicas: ['Halteres ao lado do corpo, braços retos.', 'Suba os ombros em direção às orelhas, sem girar.', 'Segure 1 segundo no alto e desça devagar.'] },
  'desenvolvimento-barra': { d: 'desenvBarra', peso: 'barra', pad: 'Composto · empurrar vertical', p: ['ombro'], s: ['triceps'], dicas: ['Em pé, abdômen e glúteos firmes.', 'Empurre a barra para cima passando rente ao rosto.', 'Desça até a altura do queixo ou da parte alta do peito.'] },
  'rosca-inclinada':       { d: 'roscaInclinada', peso: 'halter', pad: 'Isolado · flexão de cotovelo', p: ['biceps'], s: [], dicas: ['Banco entre 45° e 60°, braços pendurados atrás da linha do corpo.', 'Suba sem trazer o cotovelo para a frente.', 'Desça até estender totalmente: o bíceps trabalha alongado.'] },
  'rosca-scott-halter':    { d: 'scott', peso: 'halter', pad: 'Isolado · flexão de cotovelo', p: ['biceps'], s: [], dicas: ['Um braço de cada vez, axila encaixada no banco.', 'Desça até quase estender, sem travar.', 'Suba sem tirar o braço do apoio.'] },
  'triceps-overhead-polia':{ d: 'francesPolia', peso: 'punho', pad: 'Isolado · extensão de cotovelo', p: ['triceps'], s: [], dicas: ['De costas para a polia baixa, corda atrás da cabeça.', 'Cotovelos apontando para a frente; só o antebraço se move.', 'Estenda totalmente e volte alongando bem o tríceps.'] },
  'hack-smith':            { d: 'agachamento', peso: 'barra', pad: 'Composto · agachar', p: ['pernas'], s: ['gluteos'], dicas: ['Pés um pouco à frente da linha do corpo.', 'Desça até as coxas ficarem paralelas ao chão ou mais.', 'Suba empurrando o chão, sem tirar os calcanhares.'] },
  'terra':                 { d: 'terra', peso: 'barra', pad: 'Composto · dobrar o quadril', p: ['posterior'], s: ['gluteos', 'costas', 'pernas'], dicas: ['Barra sobre o meio do pé, canelas perto da barra.', 'Coluna neutra: empurre o chão com as pernas e estenda o quadril.', 'Suba com a barra rente ao corpo e desça pelo mesmo caminho.'] },
  'flexora-sentada':       { d: 'flexoraSentada', peso: 'rolo', pad: 'Isolado · flexão de joelho', p: ['posterior'], s: [], dicas: ['Ajuste o encosto para o joelho ficar alinhado com o eixo da máquina.', 'Dobre os joelhos puxando o rolo para baixo e para trás.', 'Volte devagar até quase estender: sentado, o posterior trabalha mais alongado.'] },
  'adutora':               { d: 'adutora', peso: 'rolo', pad: 'Isolado · adução de quadril', p: ['adutores'], s: [], dicas: ['Costas apoiadas, pernas abertas numa amplitude confortável.', 'Feche as pernas contra os apoios.', 'Abra devagar até sentir a parte interna da coxa alongar.'] },
  'abdutora':              { d: 'abdutora', peso: 'rolo', pad: 'Isolado · abdução de quadril', p: ['gluteos'], s: [], dicas: ['Costas apoiadas, pernas fechadas.', 'Abra as pernas empurrando os apoios para fora.', 'Volte devagar, sem deixar o peso bater.'] },
  'panturrilha-leg-press': { d: 'panturrilhaLP', peso: '', pad: 'Isolado · flexão plantar', p: ['panturrilha'], s: [], dicas: ['Só a ponta dos pés na plataforma, joelhos estendidos sem travar.', 'Deixe o calcanhar descer até alongar bem.', 'Empurre com a ponta dos pés ao máximo.'] },
  'prancha':               { d: 'prancha', peso: '', pad: 'Isométrico · core', p: ['core'], s: [], dicas: ['Antebraços sob os ombros, corpo em linha reta.', 'Contraia abdômen e glúteos sem deixar o quadril cair.', 'Registre os segundos no campo de repetições.'] },
  'pallof':                { d: 'pallof', peso: 'punho', pad: 'Isolado · antirrotação', p: ['core'], s: [], dicas: ['De lado para a polia, cabo na altura do peito.', 'Empurre as mãos à frente sem deixar o tronco girar.', 'Segure 2 segundos e volte ao peito.'] },
  'supino-declinado':      { d: 'supino', peso: 'barra', pad: 'Composto · empurrar horizontal', p: ['peito'], s: ['triceps'], dicas: ['Banco declinado com as pernas presas no apoio.', 'Desça a barra até a parte baixa do peito.', 'Empurre sem tirar os ombros do banco.'] },
  'flexao':                { d: 'flexao', peso: '', pad: 'Composto · empurrar horizontal', p: ['peito'], s: ['triceps', 'ombro'], dicas: ['Mãos um pouco mais abertas que os ombros, corpo em linha reta.', 'Desça até o peito quase tocar o chão, cotovelos a ~45°.', 'Fácil demais? Pés num banco. Difícil? Joelhos no chão.'] },
  'crossover-baixo':       { d: 'crossover', peso: 'punho', pad: 'Isolado · adução horizontal', p: ['peito'], s: ['ombro'], dicas: ['Polias na posição mais baixa.', 'Traga as mãos para cima e para a frente, até a altura do queixo.', 'Volte devagar até sentir a parte alta do peito alongar.'] },
  'barra-supinada':        { d: 'barraFixa', peso: 'punho', pad: 'Composto · puxar vertical', p: ['costas'], s: ['biceps'], dicas: ['Palmas viradas para você, mãos na largura dos ombros.', 'Puxe até o queixo passar a barra.', 'Desça até estender os braços. Trabalha mais o bíceps que a pronada.'] },
  'puxada-supinada':       { d: 'puxada', peso: 'punho', pad: 'Composto · puxar vertical', p: ['costas'], s: ['biceps'], dicas: ['Pegada supinada na largura dos ombros.', 'Puxe a barra até a parte alta do peito.', 'Volte controlando até alongar as costas.'] },
  'elevacao-frontal':      { d: 'frontal', peso: 'halter', pad: 'Isolado · flexão de ombro', p: ['ombro'], s: [], dicas: ['Braços quase retos, pegada neutra ou pronada.', 'Suba até a altura dos ombros.', 'Desça devagar, sem balançar. Supinos já trabalham bastante essa região.'] },
  'desenvolvimento-arnold':{ d: 'desenvolvimento', peso: 'halter', pad: 'Composto · empurrar vertical', p: ['ombro'], s: ['triceps'], dicas: ['Comece com os halteres na frente do rosto, palmas para você.', 'Gire as palmas para a frente enquanto empurra para cima.', 'Desça desfazendo o giro.'] },
  'elevacao-lateral-maquina':{ d: 'lateral', peso: 'punho', pad: 'Isolado · abdução de ombro', p: ['ombro'], s: [], dicas: ['Ombro alinhado com o eixo da máquina.', 'Suba até a linha dos ombros.', 'A máquina mantém a tensão o movimento todo.'] },
  'crucifixo-inverso-maquina':{ d: 'voadorInverso', peso: 'punho', pad: 'Isolado · ombro posterior', p: ['ombro'], s: ['costas'], dicas: ['De frente para o encosto do voador, pegadas na altura dos ombros.', 'Abra os braços para trás, cotovelos levemente dobrados.', 'Volte devagar sem deixar o peso bater.'] },
  'rosca-polia-reta':      { d: 'roscaPolia', peso: 'punho', pad: 'Isolado · flexão de cotovelo', p: ['biceps'], s: [], dicas: ['Polia baixa, barra reta, cotovelos colados ao corpo.', 'Suba sem jogar o tronco para trás.', 'A polia mantém tensão até no fim da descida.'] },
  'rosca-polia-w':         { d: 'roscaPolia', peso: 'punho', pad: 'Isolado · flexão de cotovelo', p: ['biceps'], s: [], dicas: ['Polia baixa, barra W: punhos mais confortáveis que na reta.', 'Cotovelos fixos ao lado do corpo.', 'Desça até estender totalmente.'] },
  'rosca-concentrada':     { d: 'scott', peso: 'halter', pad: 'Isolado · flexão de cotovelo', p: ['biceps'], s: [], dicas: ['Sentado, cotovelo apoiado na parte interna da coxa.', 'Suba sem mexer o ombro.', 'Desça até estender o braço.'] },
  'rosca-martelo-corda':   { d: 'roscaPolia', peso: 'punho', pad: 'Isolado · flexão de cotovelo', p: ['biceps'], s: ['antebraco'], dicas: ['Polia baixa com corda, pegada neutra.', 'Cotovelos fixos, suba até o antebraço passar da horizontal.', 'Desça devagar.'] },
  'triceps-pulley-barra':  { d: 'pulley', peso: 'punho', pad: 'Isolado · extensão de cotovelo', p: ['triceps'], s: [], dicas: ['Barra reta ou V, cotovelos colados ao corpo.', 'Estenda até os braços ficarem retos.', 'Volte até o antebraço passar da horizontal.'] },
  'triceps-coice':         { d: 'coice', peso: 'halter', pad: 'Isolado · extensão de cotovelo', p: ['triceps'], s: [], dicas: ['Tronco inclinado, braço colado ao corpo e paralelo ao chão.', 'Estenda o cotovelo levando o halter para trás.', 'Só o antebraço se move.'] },
  'triceps-banco':         { d: 'mergulho', peso: 'punho', pad: 'Composto · empurrar vertical', p: ['triceps'], s: ['peito', 'ombro'], dicas: ['Mãos na borda do banco, quadril perto dele.', 'Desça até os cotovelos formarem ~90°.', 'Se incomodar o ombro, troque por pulley.'] },
  'supino-fechado':        { d: 'supino', peso: 'barra', pad: 'Composto · empurrar horizontal', p: ['triceps'], s: ['peito', 'ombro'], dicas: ['Mãos na largura dos ombros, não mais juntas que isso.', 'Cotovelos rentes ao corpo na descida.', 'Desça até a parte baixa do peito e empurre.'] },
  'agachamento-goblet':    { d: 'agachFrente', peso: 'halter', pad: 'Composto · agachar', p: ['pernas'], s: ['gluteos'], dicas: ['Halter ou kettlebell junto ao peito.', 'Desça entre as pernas, tronco ereto.', 'Ótimo para aprender o agachamento.'] },
  'agachamento-sumo':      { d: 'agachFrente', peso: 'halter', pad: 'Composto · agachar', p: ['pernas'], s: ['gluteos', 'adutores'], dicas: ['Pés bem afastados, pontas para fora.', 'Desça com os joelhos na direção dos pés.', 'Suba empurrando o chão, tronco ereto.'] },
  'passada':               { d: 'afundo', peso: 'halter', pad: 'Composto · unilateral', p: ['pernas'], s: ['gluteos'], dicas: ['Passos longos, alternando as pernas.', 'Desça até o joelho de trás quase tocar o chão.', 'Conte cada perna como uma repetição.'] },
  'gluteo-polia':          { d: 'coicePolia', peso: 'punho', pad: 'Isolado · extensão de quadril', p: ['gluteos'], s: ['posterior'], dicas: ['Tornozeleira na polia baixa, segure no apoio.', 'Leve a perna para trás sem arquear a lombar.', 'Volte devagar, sem apoiar o pé.'] },
  'elevacao-pelvica-maquina':{ d: 'pelvica', peso: 'rolo', pad: 'Composto · extensão de quadril', p: ['gluteos'], s: ['posterior'], dicas: ['Costas no encosto, apoio sobre o quadril.', 'Suba até o tronco alinhar com as coxas.', 'Segure 1 segundo no alto.'] },
  'abdominal-maquina':     { d: 'abdominal', peso: '', pad: 'Isolado · flexão de tronco', p: ['core'], s: [], dicas: ['Ajuste o banco para dobrar na altura do abdômen.', 'Enrole o tronco, sem puxar com os braços.', 'Dá para progredir em carga como os outros exercícios.'] },
  'abdominal-infra':       { d: 'infra', peso: '', pad: 'Isolado · flexão de quadril', p: ['core'], s: [], dicas: ['Deitado, mãos ao lado do corpo ou sob o quadril.', 'Suba as pernas e tire levemente o quadril do chão.', 'Desça devagar sem tocar os pés no chão.'] },
  'prancha-lateral':       { d: 'prancha', peso: '', pad: 'Isométrico · core', p: ['core'], s: [], dicas: ['Antebraço sob o ombro, corpo de lado em linha reta.', 'Quadril alto, sem deixar cair.', 'Registre os segundos de cada lado.'] },
  'abdominal-bicicleta':   { d: 'deadBug', peso: '', pad: 'Isolado · rotação e flexão de tronco', p: ['core'], s: [], dicas: ['Deitado, mãos na lateral da cabeça sem puxar o pescoço.', 'Leve o cotovelo em direção ao joelho oposto enquanto estende a outra perna.', 'Alterne devagar: cada lado conta uma repetição.'] },
  'abdominal-obliquo':     { d: 'abdominal', peso: '', pad: 'Isolado · flexão lateral', p: ['core'], s: [], dicas: ['Deitado, joelhos dobrados.', 'Suba o tronco girando o ombro em direção ao joelho oposto.', 'Faça todas de um lado e depois do outro.'] },
  'abdominal-carga':       { d: 'abdominal', peso: '', pad: 'Isolado · flexão de tronco', p: ['core'], s: [], dicas: ['Anilha ou halter junto ao peito.', 'Enrole o tronco aproximando costelas e quadril.', 'Ficou fácil? Aumente a carga, como nos outros exercícios.'] },
  'crunch-reverso':        { d: 'infra', peso: '', pad: 'Isolado · flexão de quadril', p: ['core'], s: [], dicas: ['Deitado, joelhos dobrados em 90° no ar.', 'Leve os joelhos ao peito tirando o quadril do chão.', 'Desça devagar, sem balançar.'] },
  'abdominal-canivete':    { d: 'canivete', peso: '', pad: 'Isolado · flexão de tronco e quadril', p: ['core'], s: [], dicas: ['Deitado, braços estendidos atrás da cabeça.', 'Suba tronco e pernas ao mesmo tempo, tentando tocar os pés.', 'Desça controlando. Difícil? Dobre os joelhos.'] },
  'dead-bug':              { d: 'deadBug', peso: '', pad: 'Isolado · estabilidade do core', p: ['core'], s: [], dicas: ['Deitado, braços para cima e joelhos em 90°.', 'Estenda um braço e a perna oposta sem a lombar sair do chão.', 'Volte e troque o lado. Devagar vale mais que rápido.'] },
  'canoa':                 { d: 'canoa', peso: '', pad: 'Isométrico · core', p: ['core'], s: [], dicas: ['Deitado, tire ombros e pernas do chão.', 'Lombar colada no chão o tempo todo.', 'Registre os segundos no campo de repetições.'] },
  'giro-russo':            { d: 'giroRusso', peso: 'halter', pad: 'Isolado · rotação de tronco', p: ['core'], s: [], dicas: ['Sentado, tronco inclinado para trás, pés no chão ou elevados.', 'Gire o tronco levando o peso de um lado ao outro.', 'Cada lado conta uma repetição.'] },
  'roda-abdominal':        { d: 'roda', peso: '', pad: 'Isolado · antiextensão', p: ['core'], s: ['costas'], dicas: ['Ajoelhado, rodinha sob os ombros.', 'Role à frente até onde conseguir sem arquear a lombar.', 'Volte puxando com o abdômen.'] },
  'elevacao-pernas-paralela':{ d: 'elevacaoPernas', peso: 'punho', pad: 'Isolado · flexão de quadril', p: ['core'], s: [], dicas: ['Antebraços apoiados na paralela, costas no encosto.', 'Suba os joelhos até a altura do quadril ou mais.', 'Desça devagar, sem balançar.'] },
  'hiperextensao':         { d: 'hiper', peso: '', pad: 'Isolado · extensão de quadril e lombar', p: ['posterior'], s: ['gluteos', 'costas'], dicas: ['Apoio na altura do quadril, tornozelos presos.', 'Desça o tronco com a coluna neutra.', 'Suba até alinhar o corpo, sem hiperestender a lombar.'] },
  'superman':              { d: 'superman', peso: '', pad: 'Isolado · extensão de tronco', p: ['core'], s: ['gluteos'], dicas: ['Deitado de bruços, braços estendidos à frente.', 'Tire braços e pernas do chão ao mesmo tempo.', 'Segure 2 segundos no alto e desça.'] },
  'terra-romeno':          { d: 'stiff', peso: 'barra', pad: 'Composto · dobrar o quadril', p: ['posterior'], s: ['gluteos', 'costas'], dicas: ['Comece em pé, joelhos levemente dobrados.', 'Desça empurrando o quadril para trás, barra rente às coxas.', 'Pare quando sentir o posterior alongar e suba contraindo glúteos.'] },
  'pullover-halter':       { d: 'pulloverHalter', peso: 'halter', pad: 'Isolado · extensão de ombro', p: ['costas'], s: ['peito'], dicas: ['Deitado no banco, halter seguro com as duas mãos sobre o peito.', 'Leve o halter para trás da cabeça com os cotovelos levemente dobrados.', 'Volte até a linha do peito.'] },
  'remada-invertida':      { d: 'remadaInvertida', peso: 'punho', pad: 'Composto · puxar horizontal', p: ['costas'], s: ['biceps'], dicas: ['Barra na altura da cintura (smith ou rack), corpo reto embaixo dela.', 'Puxe o peito até a barra.', 'Mais difícil com os pés mais à frente; mais fácil com joelhos dobrados.'] },
  'flexao-diamante':       { d: 'flexao', peso: '', pad: 'Composto · empurrar horizontal', p: ['triceps'], s: ['peito'], dicas: ['Mãos juntas sob o peito, polegares e indicadores formando um losango.', 'Desça com os cotovelos rentes ao corpo.', 'Difícil? Faça com os joelhos no chão.'] },
  'flexao-inclinada':      { d: 'flexao', peso: '', pad: 'Composto · empurrar horizontal', p: ['peito'], s: ['triceps', 'ombro'], dicas: ['Mãos num banco ou na barra do smith.', 'Corpo em linha reta, desça até o peito tocar o apoio.', 'Quanto mais alto o apoio, mais fácil.'] },
  'step-up':               { d: 'stepUp', peso: 'halter', pad: 'Composto · unilateral', p: ['pernas'], s: ['gluteos'], dicas: ['Banco ou caixa na altura do joelho.', 'Suba empurrando pelo pé de cima, sem impulsar com o de baixo.', 'Desça controlando e troque a perna.'] },
  'afundo-reverso':        { d: 'afundo', peso: 'halter', pad: 'Composto · unilateral', p: ['pernas'], s: ['gluteos'], dicas: ['Dê um passo para trás em vez de para a frente.', 'Desça até os dois joelhos formarem ~90°.', 'Mais fácil para o joelho que o afundo tradicional.'] },
  'ponte-gluteo':          { d: 'ponte', peso: '', pad: 'Isolado · extensão de quadril', p: ['gluteos'], s: ['posterior'], dicas: ['Deitado, joelhos dobrados, pés no chão.', 'Suba o quadril até alinhar com as coxas.', 'Segure 1 segundo no alto. Ficou fácil? Uma perna só ou peso no quadril.'] },
  'agachamento-frontal':   { d: 'agachFrente', peso: 'barra', pad: 'Composto · agachar', p: ['pernas'], s: ['gluteos', 'core'], dicas: ['Barra apoiada na frente dos ombros, cotovelos altos.', 'Desça com o tronco mais ereto que no agachamento tradicional.', 'Suba sem deixar os cotovelos caírem.'] },
  'crucifixo-inclinado':   { d: 'crucifixo', peso: 'halter', pad: 'Isolado · adução horizontal', p: ['peito'], s: ['ombro'], dicas: ['Banco entre 30° e 45°.', 'Abra os braços com cotovelos levemente dobrados até alongar o peito.', 'Feche pelo peito, não pelos braços.'] },
  'encolhimento-barra':    { d: 'encolhimento', peso: 'barra', pad: 'Isolado · trapézio', p: ['costas'], s: [], dicas: ['Barra na frente das coxas, braços retos.', 'Suba os ombros em direção às orelhas.', 'Segure 1 segundo e desça devagar.'] },
  'panturrilha-unilateral':{ d: 'panturrilha', peso: 'halter', pad: 'Isolado · flexão plantar', p: ['panturrilha'], s: [], dicas: ['Uma perna num degrau, halter na mão do mesmo lado.', 'Desça o calcanhar até alongar bem.', 'Suba ao máximo e segure 1 segundo.'] },
  'elevacao-pernas':       { d: 'elevacaoPernas', peso: 'punho', pad: 'Isolado · flexão de quadril', p: ['core'], s: [], dicas: ['Pendurado na barra, sem balançar.', 'Suba as pernas até a altura do quadril ou mais.', 'Desça devagar.'] },
};

function desenhoPose(id, quadro){ return boneco(id, quadro); }

function folhaFicha(id){
  const f = FICHAS[id]; if(!f) return '';
  const ex = plano().rotacao.map(k => plano().treinos[k].ex).flat().find(e => e.id === id) || BIB_ID[id] || {};
  const faixa = ex.reps ? `${ex.reps[0]}–${ex.reps[1]} reps` : (BIB_ID[id] ? `${BIB_ID[id].r[0]}–${BIB_ID[id].r[1]} reps` : '');
  const chips = f.p.map(g => `<span class="mus p">${GRUPOS[g]} · 1 série</span>`).join('') + f.s.map(g => `<span class="mus s">${GRUPOS[g]} · ½</span>`).join('');
  return `<div class="folha-fundo" data-fechar-ficha="1"><section class="folha ficha" role="dialog" aria-modal="true" aria-labelledby="ficha-tit">
    <div class="folha-alca" aria-hidden="true"></div>
    <div class="ficha-topo"><div><p class="rot">${esc(f.pad)}</p><h2 id="ficha-tit">${esc(nomeEx(id))}</h2></div>
      <button type="button" class="x-btn" data-acao="fechar-ficha" aria-label="Fechar ficha">${IC.x}</button></div>
    <div class="poses"><figure>${desenhoPose(id, 'A')}<figcaption>Início</figcaption></figure><figure>${desenhoPose(id, 'B')}<figcaption>Fim</figcaption></figure></div>
    <p class="lb" style="margin-top:16px">Músculos</p><div class="chips">${chips}</div>
    <p class="lb" style="margin-top:16px">Execução</p>
    <ol class="dicas">${f.dicas.map((d, i) => `<li><span>${pad2(i + 1)}</span>${esc(d)}</li>`).join('')}</ol>
    ${faixa ? `<div class="ficha-faixa"><span>Faixa no seu plano</span><b>${faixa} · 1–2 da falha</b></div>` : ''}
  </section></div>`;
}

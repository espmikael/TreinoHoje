/* TreinoHoje — biblioteca de exercícios, fichas e ilustrações.
   Para adicionar um exercício: inclua em BIB e, se quiser ficha, em FICHAS (e um desenho em POSES). */

/* ---------- biblioteca de exercícios (editor e gerador) ----------
   g = grupo · k = c (composto) / i (isolado) · eq = b (academia básica serve) / m (precisa de máquina)
   r = faixa de repetições sugerida */
const GRUPOS = { peito: 'Peito', costas: 'Costas', ombro: 'Ombros', biceps: 'Bíceps', triceps: 'Tríceps',
  pernas: 'Quadríceps', posterior: 'Posterior de coxa', gluteos: 'Glúteos', panturrilha: 'Panturrilha', core: 'Core' };
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
].map(([id, nome, g, k, eq, a, b]) => ({ id, nome, g, k, eq, r: [a, b] }));
const BIB_ID = Object.fromEntries(BIB.map(e => [e.id, e]));

/* =========================================================
   FICHAS — ilustrações próprias (traço simples), músculos e execução
   Cada pose: c = cabeça, l = linhas do corpo, w = pesos [tipo,x,y] ('*' = peso do exercício),
   k = cabos [x1,y1,x2,y2], x = peças que se movem. pr = peças fixas (banco, barra, máquina).
   ========================================================= */
const BANCO = [['r', 34, 66, 82, 7], ['l', 44, 73, 44, 104, 4], ['l', 106, 73, 106, 104, 4]];
const ASSENTO = [['r', 54, 72, 40, 6], ['l', 92, 72, 96, 28, 5], ['l', 74, 78, 74, 104, 4]];
const EM_PE_PERNAS = [[80, 62, 76, 104], [80, 62, 84, 104]];
const POSES = {
  supino: { pr: BANCO,
    A: { c: [116, 57], l: [[108, 61, 62, 62], [62, 62, 42, 60, 36, 102], [100, 60, 100, 42, 100, 26]], w: [['*', 100, 24]] },
    B: { c: [116, 57], l: [[108, 61, 62, 62], [62, 62, 42, 60, 36, 102], [100, 60, 86, 70, 95, 47]], w: [['*', 95, 45]] } },
  inclinado: { pr: [['l', 48, 76, 98, 42, 7], ['l', 60, 78, 60, 104, 4], ['l', 90, 50, 92, 104, 4]],
    A: { c: [104, 34], l: [[96, 41, 58, 70], [58, 70, 40, 72, 38, 102], [92, 44, 95, 28, 97, 12]], w: [['*', 97, 10]] },
    B: { c: [104, 34], l: [[96, 41, 58, 70], [58, 70, 40, 72, 38, 102], [92, 44, 80, 60, 90, 30]], w: [['*', 90, 28]] } },
  crucifixo: { pr: BANCO,
    A: { c: [116, 57], l: [[108, 61, 62, 62], [62, 62, 42, 60, 36, 102], [100, 60, 100, 42, 100, 26]], w: [['*', 100, 24]] },
    B: { c: [116, 57], l: [[108, 61, 62, 62], [62, 62, 42, 60, 36, 102], [100, 60, 108, 72, 112, 82]], w: [['*', 113, 84]] } },
  voador: { pr: ASSENTO,
    A: { c: [86, 22], l: [[86, 30, 84, 70], [84, 70, 60, 72, 58, 102], [86, 36, 70, 40, 56, 42]], w: [['punho', 54, 42]] },
    B: { c: [86, 22], l: [[86, 30, 84, 70], [84, 70, 60, 72, 58, 102], [86, 36, 104, 40, 118, 40]], w: [['punho', 120, 40]] } },
  desenvolvimento: { pr: ASSENTO,
    A: { c: [86, 22], l: [[86, 30, 84, 70], [84, 70, 60, 72, 58, 102], [86, 36, 100, 44, 98, 26]], w: [['*', 98, 24]] },
    B: { c: [86, 22], l: [[86, 30, 84, 70], [84, 70, 60, 72, 58, 102], [86, 36, 90, 20, 90, 8]], w: [['*', 90, 6]] } },
  lateral: { pr: [],
    A: { c: [80, 18], l: [[80, 26, 80, 62], [80, 62, 72, 104], [80, 62, 88, 104], [80, 30, 72, 46, 70, 62], [80, 30, 88, 46, 90, 62]], w: [['*', 70, 64], ['*', 90, 64]] },
    B: { c: [80, 18], l: [[80, 26, 80, 62], [80, 62, 72, 104], [80, 62, 88, 104], [80, 30, 62, 32, 46, 34], [80, 30, 98, 32, 114, 34]], w: [['*', 44, 34], ['*', 116, 34]] } },
  inversoCurvado: { pr: [],
    A: { c: [112, 40], l: [[104, 45, 66, 56], [66, 56, 64, 80, 62, 104], [100, 47, 100, 63, 100, 78]], w: [['*', 100, 80]] },
    B: { c: [112, 40], l: [[104, 45, 66, 56], [66, 56, 64, 80, 62, 104], [100, 47, 90, 42, 80, 40]], w: [['*', 78, 40]] } },
  facePull: { pr: [['l', 140, 10, 140, 104, 4]],
    A: { c: [70, 18], l: [[70, 26, 70, 62], [70, 62, 66, 104], [70, 62, 76, 104], [70, 32, 90, 34, 110, 34]], w: [['punho', 110, 34]], k: [[110, 34, 140, 30]] },
    B: { c: [70, 18], l: [[70, 26, 70, 62], [70, 62, 66, 104], [70, 62, 76, 104], [70, 32, 90, 26, 80, 20]], w: [['punho', 80, 20]], k: [[80, 20, 140, 30]] } },
  remadaCurvada: { pr: [],
    A: { c: [112, 40], l: [[104, 45, 66, 56], [66, 56, 64, 80, 62, 104], [100, 47, 100, 65, 100, 82]], w: [['*', 100, 84]] },
    B: { c: [112, 40], l: [[104, 45, 66, 56], [66, 56, 64, 80, 62, 104], [100, 47, 84, 40, 88, 58]], w: [['*', 88, 60]] } },
  remadaSentado: { pr: [['r', 40, 90, 40, 6], ['l', 118, 84, 120, 104, 4], ['l', 140, 60, 140, 104, 4]],
    A: { c: [58, 40], l: [[58, 48, 56, 88], [56, 88, 90, 80, 116, 94], [58, 52, 84, 60, 108, 64]], w: [['punho', 108, 64]], k: [[108, 64, 140, 70]] },
    B: { c: [58, 40], l: [[58, 48, 56, 88], [56, 88, 90, 80, 116, 94], [58, 52, 42, 62, 64, 66]], w: [['punho', 64, 66]], k: [[64, 66, 140, 70]] } },
  barraFixa: { pr: [['l', 56, 12, 132, 12, 4], ['l', 60, 12, 60, 104, 3], ['l', 128, 12, 128, 104, 3]],
    A: { c: [92, 36], l: [[92, 44, 92, 76], [92, 76, 86, 90, 90, 100], [92, 46, 94, 28, 94, 12]], w: [['punho', 94, 12]] },
    B: { c: [92, 4], l: [[92, 12, 92, 46], [92, 46, 86, 60, 90, 70], [92, 16, 80, 22, 94, 12]], w: [['punho', 94, 12]] } },
  puxada: { pr: [['r', 60, 78, 36, 6], ['l', 78, 84, 78, 104, 4], ['l', 90, 0, 90, 4, 3]],
    A: { c: [80, 40], l: [[80, 48, 78, 80], [78, 80, 100, 80, 100, 104], [80, 52, 86, 30, 88, 14]], w: [['punho', 88, 12]], k: [[88, 12, 90, 2]] },
    B: { c: [80, 40], l: [[80, 48, 78, 80], [78, 80, 100, 80, 100, 104], [80, 52, 70, 62, 84, 46]], w: [['punho', 84, 46]], k: [[84, 46, 90, 2]] } },
  rosca: { pr: [],
    A: { c: [80, 18], l: [[80, 26, 80, 62], ...EM_PE_PERNAS, [80, 30, 82, 46, 84, 62]], w: [['*', 84, 64]] },
    B: { c: [80, 18], l: [[80, 26, 80, 62], ...EM_PE_PERNAS, [80, 30, 82, 46, 94, 34]], w: [['*', 96, 32]] } },
  scott: { pr: [['l', 84, 42, 106, 60, 6], ['l', 96, 54, 96, 104, 4]],
    A: { c: [74, 24], l: [[74, 32, 72, 70], [72, 70, 56, 74, 56, 104], [74, 36, 90, 48, 106, 62]], w: [['*', 108, 64]] },
    B: { c: [74, 24], l: [[74, 32, 72, 70], [72, 70, 56, 74, 56, 104], [74, 36, 90, 48, 88, 28]], w: [['*', 88, 26]] } },
  pulley: { pr: [['l', 120, 6, 120, 104, 4]],
    A: { c: [80, 18], l: [[80, 26, 82, 62], [82, 62, 78, 104], [82, 62, 86, 104], [80, 30, 84, 46, 98, 40]], w: [['punho', 98, 40]], k: [[98, 40, 118, 10]] },
    B: { c: [80, 18], l: [[80, 26, 82, 62], [82, 62, 78, 104], [82, 62, 86, 104], [80, 30, 84, 46, 90, 62]], w: [['punho', 90, 62]], k: [[90, 62, 118, 10]] } },
  frances: { pr: [],
    A: { c: [80, 30], l: [[80, 38, 80, 72], [80, 72, 76, 104], [80, 72, 84, 104], [80, 42, 86, 22, 72, 30]], w: [['*', 70, 30]] },
    B: { c: [80, 30], l: [[80, 38, 80, 72], [80, 72, 76, 104], [80, 72, 84, 104], [80, 42, 84, 22, 86, 6]], w: [['*', 86, 4]] } },
  testa: { pr: BANCO,
    A: { c: [116, 57], l: [[108, 61, 62, 62], [62, 62, 42, 60, 36, 102], [100, 60, 100, 42, 100, 26]], w: [['*', 100, 24]] },
    B: { c: [116, 57], l: [[108, 61, 62, 62], [62, 62, 42, 60, 36, 102], [100, 60, 104, 40, 118, 46]], w: [['*', 120, 46]] } },
  mergulho: { pr: [['l', 58, 50, 112, 50, 4], ['l', 62, 50, 62, 104, 3], ['l', 108, 50, 108, 104, 3]],
    A: { c: [84, 18], l: [[84, 26, 84, 58], [84, 58, 80, 74, 88, 86], [84, 30, 84, 40, 84, 50]], w: [['punho', 84, 50]] },
    B: { c: [84, 36], l: [[84, 44, 84, 76], [84, 76, 80, 90, 88, 100], [84, 48, 70, 44, 84, 50]], w: [['punho', 84, 50]] } },
  agachamento: { pr: [],
    A: { c: [84, 14], l: [[80, 24, 80, 58], [80, 58, 82, 80, 80, 104], [80, 28, 90, 36, 76, 30]], w: [['*', 72, 28]] },
    B: { c: [94, 38], l: [[88, 48, 70, 74], [70, 74, 96, 80, 82, 104], [88, 50, 98, 58, 84, 54]], w: [['*', 80, 51]] } },
  legPress: { pr: [['l', 28, 98, 58, 68, 7], ['l', 40, 98, 40, 104, 4]],
    A: { c: [46, 60], l: [[52, 68, 66, 90], [66, 90, 90, 62, 104, 52]], w: [], x: [[98, 42, 114, 62]] },
    B: { c: [46, 60], l: [[52, 68, 66, 90], [66, 90, 98, 70, 120, 46]], w: [], x: [[114, 34, 130, 54]] } },
  afundo: { pr: [],
    A: { c: [80, 16], l: [[80, 24, 80, 58], [80, 58, 92, 80, 94, 104], [80, 58, 66, 80, 56, 104], [80, 28, 82, 44, 82, 60]], w: [['*', 82, 62]] },
    B: { c: [80, 32], l: [[80, 40, 80, 74], [80, 74, 100, 76, 98, 104], [80, 74, 66, 96, 52, 104], [80, 44, 82, 60, 82, 76]], w: [['*', 82, 78]] } },
  bulgaro: { pr: [['r', 26, 78, 30, 6], ['l', 40, 84, 40, 104, 4]],
    A: { c: [84, 16], l: [[84, 24, 84, 58], [84, 58, 96, 80, 98, 104], [84, 58, 64, 72, 46, 78], [84, 28, 86, 44, 86, 60]], w: [['*', 86, 62]] },
    B: { c: [84, 32], l: [[84, 40, 84, 74], [84, 74, 104, 78, 100, 104], [84, 74, 64, 92, 46, 78], [84, 44, 86, 60, 86, 76]], w: [['*', 86, 78]] } },
  extensora: { pr: [['r', 56, 72, 44, 6], ['l', 58, 72, 62, 30, 5], ['l', 78, 78, 78, 104, 4]],
    A: { c: [70, 24], l: [[70, 32, 72, 70], [72, 70, 96, 70, 98, 98]], w: [['rolo', 98, 96]] },
    B: { c: [70, 24], l: [[70, 32, 72, 70], [72, 70, 96, 70, 122, 62]], w: [['rolo', 122, 62]] } },
  flexora: { pr: [['r', 30, 66, 92, 7], ['l', 40, 73, 40, 104, 4], ['l', 112, 73, 112, 104, 4]],
    A: { c: [40, 56], l: [[46, 61, 84, 62], [84, 62, 108, 62, 132, 62]], w: [['rolo', 132, 57]] },
    B: { c: [40, 56], l: [[46, 61, 84, 62], [84, 62, 108, 62, 104, 38]], w: [['rolo', 104, 35]] } },
  stiff: { pr: [],
    A: { c: [80, 16], l: [[80, 24, 80, 58], [80, 58, 82, 80, 80, 104], [80, 28, 82, 44, 82, 60]], w: [['*', 82, 62]] },
    B: { c: [112, 40], l: [[104, 46, 72, 58], [72, 58, 76, 80, 74, 104], [102, 48, 102, 64, 100, 82]], w: [['*', 100, 84]] } },
  pelvica: { pr: [['r', 18, 56, 34, 8], ['l', 34, 64, 34, 104, 4]],
    A: { c: [42, 48], l: [[48, 56, 80, 84], [80, 84, 104, 76, 108, 104], [50, 60, 66, 72, 78, 78]], w: [['*', 80, 78]] },
    B: { c: [42, 48], l: [[48, 56, 86, 58], [86, 58, 108, 72, 110, 104], [50, 60, 68, 58, 84, 54]], w: [['*', 86, 52]] } },
  panturrilha: { pr: [['r', 84, 98, 34, 6]],
    A: { c: [88, 16], l: [[88, 24, 88, 58], [88, 58, 90, 80, 92, 98], [92, 98, 108, 98], [88, 28, 90, 44, 90, 58]], w: [['*', 90, 60]] },
    B: { c: [88, 6], l: [[88, 14, 88, 48], [88, 48, 90, 70, 94, 88], [94, 88, 108, 98], [88, 18, 90, 34, 90, 48]], w: [['*', 90, 50]] } },
  panturrilhaSentado: { pr: [['r', 46, 66, 40, 6], ['l', 60, 72, 60, 104, 4], ['r', 96, 98, 30, 6]],
    A: { c: [64, 22], l: [[64, 30, 66, 66], [66, 66, 98, 64, 100, 98], [100, 98, 116, 98]], w: [['rolo', 96, 60]] },
    B: { c: [64, 18], l: [[64, 26, 66, 62], [66, 62, 98, 58, 102, 88], [102, 88, 116, 98]], w: [['rolo', 96, 54]] } },
  abdominal: { pr: [],
    A: { c: [124, 92], l: [[116, 96, 72, 98], [72, 98, 56, 80, 40, 102], [114, 94, 120, 84, 126, 86]], w: [] },
    B: { c: [106, 72], l: [[100, 79, 72, 98], [72, 98, 56, 80, 40, 102], [100, 81, 106, 70, 110, 68]], w: [] } },
  elevacaoPernas: { pr: [['l', 56, 12, 132, 12, 4], ['l', 60, 12, 60, 104, 3], ['l', 128, 12, 128, 104, 3]],
    A: { c: [92, 36], l: [[92, 44, 92, 76], [92, 76, 92, 92, 92, 104], [92, 46, 94, 28, 94, 12]], w: [['punho', 94, 12]] },
    B: { c: [92, 36], l: [[92, 44, 92, 76], [92, 76, 112, 72, 128, 70], [92, 46, 94, 28, 94, 12]], w: [['punho', 94, 12]] } },
};

/* exercício → desenho, peso, músculos (p = principal, s = secundários) e execução */
const FICHAS = {
  'supino-reto':           { d: 'supino', peso: 'barra', pad: 'Composto · empurrar horizontal', p: ['peito'], s: ['triceps', 'ombro'], dicas: ['Escápulas encaixadas e pés firmes no chão.', 'Desça controlando até a barra tocar o meio do peito.', 'Empurre até estender os braços sem tirar os ombros do banco.'] },
  'supino-reto-halteres':  { d: 'supino', peso: 'halter', pad: 'Composto · empurrar horizontal', p: ['peito'], s: ['triceps', 'ombro'], dicas: ['Halteres alinhados com o meio do peito.', 'Desça até sentir o alongamento do peito, cotovelos a ~45° do tronco.', 'Suba aproximando os halteres sem bater.'] },
  'supino-inclinado':      { d: 'inclinado', peso: 'halter', pad: 'Composto · empurrar inclinado', p: ['peito'], s: ['ombro', 'triceps'], dicas: ['Banco entre 30° e 45°.', 'Desça os halteres até a linha do peito superior.', 'Empurre para cima e levemente para dentro.'] },
  'supino-inclinado-barra':{ d: 'inclinado', peso: 'barra', pad: 'Composto · empurrar inclinado', p: ['peito'], s: ['ombro', 'triceps'], dicas: ['Banco entre 30° e 45°.', 'A barra desce até a parte alta do peito.', 'Mantenha as escápulas encaixadas durante todo o movimento.'] },
  'voador':                { d: 'voador', peso: 'punho', pad: 'Isolado · adução horizontal', p: ['peito'], s: ['ombro'], dicas: ['Ajuste o banco para as pegadas ficarem na altura do peito.', 'Cotovelos levemente flexionados e fixos.', 'Feche até as mãos quase se tocarem e volte devagar.'] },
  'crucifixo-halteres':    { d: 'crucifixo', peso: 'halter', pad: 'Isolado · adução horizontal', p: ['peito'], s: ['ombro'], dicas: ['Cotovelos levemente dobrados, como se abraçasse uma árvore.', 'Abra até sentir o peito alongar, sem forçar o ombro.', 'Feche pelo peito, não pelos braços.'] },
  'barra-fixa':            { d: 'barraFixa', peso: 'punho', pad: 'Composto · puxar vertical', p: ['costas'], s: ['biceps'], dicas: ['Pegada um pouco mais larga que os ombros.', 'Puxe levando os cotovelos para baixo e para trás.', 'Desça até estender os braços, sem balançar.'] },
  'puxada-alta':           { d: 'puxada', peso: 'punho', pad: 'Composto · puxar vertical', p: ['costas'], s: ['biceps'], dicas: ['Coxas presas no apoio, tronco levemente inclinado para trás.', 'Puxe a barra até a parte alta do peito.', 'Volte controlando até alongar as costas.'] },
  'remada':                { d: 'remadaCurvada', peso: 'barra', pad: 'Composto · puxar horizontal', p: ['costas'], s: ['biceps', 'ombro'], dicas: ['Tronco inclinado à frente, coluna neutra.', 'Puxe em direção ao umbigo, cotovelos rentes ao corpo.', 'Desça até estender os braços sem arredondar as costas.'] },
  'remada-maquina':        { d: 'remadaSentado', peso: 'punho', pad: 'Composto · puxar horizontal', p: ['costas'], s: ['biceps', 'ombro'], dicas: ['Peito apoiado ou tronco firme.', 'Puxe abrindo os cotovelos e juntando as escápulas.', 'Volte devagar até alongar.'] },
  'remada-baixa':          { d: 'remadaSentado', peso: 'punho', pad: 'Composto · puxar horizontal', p: ['costas'], s: ['biceps'], dicas: ['Joelhos levemente dobrados, tronco ereto.', 'Puxe o triângulo até o abdômen.', 'Não balance o tronco para ajudar.'] },
  'desenvolvimento':       { d: 'desenvolvimento', peso: 'halter', pad: 'Composto · empurrar vertical', p: ['ombro'], s: ['triceps'], dicas: ['Costas apoiadas, halteres na altura das orelhas.', 'Empurre até quase estender os braços.', 'Desça controlando até a altura inicial.'] },
  'desenvolvimento-maquina':{ d: 'desenvolvimento', peso: 'punho', pad: 'Composto · empurrar vertical', p: ['ombro'], s: ['triceps'], dicas: ['Ajuste o banco para as pegadas ficarem na altura dos ombros.', 'Empurre sem tirar as costas do encosto.', 'Desça até a altura das orelhas.'] },
  'elevacao-lateral':      { d: 'lateral', peso: 'halter', pad: 'Isolado · abdução de ombro', p: ['ombro'], s: [], dicas: ['Cotovelos levemente dobrados.', 'Suba até a linha dos ombros, liderando com os cotovelos.', 'Desça devagar, sem balançar o corpo.'] },
  'elevacao-lateral-polia':{ d: 'lateral', peso: 'punho', pad: 'Isolado · abdução de ombro', p: ['ombro'], s: [], dicas: ['Cabo saindo da polia baixa, do lado oposto.', 'Suba até a linha do ombro.', 'A polia mantém tensão também no início do movimento.'] },
  'crucifixo-inverso':     { d: 'inversoCurvado', peso: 'halter', pad: 'Isolado · ombro posterior', p: ['ombro'], s: ['costas'], dicas: ['Tronco inclinado, coluna neutra.', 'Abra os braços para os lados com cotovelos levemente dobrados.', 'Pense em levar as mãos para longe, não para cima.'] },
  'face-pull':             { d: 'facePull', peso: 'punho', pad: 'Isolado · ombro posterior', p: ['ombro'], s: ['costas'], dicas: ['Corda na altura do rosto.', 'Puxe em direção à testa abrindo os cotovelos.', 'Gire os punhos para fora no final.'] },
  'rosca-direta':          { d: 'rosca', peso: 'barra', pad: 'Isolado · flexão de cotovelo', p: ['biceps'], s: [], dicas: ['Cotovelos fixos ao lado do corpo.', 'Suba sem jogar o tronco para trás.', 'Desça até estender totalmente os braços.'] },
  'rosca-martelo':         { d: 'rosca', peso: 'halter', pad: 'Isolado · flexão de cotovelo', p: ['biceps'], s: [], dicas: ['Pegada neutra, palmas viradas uma para a outra.', 'Cotovelos fixos.', 'Suba e desça controlando, sem balanço.'] },
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
  'elevacao-pernas':       { d: 'elevacaoPernas', peso: 'punho', pad: 'Isolado · flexão de quadril', p: ['core'], s: [], dicas: ['Pendurado na barra, sem balançar.', 'Suba as pernas até a altura do quadril ou mais.', 'Desça devagar.'] },
};

function desenhoPose(id, quadro){
  const f = FICHAS[id]; const T = f && POSES[f.d]; if(!T) return '';
  const P = T[quadro];
  const props = T.pr.concat((P.x || []).map(l => ['l', ...l, 5])).map(p => p[0] === 'r'
    ? `<rect class="pr-f" x="${p[1]}" y="${p[2]}" width="${p[3]}" height="${p[4]}" rx="3"/>`
    : `<line class="pr-l" x1="${p[1]}" y1="${p[2]}" x2="${p[3]}" y2="${p[4]}" stroke-width="${p[5] || 4}"/>`).join('');
  const cabos = (P.k || []).map(k => `<line class="cabo" x1="${k[0]}" y1="${k[1]}" x2="${k[2]}" y2="${k[3]}"/>`).join('');
  const corpo = P.l.map((l, i) => `<polyline class="tk${i === 0 ? ' tronco' : ''}" points="${l.join(' ')}"/>`).join('');
  const pesos = P.w.map(([t, x, y]) => {
    const tipo = t === '*' ? f.peso : t;
    if(tipo === 'barra') return `<circle class="peso" cx="${x}" cy="${y}" r="11"/><circle class="peso-c" cx="${x}" cy="${y}" r="2.5"/>`;
    if(tipo === 'halter') return `<circle class="peso" cx="${x}" cy="${y}" r="6.5"/>`;
    if(tipo === 'rolo') return `<circle class="peso" cx="${x}" cy="${y}" r="6"/>`;
    if(tipo === 'punho') return `<circle class="peso-c" cx="${x}" cy="${y}" r="3.5"/>`;
    return '';
  }).join('');
  const rot = quadro === 'A' ? 'posição inicial' : 'posição final';
  return `<svg class="pose" viewBox="0 0 160 120" role="img" aria-label="${esc(nomeEx(id))}: ${rot}">
    <line class="chao" x1="10" y1="104" x2="150" y2="104"/>${props}${cabos}${corpo}<circle class="cab" cx="${P.c[0]}" cy="${P.c[1]}" r="7"/>${pesos}</svg>`;
}

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

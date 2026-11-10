# TreinoHoje

Caderno de treino pessoal: escolha o treino do dia, registre cargas e repetições, acompanhe metas e evolução. Funciona no celular (instalável como app) e no navegador do PC, inclusive sem internet.

**Acesse:** https://espmikael.github.io/TreinoHoje

---

## O que ele faz

- **Treino do dia** — você escolhe o treino (A, B, C… ou corrida) e registra cada série. O ✓ repete a carga e as reps da última vez com um toque (para desfazer, apague as reps); exercícios concluídos encolhem.
- **Ajustes do dia** — troque um exercício (aparelho ocupado), adicione séries com o + do card ou exercícios com o + no fim da lista. Vale só para o dia, a menos que você toque em *Salvar no plano*.
- **Cardio** — bike, esteira, elíptico, escada, remo e corda são registrados por tempo (min) e distância opcional (km). A corrida tem aba própria, com pace.
- **Treino esquecido** — se você não tocar em Concluir, o treino vai sozinho para o Histórico no dia seguinte.
- **Fichas dos exercícios** — o (i) abre ilustrações de início e fim do movimento, músculos trabalhados e dicas de execução.
- **Planos** — editor de planos, gerador automático (por dias, tempo e tipo de academia) e troca de exercício só no dia, quando o aparelho está ocupado.
- **Metas** — frequência semanal, carga-alvo e km de corrida, todas opcionais. Inclui "semana leve" para semanas de prova ou entrega.
- **Semana e mês** — calendário, sequência de semanas na meta e séries por grupo muscular.
- **Histórico** — força estimada por exercício e registros por mês, com previsto × feito.
- **Análise com IA** — exporta um resumo em texto da semana ou do mês (previsto × feito, cargas, volume, corrida) pronto para colar em qualquer IA.
- **Compartilhar** — gera uma imagem do treino no formato de story.
- **Tema** — escuro (padrão), claro ou automático.

## Método

O app segue uma linha baseada em evidências, com poucas séries bem executadas:

- **2–3 séries de trabalho** por exercício, levadas até **1–2 repetições da falha**.
- **Progressão dupla:** ao completar o topo da faixa de repetições em todas as séries, sobe a carga e volta ao início da faixa.
- **Volume semanal por músculo** com faixa de referência de 10–20 séries (Schoenfeld, Ogborn & Krieger, 2017). Músculos secundários contam meia série.
- **Força estimada (1RM)** pela fórmula de Epley: `carga × (1 + reps / 30)`, para comparar séries com repetições diferentes.

## Instalar no celular

- **iPhone:** abra no Safari → Compartilhar → *Adicionar à Tela de Início*.
- **Android:** abra no Chrome → menu ⋮ → *Instalar app*.

Instalado, ele abre em tela cheia, funciona offline e mantém a tela acesa durante o treino.

## Privacidade e dados

Tudo fica salvo primeiro **no seu aparelho** (armazenamento do navegador), e o app funciona sem conta e sem internet.

**Sincronizar (opcional):** em Plano → Ajustes dá pra entrar com uma conta do Supabase. Aí os registros, planos e metas ganham backup na nuvem e aparecem também no PC. O treino em andamento e as escolhas do dia ficam só no aparelho. Sem internet, o app guarda tudo e sincroniza quando a conexão volta. Os dados ficam na tabela `treinohoje`, protegida para que cada conta só leia e grave a própria linha. Não há rastreamento nem anúncios.

Por isso, use **Plano → Ajustes → Exportar backup** de vez em quando, principalmente antes de trocar de celular. O app lembra você se o último backup tiver mais de 30 dias.

## Estrutura do projeto

```
index.html          estrutura da página
nuvem.js            sincronização opcional com o Supabase
estilo.css          visual (cores, tipografia, layout)
app.js              lógica do app
exercicios.js       biblioteca de exercícios, fichas e ilustrações
sw.js               funcionamento offline
manifest.webmanifest  dados do app instalável
icon.svg / icon-*.png ícones
```

Site estático, sem build e sem dependências: HTML, CSS e JavaScript puros.

## Como atualizar

1. Edite os arquivos e suba no repositório.
2. Em `sw.js`, aumente o número em `CACHE` (ex.: `treinohoje-v10` → `treinohoje-v11`). Sem isso, quem já tem o app instalado pode continuar vendo a versão antiga.
3. O app instalado mostra o aviso **"Nova versão disponível · Atualizar"**.

### Adicionar um exercício

Em `exercicios.js`:

1. Inclua o exercício em `BIB` (nome, grupo muscular, faixa de reps).
2. Para ter ficha, inclua em `FICHAS` (músculos, dicas) e aponte para um desenho existente em `POSES`.

## Créditos

- Ilustrações (silhuetas sem rosto, de lado e de frente) e ícone: próprios.
- Fonte: a do sistema (SF Pro no iPhone e no Mac, Roboto no Android, Segoe UI no Windows). Nada é baixado de fora.

---

Projeto pessoal de [Mikael Espindola](https://github.com/espmikael).

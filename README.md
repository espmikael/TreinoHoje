# TreinoHoje

Caderno de treino pessoal: escolha o treino do dia, registre cargas e repetições, acompanhe metas e evolução. Funciona no celular (instalável como app) e no navegador do PC, inclusive sem internet.

**Acesse:** https://espmikael.github.io/TreinoHoje

---

## O que ele faz

- **Treino do dia** — você escolhe o treino (A, B, C… ou corrida) e registra cada série. O ✓ repete a carga e as reps da última vez com um toque; exercícios concluídos encolhem.
- **Fichas dos exercícios** — o (i) abre ilustrações de início e fim do movimento, músculos trabalhados e dicas de execução.
- **Planos** — editor de planos, gerador automático (por dias, tempo e tipo de academia) e troca de exercício só no dia, quando o aparelho está ocupado.
- **Metas** — frequência semanal, carga-alvo e km de corrida, todas opcionais. Inclui "semana leve" para semanas de prova ou entrega.
- **Semana e mês** — calendário, sequência de semanas na meta e séries por grupo muscular.
- **Histórico** — força estimada por exercício, treinos por semana e lista de registros.
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

Tudo fica salvo **só no seu aparelho** (armazenamento do navegador). Não há conta, servidor nem rastreamento.

Por isso, use **Plano → Ajustes → Exportar backup** de vez em quando, principalmente antes de trocar de celular. O app lembra você se o último backup tiver mais de 30 dias.

## Estrutura do projeto

```
index.html          estrutura da página
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

- Ilustrações e ícone: próprios.
- Fontes: [Big Shoulders Display](https://fonts.google.com/specimen/Big+Shoulders+Display), [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) e [Inter](https://fonts.google.com/specimen/Inter), via Google Fonts.

---

Projeto pessoal de [Mikael Espindola](https://github.com/espmikael).

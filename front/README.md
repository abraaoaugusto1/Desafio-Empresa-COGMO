# Desafio Frontend: página de monitoramento

**Guia amigável em PDF:** [DESAFIO_FRONTEND_COGMO.pdf](DESAFIO_FRONTEND_COGMO.pdf) — leia antes de começar; ele explica a missão, os passos e os termos do desafio.

**Proponente:** Cogmo Technology  
**Público:** alunos em formação, nível júnior  
**Tempo sugerido:** 16 a 24 horas, distribuídas em até 10 dias úteis  
**Tecnologias de referência:** React, TypeScript, CSS e Recharts

## Contexto

A Cogmo Technology propõe que você monte uma página simples para acompanhar nível de rio e chuva em algumas estações. O exercício trabalha composição visual, estado, acessibilidade básica e consumo de uma API.

O starter inclui uma interface incompleta, tipos do contrato, um mock que roda sem servidor e uma chave de configuração para simular situações de carregamento, falha e ausência de pontos. Os dados e as estações são inventados para a atividade; não indicam condições reais.

## O que você vai construir

Uma página de visão geral com seletor de estação, leituras mais recentes, histórico de nível e chuva em gráficos separados, data da última observação e estados de carregamento, erro e série vazia.

O mock usa o mesmo contrato que a trilha backend: [docs/CONTRATO_API.md](docs/CONTRATO_API.md). Comece usando o mock; conectar uma API real é uma etapa de integração ao fim.

## Requisitos essenciais

1. Seletor de estação com nome, rio e município.
2. Resumo das leituras mais recentes de nível (m) e chuva (mm/h).
3. Seletor de métrica: um gráfico para nível e outro para chuva, cada qual com sua unidade.
4. Janela de consulta de 24 horas; como extensão simples, permita trocar entre 12, 24 e 48 horas.
5. Rótulos legíveis no gráfico, tooltip e distinção visual de nível e chuva.
6. Mostrar que os dados são simulados e exibir horário/fuso sem apresentar o valor como atual do mundo real.
7. Estado de carregamento, erro com ação de tentar novamente, e estado vazio.
8. Layout que funcione em celular e computador; controles utilizáveis por teclado e com rótulos acessíveis.
9. Formatação adequada para português do Brasil; mantenha o valor e a unidade coerentes.

Você pode reorganizar os componentes. A prioridade é uma página que funcione e deixe o dado fácil de interpretar.

## Como começar

Requisitos: Node.js 20 ou superior e npm.

~~~powershell
cd front
Copy-Item .env.example .env.local
npm install
npm run dev
~~~

Abra http://localhost:5173. O mock local é o modo inicial; não é necessária chave de API. Use o guia de [harness/CENARIOS.md](harness/CENARIOS.md) para explorar respostas normais, carregamento lento, erro e vazio.

Quando a equipe backend entregar as rotas, escolha VITE_API_MODE=real em .env.local, informe VITE_API_URL e confira que a resposta segue o contrato. Nunca inclua token ou senha no código do navegador.

## Plano sugerido

- **Etapa 1 (3-4 h):** executar o starter e desenhar a hierarquia da tela.
- **Etapa 2 (4-6 h):** criar seletor, cartões de resumo e navegação entre nível e chuva.
- **Etapa 3 (4-5 h):** desenhar o gráfico com Recharts e a janela histórica.
- **Etapa 4 (3-5 h):** tratar loading, erro e vazio; melhorar responsividade e acessibilidade.
- **Etapa 5 (2-4 h):** integrar com a API ou demonstrar com o mock e apresentar escolhas.

## Pronto para a entrega quando

- É possível selecionar estação e métrica.
- As leituras mais recentes acompanham a estação selecionada.
- Nível e chuva aparecem em gráficos separados, com unidade e horário.
- Carregamento, erro, vazio e recuperação podem ser vistos sem editar o código.
- O conteúdo se ajusta a tela pequena e é utilizável sem mouse.
- O usuário sempre percebe que a amostra é simulada.

## O que entregar

1. Código executável e README atualizado.
2. Breve anotação do wireframe ou das escolhas de interface.
3. Demonstração das quatro situações: normal, espera, erro, vazio.
4. Uma explicação curta: decisão de usabilidade, dificuldade e próxima melhoria.

### Critérios de avaliação (100 pontos)

- **Fluxo e dados - 25:** seleção, resumo, série e atualização corretos.
- **Estados e recuperação - 20:** carregando, erro, tentar novamente e vazio.
- **Visualização e unidades - 20:** gráficos claros, rótulos, horário e eixos separados.
- **UX, responsividade e acessibilidade - 20:** hierarquia, legibilidade, teclado e telas pequenas.
- **Organização e apresentação - 15:** componentes, instruções e explicação das escolhas.

Uma página pequena, consistente e fácil de entender vale mais que animações ou funções extras.

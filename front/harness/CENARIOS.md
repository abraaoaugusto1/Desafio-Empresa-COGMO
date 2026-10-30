# Cenários locais do mock

A aplicação não precisa da trilha backend para iniciar. O mock oferece a mesma forma de dados e algumas situações que ajudam a conferir estados da tela.

No arquivo .env.local, ajuste:

~~~dotenv
VITE_API_MODE=mock
VITE_DEMO_CENARIO=normal
VITE_API_URL=http://localhost:3000
~~~

Valores de VITE_DEMO_CENARIO:

- normal: pequeno atraso e 72 horas de amostra.
- slow: atraso mais longo para perceber o indicador de carregamento.
- error: uma consulta falha; a ação tentar novamente funciona em seguida.
- empty: retorna uma série sem pontos para testar a mensagem de estado vazio.

Após alterar .env.local, reinicie o servidor Vite. O modo real usa VITE_API_MODE=real e VITE_API_URL; nesse modo, confirme CORS e o contrato com a equipe backend. Não coloque credenciais em .env.local nem no JavaScript entregue ao navegador.

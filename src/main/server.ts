// src/main/server.ts
import 'dotenv/config'; // precisa vir primeiro: carrega o .env antes de qualquer outro módulo
import { app } from './app';

const PORT = Number(process.env.PORT ?? 3333);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 Documentação em http://localhost:${PORT}/api/docs`);
});

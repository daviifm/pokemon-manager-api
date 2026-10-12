"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/main/server.ts
require("dotenv/config"); // precisa vir primeiro: carrega o .env antes de qualquer outro módulo
const app_1 = require("./app");
const PORT = Number(process.env.PORT ?? 3333);
app_1.app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📚 Documentação em http://localhost:${PORT}/api/docs`);
});

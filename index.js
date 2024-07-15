// index.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const logFilePath = path.join(__dirname, 'logs.txt');

// Middleware para parsear JSON
app.use(bodyParser.json());

// Rota para receber logs
app.post('/logs', (req, res) => {
    const { key, code, time, url } = req.body;
    const logEntry = `${time} - ${key} (${code}) - ${url}\n`;

    // Adiciona a entrada de log ao arquivo
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Erro ao escrever no arquivo de log:', err);
            res.status(500).send('Erro ao salvar log');
        } else {
            res.status(200).send('Log salvo');
        }
    });
});

// Rota para salvar logs em um arquivo TXT (opcional)
app.post('/saveLogs', (req, res) => {
    const logFile = fs.readFileSync(logFilePath, 'utf-8');
    res.setHeader('Content-disposition', 'attachment; filename=logs.txt');
    res.setHeader('Content-type', 'text/plain');
    res.send(logFile);
});

// Rota para limpar logs (opcional)
app.post('/clearLogs', (req, res) => {
    fs.truncate(logFilePath, 0, (err) => {
        if (err) {
            console.error('Erro ao limpar o arquivo de log:', err);
            res.status(500).send('Erro ao limpar logs');
        } else {
            res.status(200).send('Logs limpos!');
        }
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`);
});
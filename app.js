const express = require('express');
const app = express();
const morgan = require('morgan');
const connectAllDb = require('./connection/connectionManager').connectAllDb;
const connectionResolver = require('./connection/connectionResolver');

// Definindo configurações do app
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

connectAllDb();

app.use(connectionResolver.resolve);

//DECLARAÇÃO DAS ROTAS
const items = require('./items');

//INICIALIZAÇÃO DAS ROTAS
app.get('/items', items.getAll);

app.get('/', (req, res, next) => {
    res.json({ body: 'Hello multi-tenant application.' });
});

//Tratamento de erro: rota não encontrada
app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

// Configurações dos acessos 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); //Se for filtrar os acessos, 
    res.header(                                     //trocar o '*' pela url permitida
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
})

module.exports = app;
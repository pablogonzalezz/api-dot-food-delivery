const express = require('express');
const app = express();
const morgan = require('morgan');
const connectAllDb = require('./connection/connectionManager').connectAllDb;
const connectionResolver = require('./connection/connectionResolver');
const cors = require('cors');

// Definindo configurações do app
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

connectAllDb();

app.use(connectionResolver.resolve);

//DECLARAÇÃO DAS ROTAS
const rotaItems = require('./routes/items');
const rotaItemGroup = require('./routes/item_group');

//INICIALIZAÇÃO DAS ROTAS
app.use('/items', rotaItems);
app.use('/item_group', rotaItemGroup);

app.get('/', (req, res, next) => {
    res.status(200).json({msg: 'The Application in running'})
});

//Tratamento de erro: rota não encontrada
app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

// Configurações dos acessos 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

module.exports = app;
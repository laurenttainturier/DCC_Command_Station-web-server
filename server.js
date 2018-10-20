const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const db = require('./config/db');
const Serial = require('./serial/serial.js');

const app = express();

const port = 8080;

const serial = new Serial();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

MongoClient.connect(db.url, {useNewUrlParser: true}, (err, database) => {
    if (err) return console.log("error:" + err.message);
    const db = database.db('db_train_controller');
    require('./app/routes')(app, db);
});

app.listen(port, () => {
    console.log('Server is running on port: ' + port);
});

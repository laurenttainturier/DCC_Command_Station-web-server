const serial = require('../../serial/serial.js');
const ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {

    // emit a correct dcc packet with an <address> and a <command>
    app.get('/dcc/packet', (req, res) => {
        const address = req.query.address;
        const command = req.query.command;

        serial.write(address + " " + command + "\r\n");
        res.send("<p> Packet emitted:<br/>address: " + address + "<br/>command: " + command + "</p>");
    });

    // create a new railway vehicle, with or without a decoder
    app.post('/fleet', (req, res) => {
        db.collection('railway_fleet').insertOne(req.body, (err, result) => {
            if (err) {
                console.log("error", err);
            }
            else {
                res.send(result.ops[0]);
            }
        });
    });

    // get a railway vehicle by searching its id
    app.get('/fleet/:id', (req, res) => {
        const id = req.params.id;
        console.log(id);
        const details = {'_id': new ObjectID(id)};
        db.collection('railway_fleet').findOne(details, (err, item) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            }
            else {
                res.contentType('application/json');
                res.json(item);
            }
        });
    });

    // get all the railway fleet
    app.get('/fleet', (req, res) => {
        let fleet = [];
        db.collection('railway_fleet').find({})
            .forEach((engine) => {
                fleet.push(engine);
            }, function () {
                res.json(fleet);
            })
    });

    // Update an engine
    app.put('/fleet/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        console.log(req.body);
        //res.send(req.body);
        db.collection('railway_fleet').updateOne(details, {$set: req.body}, (err, result) => {
            if (err) {
                console.log(err);
                res.send({'error': 'An error has occurred'});
            }
            else {
                res.send(result);
            }
        });
    });
};



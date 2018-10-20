const ObjectID = require('mongodb').ObjectID;

module.exports = function (app, db) {

    // Create a note
    app.post('/notes', (req, res) => {
        const note = {text: req.body.text, title: req.body.title};
        db.collection("notes").insertOne(note, function (err, result) {
            if (err) {
                res.send({"error": "An error has occurred"});
            }
            else {
                res.send(result.ops[0]);
            }
        });
    });

    // Read a note
    app.get('/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        db.collection('notes').findOne(details, (err, item) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            }
            else {
                res.send(item);
            }
        });
    });

    // Update a note
    app.put('/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        const note = {text: req.body.text, title: req.body.title};
        db.collection('notes').updateOne(details, {$set: note}, (err, result) => {
            if (err) {
                console.log(err);
                res.send({'error': 'An error has occurred'});
            }
            else {
                res.send(note);
            }
        });
    });

    // delete a note
    app.delete('/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        db.collection('notes').remove(details, (err, item) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            }
            else {
                res.send('Note ' + id + ' deleted!');
            }
        });
    });
};

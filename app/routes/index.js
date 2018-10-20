const noteRoutes = require('./note_routes');
const dccRoutes = require('./dcc_routes');

module.exports = function (app, db) {
    app.get("", (req, res) => {
        console.log("welcome home!");
        res.end("<p> Welcome to <b> Train Controller </b> website ! </p>")
    });
    noteRoutes(app, db);
    dccRoutes(app, db);
};

'use strict';
/**
 * Created by Nir Mekin on 5/10/2017.
 */
const   express     = require('express'),
        bodyParser  = require('body-parser'),
        app         = express(),
        songs       = require('./songs_mdl'),
        users       = require('./users_mdl'),
        mixes       = require('./mixes_mdl'),
        musicPlayer = require('./app/index'),
        port        = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var mPlayer = musicPlayer();

app.all('*', (req, res, next) => {
    console.log('==== Request received ====');
    req.next();
});

app.get('/getAllSongs', (req, res) => {
    mPlayer.getAllSongs().then((result) => {
        if (result.length !== 0) {
            console.log(`==========\n${result}\n Received successfully from the database!\n==========`);
            res.status(200).json(result);
        }
        else {
            console.log(`==========\nFailed to retrieve data\n==========`);
            res.status(200).json(`Failed to retrieve data`);
        }
    });
});

app.listen(port);
console.log(`listening on port ${port}`);



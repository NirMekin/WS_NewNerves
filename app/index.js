'use strict';

const mongoose = require('mongoose'),
      consts = require('../consts'),
      promise = require('promise'),
      Songs = require('../songs_mdl'),
      Mixes = require('../mixes_mdl'),
      Users = require('../users_mdl');

mongoose.connect(consts.MLAB_KEY);
var conn = mongoose.connection;

conn.on('error', (err) => {
    console.log(`connection error: ${err}`);
});

class MusicPlayer {
    getAllSongs() {
        return new Promise((resolve, reject) => {
            Songs.find({}, '-_id',
                (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
        });
    }

}

module.exports = () => {
    return new MusicPlayer()
};
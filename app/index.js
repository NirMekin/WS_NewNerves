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
    // SONGS Methods
    getAllSongs() {
        return new Promise((resolve, reject) => {
            Songs.find({}, '-_id',
                (err, result) => {
                    if (err) throw reject(err);
                    else{
                        if(result.length!=0) resolve(result)
                        else result({"Error":"No Songs were found"});
                    }
                });
        });
    }

    getSongsByTitle(_title) {
        return new Promise((resolve, reject) => {
            Songs.find({title:_title}, '-_id',
                (err, result) => {
                    if (err) throw reject(err);
                    else{
                        if(result.length!=0) resolve(result)
                        else result({"Error":"the specific Song was not found"});
                    }
                });
        });
    }

    getSongsByGenre(_genre) {
        return new Promise((resolve, reject) => {
            Songs.find({genre:_genre}, '-_id',
                (err, result) => {
                    if (err) throw reject(err);
                    else{
                        if(result.length!=0) resolve(result)
                        else result({"Error":"Genre doesn't exist"});
                    }
                });
        });
    }

    getSongsByArtist(_artist) {
        return new Promise((resolve, reject) => {
            Songs.find({artist:_artist}, '-_id',
                (err, result) => {
                    if (err) throw reject(err);
                    else{
                        if(result.length!=0) resolve(result)
                        else result({"Error":"Artist doesn't exist"});
                    }
                });
        });
    }

    // USERS Methods
    getAllUsers() {
        return new Promise((resolve, reject) => {
            Users.find({}, '-_id',
                (err, result) => {
                    if (err) throw reject(err);
                    else{
                        if(result.length!=0) resolve(result)
                        else result({"Error":"No Users were found"});
                    }
                });
        });
    }

    getUserByID(_id) {
        return new Promise((resolve, reject) => {
            Users.find({id:_id}, '-_id',
                (err, result) => {
                    if (err) throw reject(err);
                    else{
                        if(result.length!=0) resolve(result)
                        else result({"Error":"No Users were found"});
                    }
                });
        });
    }

    // MIXES Methods
    getAllMixes() {
        return new Promise((resolve, reject) => {
            Mixes.find({}, '-_id',
                (err, result) => {
                    if (err) throw reject(err);
                    else{
                        if(result.length!=0) resolve(result)
                        else result({"Error":"No Users were found"});
                    }
                });
        });
    }
    getMixesByUserID(_id){
        return new Promise((resolve, reject) => {
            Mixes.find({userid:_id}, '-_id',
                (err, result) => {
                    if (err) throw reject(err);
                    else{
                        if(result.length!=0) resolve(result)
                        else result({"Error":"No Users were found"});
                    }
                });
        });
    }
    getMixesByHashtags(_tag){
        return new Promise((resolve, reject) => {
            Mixes.find({hashtags:_tag}, '-_id',
                (err, result) => {
                    if (err) throw reject(err);
                    else{
                        if(result.length!=0) resolve(result)
                        else result({"Error":"No Users were found"});
                    }
                });
        });
    }

}

module.exports = () => {
    return new MusicPlayer()
};
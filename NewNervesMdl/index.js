'use strict';

const mongoose = require('mongoose'),
      consts = require('../consts'),
      promise = require('promise'),
      Songs = require('./songs_mdl'),
      Mixes = require('./mixes_mdl'),
      Users = require('./users_mdl');

// mongoose.connect(consts.MLAB_KEY);
mongoose.connect(consts.AWS_KEY);
var conn = mongoose.connection;


conn.on('error', (err) => {
    console.log(`connection error: ${err}`);
});

let lawgs = require('../node_modules/lawgs/index.js');


lawgs.config({
    aws: {
        accessKeyId: 'AKIAIHZGWNWVRHRJCMXA', /* Optional if credentials are set in ~/.aws/credentials */
        secretAccessKey: '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', /* Optional */
        region: 'us-west-2' /* Required */
    }
});

const logger  = lawgs.getOrCreate('NewNerves_WS'); /* LogGroup */


//Abstract Find query
function abstractFindModel(model,_query,errMsg){
    return new Promise((resolve, reject) => {
        model.find(_query ,'-_id',
            (err, result) => {
                if (err)  reject(err);
                else {
                    if(result.length !== 0) resolve(result);
                    else resolve(errMsg);
                }
            });
    });
}
//Abstract Insert Method
function abstractInsertModel(model) {
    return new Promise((resolve, reject) => {
            model.save((err) => {
                if (err) reject(err);
                else {
                    console.log(`Saved document: ${JSON.stringify(model)}`);
                    resolve({"Success":"Data was saved"});
                }
            });
    });
}
//Abstract Update Method
function abstractUpdateModel(model, conditions, update, opts) {
    return new Promise((resolve, reject) => {
        model.update(conditions, update, opts, (err, result) => {
            if (err) reject(err);
            else {
                console.log(`User with ID ${conditions.id}'s was successfully changed updated`);
                console.log(`\nResult message: ${result}`);
                resolve({"Success":"Data was updated"});
            }
        });
    });
}

class MusicPlayer {

    getAllSongs(){
        logger.log('NewNerves-stream', `getAllSongs Request`);
        return abstractFindModel(Songs,{},{"Error":"No Songs were found"});
    }

    getSongByID(_id) {
        logger.log('NewNerves-stream', `getSongByID Request`);
        return abstractFindModel(Songs,{id: _id},{"Error":"No Songs were found"});
    }

    getSongsByTitle(_title){
        logger.log('NewNerves-stream', `getSongsByTitle Request`);
        return abstractFindModel(Songs,{title:_title},{"Error":"the specific Song was not found"});
    }

    getSongsByGenre(_genre) {
        logger.log('NewNerves-stream', `getSongsByGenre Request`);
        return abstractFindModel(Songs,{genre:_genre},{"Error":"Genre doesn't exist"});
    }

    getSongsByArtist(_artist) {
        logger.log('NewNerves-stream', `getSongsByArtist Request`);
        return abstractFindModel(Songs,{artist:_artist},{"Error":"Artist doesn't exist"});
    }

    // USERS Methods
    getAllUsers() {
        logger.log('NewNerves-stream', `getAllUsers Request`);
        return abstractFindModel(Users,{},{"Error":"No Users were found"});
    }
    getUsersDetails(_username){
        logger.log('NewNerves-stream', `getUsersDetails Request`);
        // return abstractFindModel(Users,{username:_username},);
        return new Promise((resolve, reject) => {
            Users.find({username:_username} ,'-_id -userpassword',
                (err, result) => {
                    if (err)  reject(err);
                    else {
                        if(result.length !== 0) resolve(result);
                        else resolve({"Error":"Users was not found"});
                    }
                });
        });
    }

    getUserByIDAndPass(_username,_pass) {
        logger.log('NewNerves-stream', `getUserByIDAndPass Request`);
        return abstractFindModel(Users,{username:_username , userpassword:_pass},{"Error":"Users was not found"});
    }

    addNewUser(_username, _name, _profilepic,_address,_about,_pass) {
        let newUser = new Users({
            username: _username,
            name: _name,
            profilepic: _profilepic,
            about: _about,
            address: _address,
            userpassword: _pass
        });
        logger.log('NewNerves-stream', `addNewUser Request`);
        console.log(_username+_name+_profilepic+_address+_about+_pass);
        return abstractInsertModel(newUser);
    }

    updateUserName(_id, _name) {
        return new Promise((resolve, reject) => {
            try {
                    abstractFindModel(Users,{id :_id}, {"Error":"Users was not found"}).then((result) => {
                        if (result.hasOwnProperty(`Error`)) {
                            resolve ({"Error" : `No user with ${_id} was found`});
                        }
                        else {
                            let conditions = {id: _id},
                            update = {$set: {name: _name}},
                            opts = {multi: true};
                            logger.log('NewNerves-stream', `updateUserName Request`);
                            resolve(abstractUpdateModel(Users, conditions, update, opts));
                        }
                });
            }
            catch(error) {
                reject(error);
            }
        });

    }

    updateUserProfilePic(_id, _profilepic) {
        let conditions = {id: _id},
            update = {$set: {profilepic: _profilepic}},
            opts = {multi: true};
        logger.log('NewNerves-stream', `updateUserProfilePic Request`);
        return abstractUpdateModel(Users, conditions, update, opts);
    }

    // MIXES Methods
    getAllMixes() {
        logger.log('NewNerves-stream', `getAllMixes Request`);
        return abstractFindModel(Mixes,{},{"Error":"No Mixes were found"});
    }

    getMixesByUserID(_username){
        logger.log('NewNerves-stream', `getMixesByUserID Request`);
        return abstractFindModel(Mixes,{username:_username},{"Error":"No Mixes for user were found"});
    }

    getMixesByUsernameAndMixname(_username,_mixname){
        logger.log('NewNerves-stream', `getMixesByUsernameAndMixname Request`);
        return abstractFindModel(Mixes,{username:_username,mixname:_mixname},{"Error":"No Mixes for user were found"});
    }


    getMixesByHashtags(_tag){
        logger.log('NewNerves-stream', `getMixesByHashtags Request`);
        return abstractFindModel(Mixes,{hashtags:_tag},{"Error":"No Mixes with current hashtag were found"});
    }

    addNewMix(_username, _mixname,_mixcover) {
        let newMix = new Mixes({
            songs: [],
            username: _username,
            mixname: _mixname,
            mixcover:_mixcover,
            likes: 0,
            heard: 0,
            comments: [],
            hashtags: []
        });
        logger.log('NewNerves-stream', `addNewMix Request`);
        return abstractInsertModel(newMix);
    }


    addHashTagToMix(_username, _mixname, _hashtag) {
        logger.log('NewNerves-stream', `addHashTagToMix Request`);
        return new Promise((resolve, reject) => {
            try {
                abstractFindModel(Users,{username :_username}, {"Error":"Users was not found"}).then((result) => {
                    if (result.hasOwnProperty(`Error`)) {
                        resolve ({"Error" : `No user ${_username} was found`});
                    }
                    else {
                        let conditions = {username: _username, mixname: _mixname},
                            update = {$push: {hashtags: _hashtag}},
                            opts = {multi: true};
                        resolve(abstractUpdateModel(Mixes, conditions, update, opts));
                    }
                });
            }
            catch(error) {
                reject(error);
            }
        });
    }

    addCommentToMix(_userid, _mixid, _comment) {
        logger.log('NewNerves-stream', `addCommentToMix Request`);
        return new Promise((resolve, reject) => {
            try {
                abstractFindModel(Users,{id :_userid}, {"Error":"Users was not found"}).then((result) => {
                    if (result.hasOwnProperty(`Error`)) {
                        resolve ({"Error" : `No user with id ${_userid} was found`});
                    }
                    else {
                        let conditions = {userid: _userid, mixid: _mixid},
                            update = {$push: {comments: _comment}},
                            opts = {multi: true};
                        resolve(abstractUpdateModel(Mixes, conditions, update, opts));
                    }
                });
            }
            catch(error) {
                reject(error);
            }
        });
    }

    addSongToMix(_username, _mixname, _songid) {
        logger.log('NewNerves-stream', `addSongToMix Request`);
        return new Promise((resolve, reject) => {
            try {
                abstractFindModel(Users,{username :_username}, {"Error":"Users was not found"}).then((result) => {
                    if (result.hasOwnProperty(`Error`)) {
                        resolve ({"Error" : `No user with id  was found`});
                    }
                    else {
                        let conditions = {username: _username, mixname: _mixname},
                            update = {$push: {songs: _songid}},
                            opts = {multi: true};
                        resolve(abstractUpdateModel(Mixes, conditions, update, opts));
                    }
                });
            }
            catch(error) {
                reject(error);
            }
        });
    }

    incHeardFromMix(_username, _mixname, _heard) {
        logger.log('NewNerves-stream', `incHeardFromMix Request`);
        return new Promise((resolve, reject) => {
            try {
                let conditions = {username: _username, mixname: _mixname},
                    update = {$set: {heard: _heard}},
                    opts = {multi: true};
                resolve(abstractUpdateModel(Mixes, conditions, update, opts));
            }
            catch(error) {
                reject(error);
            }
        });
    }

}

module.exports = () => {
    return new MusicPlayer()
};
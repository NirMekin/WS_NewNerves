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

//Abstract Find query
function abstractFindModel(model,_query,errMsg){
    return new Promise((resolve, reject) => {
        model.find(_query ,'-_id',
            (err, result) => {
                if (err)  reject(err);
                else{
                    if(result.length!=0) resolve(result);
                    else resolve(errMsg);
                }
            });
    });
}
class MusicPlayer {

    getAllSongs(){
        return abstractFindModel(Songs,{},{"Error":"No Songs were found"});
    }

    getSongsByTitle(_title){
        return abstractFindModel(Songs,{title:_title},{"Error":"the specific Song was not found"});
    }

    getSongsByGenre(_genre) {
        return abstractFindModel(Songs,{genre:_genre},{"Error":"Genre doesn't exist"});
    }

    getSongsByArtist(_artist) {
        return abstractFindModel(Songs,{artist:_artist},{"Error":"Artist doesn't exist"});
    }

    // USERS Methods
    getAllUsers() {
        return abstractFindModel(Users,{},{"Error":"No Users were found"});
    }

    getUserByID(_id) {
        return abstractFindModel(Users,{id:_id},{"Error":"Users was not found"});
    }

    // MIXES Methods
    getAllMixes() {
        return abstractFindModel(Mixes,{},{"Error":"No Mixes were found"});
    }
    getMixesByUserID(_id){
        return abstractFindModel(Mixes,{userid:_id},{"Error":"No Mixes for user were found"});
    }

    getMixesByHashtags(_tag){
        return abstractFindModel(Mixes,{hashtags:_tag},{"Error":"No Mixes with current hashtag were found"});
    }

}

module.exports = () => {
    return new MusicPlayer()
};
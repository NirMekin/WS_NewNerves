/**
 * Created by Nir Mekin on 6/15/2017.
 */
var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    userSchema = new schema({
        name: {type: String, index: 1, required: true},
        username: {type: String, required: true , unique:true},
        profilepic: {type: String, index: 1},
        about:{type: String, required: true},
        address:{type: String, required: true},
        userpassword:{type: String, required: true}
    },
        {versionKey: false},
        {collection: 'users'});

var Users = mongoose.model('users',userSchema);

module.exports = Users;
/**
 * Created by Nir Mekin on 6/15/2017.
 */
var mongoose    = require('mongoose'),
    schema      = mongoose.Schema,
    userSchema = new schema({
        name:String,
        id:Number,
        profilepic:String
    },{collection:'users'});

var Users = mongoose.model('users',userSchema);

module.exports = Users;
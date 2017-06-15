const mongoose = require('mongoose'),
    schema = mongoose.Schema,
    songSchema = new schema({
        title: {type: String, index: 1, required: true},
        artist: {type: String, index: 1, required: true},
        id: Number,
        duration: Number,
        cover: {type: String, index: 1, required: true},
        genre: {type: String, index: 1, required: true},
    }, {collection: 'songs'});
// console.log(`required paths: ${movieSchema.requiredPaths()}`);
// console.log(`indexes: ${JSON.stringify(movieSchema.indexes())}`);

const Songs = mongoose.model('songs', songSchema);

module.exports = Songs;
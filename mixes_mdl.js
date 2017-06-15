const mongoose = require('mongoose'),
    schema = mongoose.Schema,
    mixSchema = new schema({
        songs: [Number],
        userid:Number,
        likes: Number,
        heard: Number,
        comments: [{type: String, index: 1, required: true}],
        hashtags: [{type: String, index: 1, required: true}],
    }, {collection: 'mixes'});

const Mixes = mongoose.model('mixes', mixSchema);

module.exports = Mixes;
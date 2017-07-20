const mongoose = require('mongoose'),
      schema = mongoose.Schema,
      mixSchema = new schema({
          songs: [Number],
          username:{type: String, required: true},
          mixcover: {type: String, required: true},
          mixname: {type: String, required: true},
          likes: Number,
          heard: Number,
          comments: [{type: String}],
          hashtags: [{type: String}]
      },
          {versionKey: false},
          {collection: 'mixes'});

const Mixes = mongoose.model('mixes', mixSchema);

module.exports = Mixes;
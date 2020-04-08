const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  index: Number,
});

const ShortUrlIndex = mongoose.model('ShortUrlIndex', schema)

// export default ShortUrlIndex;

module.exports = {
  ShortUrlIndex: ShortUrlIndex
};
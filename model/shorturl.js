const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  original_url: String,
  short_url: Number,
});

const ShortUrl = mongoose.model('ShortUrl', schema);

module.exports = {
  ShortUrl: ShortUrl
};
// export default ShortUrl;
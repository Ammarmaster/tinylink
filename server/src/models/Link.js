const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // must match [A-Za-z0-9]{6,8}
  url: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastClickedAt: { type: Date, default: null }
});

module.exports = mongoose.model('Link', LinkSchema);

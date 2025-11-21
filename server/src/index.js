require('dotenv').config();
// right after require('dotenv').config();
console.log('DEBUG: process.env.MONGO_URI =', process.env.MONGO_URI);

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const linksRouter = require('./routes/links');
const Link = require('./models/Link');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/healthz', (req, res) => res.json({ ok: true, version: '1.0' }));

app.use('/api/links', linksRouter);

// Redirect route (should be last)
app.get('/:code', async (req, res) => {
  const code = req.params.code;
  try {
    const link = await Link.findOne({ code });
    if (!link) return res.status(404).send('Not found');
    // atomic increment and update lastClickedAt
    await Link.updateOne(
      { _id: link._id },
      { $inc: { clicks: 1 }, $set: { lastClickedAt: new Date() } }
    );
    return res.redirect(302, link.url);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI, { dbName: 'tinylink' })
  .then(() => {
    console.log('Mongo connected');
    app.listen(PORT, () => console.log('Server running on', PORT));
  })
  .catch(err => {
    console.error('Mongo connection error', err);
  });

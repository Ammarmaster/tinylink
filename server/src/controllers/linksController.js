const Link = require('../models/Link');
const validUrl = require('valid-url');
const { generateCode } = require('../utils/codeGen');

async function createLink(req, res) {
  try {
    const { url, code } = req.body;
    if (!url) return res.status(400).json({ error: 'url required' });
    if (!validUrl.isUri(url)) return res.status(400).json({ error: 'Invalid URL' });

    let finalCode = code;
    if (finalCode) {
      if (!/^[A-Za-z0-9]{6,8}$/.test(finalCode)) return res.status(400).json({ error: 'Invalid code format' });
      const exists = await Link.findOne({ code: finalCode });
      if (exists) return res.status(409).json({ error: 'Code already exists' });
    } else {
      // generate unique code
      let attempts = 0;
      do {
        finalCode = generateCode(7);
        attempts++;
        if (attempts > 50) break;
      } while (await Link.findOne({ code: finalCode }));
    }

    const link = new Link({ code: finalCode, url });
    await link.save();
    return res.status(201).json({ code: link.code, url: link.url, clicks: link.clicks, createdAt: link.createdAt });
  } catch (err) {
    console.error('createLink', err);
    return res.status(500).json({ error: 'server error' });
  }
}

async function listLinks(req, res) {
  try {
    const links = await Link.find({}).sort({ createdAt: -1 });
    return res.json(links.map(l => ({ code: l.code, url: l.url, clicks: l.clicks, createdAt: l.createdAt, lastClickedAt: l.lastClickedAt })));
  } catch (err) {
    console.error('listLinks', err);
    return res.status(500).json({ error: 'server error' });
  }
}

async function getLinkStats(req, res) {
  try {
    const code = req.params.code;
    const link = await Link.findOne({ code });
    if (!link) return res.status(404).json({ error: 'Not found' });
    return res.json({ code: link.code, url: link.url, clicks: link.clicks, createdAt: link.createdAt, lastClickedAt: link.lastClickedAt });
  } catch (err) {
    console.error('getLinkStats', err);
    return res.status(500).json({ error: 'server error' });
  }
}

async function deleteLink(req, res) {
  try {
    const code = req.params.code;
    const removed = await Link.findOneAndDelete({ code });
    if (!removed) return res.status(404).json({ error: 'Not found' });
    return res.json({ ok: true });
  } catch (err) {
    console.error('deleteLink', err);
    return res.status(500).json({ error: 'server error' });
  }
}

module.exports = { createLink, listLinks, getLinkStats, deleteLink };

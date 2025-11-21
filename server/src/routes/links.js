// server/src/routes/links.js
const express = require('express');
const router = express.Router();

const { createLink, listLinks, getLinkStats, deleteLink } = require('../controllers/linksController');
const validateCode = require('../middlewares/validateCode');

// POST /api/links
router.post('/', validateCode, createLink);

// GET /api/links
router.get('/', listLinks);

// GET /api/links/:code (stats)
router.get('/:code', getLinkStats);

// DELETE /api/links/:code
router.delete('/:code', deleteLink);

module.exports = router;

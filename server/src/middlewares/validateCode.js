module.exports = function (req, res, next) {
  const code = req.body && req.body.code;
  if (!code) return next();
  if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
    return res.status(400).json({ error: 'Code must match [A-Za-z0-9]{6,8}' });
  }
  next();
};

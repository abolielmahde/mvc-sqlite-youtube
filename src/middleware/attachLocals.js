function attachLocals(req, res, next) {
  res.locals.user = req.session.user || null;

  // "Flash" message (single use)
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;

  next();
}

module.exports = { attachLocals };

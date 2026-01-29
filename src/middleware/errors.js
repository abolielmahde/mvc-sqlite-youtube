function notFoundHandler(req, res) {
  res.status(404).render("errors/404", { title: "Not Found" });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).render("errors/500", { title: "Error", status, message: err.message });
}

module.exports = { notFoundHandler, errorHandler };

class HomeController {
  home(req, res) {
    // requireAuth middleware guarantees session.user
    res.render("home/index", { title: "Home" });
  }
}

module.exports = { HomeController };

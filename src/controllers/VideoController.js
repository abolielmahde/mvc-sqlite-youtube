const { YouTubeService } = require("../services/YouTubeService");
const { FavoriteService } = require("../services/FavoriteService");

class VideoController {
  constructor() {
    this.youtube = new YouTubeService();
    this.favorites = new FavoriteService();
  }

  async page(req, res) {
    const q = (req.query.q || "").trim();
    const userId = req.session.user.id;

    let results = [];
    let errorMsg = null;

    if (q) {
      try {
        results = await this.youtube.searchVideos(q);
      } catch (err) {
        errorMsg = err.message;
      }
    }

    const saved = await this.favorites.list(userId);

    res.render("videos/index", {
      title: "YouTube Videos",
      q,
      results,
      saved,
      errorMsg,
    });
  }

  async save(req, res) {
    const userId = req.session.user.id;

    try {
      await this.favorites.save(userId, {
        videoId: req.body.videoId,
        title: req.body.title,
        channelTitle: req.body.channelTitle,
        thumbnailUrl: req.body.thumbnailUrl,
      });
      req.session.flash = { type: "success", message: "Saved to favorites." };
    } catch (err) {
      req.session.flash = { type: "danger", message: err.message };
    }

    const q = (req.body.q || "").trim();
    res.redirect(q ? `/videos?q=${encodeURIComponent(q)}` : "/videos");
  }

  async remove(req, res) {
    const userId = req.session.user.id;
    const favoriteId = Number(req.params.id);

    const ok = await this.favorites.remove(userId, favoriteId);
    req.session.flash = {
      type: ok ? "success" : "warning",
      message: ok ? "Removed from favorites." : "Favorite not found.",
    };

    const q = (req.body.q || "").trim();
    res.redirect(q ? `/videos?q=${encodeURIComponent(q)}` : "/videos");
  }
}

module.exports = { VideoController };

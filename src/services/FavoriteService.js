const { FavoriteRepository } = require("../repositories/FavoriteRepository");

class FavoriteService {
  constructor() {
    this.repo = new FavoriteRepository();
  }

  async list(userId) {
    return this.repo.listByUserId(userId);
  }

  async save(userId, video) {
    if (!video || !video.videoId || !video.title) {
      const err = new Error("Invalid video payload.");
      err.status = 400;
      throw err;
    }
    return this.repo.create(userId, video);
  }

  async remove(userId, favoriteId) {
    return this.repo.deleteByIdForUser(userId, favoriteId);
  }
}

module.exports = { FavoriteService };

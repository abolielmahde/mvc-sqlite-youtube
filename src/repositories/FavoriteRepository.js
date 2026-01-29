const { all, get, run } = require("../db/sqlite");

class FavoriteRepository {
  async listByUserId(userId) {
    return all(
      "SELECT * FROM favorites WHERE userId = ? ORDER BY createdAt DESC",
      [userId]
    );
  }

  async findByUserAndVideo(userId, videoId) {
    return get("SELECT * FROM favorites WHERE userId = ? AND videoId = ?", [userId, videoId]);
  }

  async create(userId, { videoId, title, channelTitle, thumbnailUrl }) {
    const now = new Date().toISOString();
    const result = await run(
      "INSERT OR IGNORE INTO favorites (userId, videoId, title, channelTitle, thumbnailUrl, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, videoId, title, channelTitle || null, thumbnailUrl || null, now]
    );
    // If ignored, fetch existing
    if (result.changes === 0) return this.findByUserAndVideo(userId, videoId);
    return get("SELECT * FROM favorites WHERE id = ?", [result.lastID]);
  }

  async deleteByIdForUser(userId, favoriteId) {
    const result = await run("DELETE FROM favorites WHERE id = ? AND userId = ?", [
      favoriteId,
      userId,
    ]);
    return result.changes > 0;
  }
}

module.exports = { FavoriteRepository };

const path = require("path");
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const SQLiteStoreFactory = require("connect-sqlite3");
const dotenv = require("dotenv");

const { initDb } = require("./db/sqlite");
const { attachLocals } = require("./middleware/attachLocals");
const { notFoundHandler, errorHandler } = require("./middleware/errors");

dotenv.config();

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

async function createApp() {
  const app = express();

  // Paths
  const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "data");
  ensureDir(dataDir);

  // DB init (users + favorites)
  await initDb();

  // View engine
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  // Body parsing
  app.use(express.urlencoded({ extended: true }));

  // Static assets
  app.use("/public", express.static(path.join(__dirname, "public")));

  // Sessions (stored in SQLite)
  const SQLiteStore = SQLiteStoreFactory(session);
  app.use(
    session({
      store: new SQLiteStore({
        dir: dataDir,
        db: process.env.SESSION_DB_FILE || "sessions.sqlite",
      }),
      secret: process.env.SESSION_SECRET || "dev_secret_change_me",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

  // locals (user + flash)
  app.use(attachLocals);

  // Routes
  app.use("/", require("./routes/homeRoutes"));
  app.use("/auth", require("./routes/authRoutes"));
  app.use("/videos", require("./routes/videoRoutes"));

  // Errors
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

(async () => {
  try {
    const app = await createApp();
    const port = Number(process.env.PORT || 3000);
    app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();

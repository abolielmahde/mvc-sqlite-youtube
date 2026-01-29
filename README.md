# MVC + SQLite + Auth + YouTube Favorites (Express)

אפליקציית WEB במבנה MVC, עם:
- **REGISTER / LOGIN / LOGOUT**
- **Sessions נשמרים ב-SQLite** (באמצעות `connect-sqlite3`)
- **Users נשמרים ב-SQLite**
- דף נוסף: **חיפוש סרטונים ביוטיוב + שמירה למועדפים למשתמש המחובר**, הצגת תוצאות למעלה ומועדפים למטה, מחיקה מהמועדפים (בלי שינוי סדר).

## התקנה והרצה מקומית

1. התקנת חבילות:
```bash
npm install
```

2. יצירת קובץ `.env` (דוגמה):
```bash
SESSION_SECRET=dev_secret_change_me
YOUTUBE_API_KEY=PASTE_YOUR_KEY_HERE
PORT=3000
```

3. הרצה:
```bash
npm start
# או פיתוח:
npm run dev
```

פתח בדפדפן: `http://localhost:3000`

## מבנה תיקיות (MVC)

- `src/controllers` – Controllers
- `src/services` – לוגיקה עסקית
- `src/repositories` – גישה ל-SQLite
- `src/db` – init + helpers של SQLite
- `src/routes` – route modules
- `src/views` – EJS templates
- `src/middleware` – auth middleware

## Render Deployment

### דרך GitHub (מומלץ)
1. העלה את הפרויקט ל-GitHub (כולל `render.yaml` אבל **ללא** `.env`).
2. ב-Render: **New + -> Web Service** -> בחר את ה-Repo.
3. Render יזהה Node:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. הוסף Environment Variables ב-Render:
   - `YOUTUBE_API_KEY` (חובה לחיפוש ביוטיוב)
   - `SESSION_SECRET` (Render יכול לייצר, או לשים ידנית)
5. Deploy.

> הערה: SQLite נשמר על הדיסק של השירות. אם רוצים התמדה חזקה לאורך זמן, אפשר להוסיף ב-Render **Disk** ולכוון `DB_PATH=/var/data/app.db`.

### בדיקת דרישות
- אחרי Register/Login מוצג מסך ראשי עם פרטי המשתמש וכפתור Logout.
- כשלא מחובר – מוצג מסך Login עם לינק ל-Register.
- דף `/videos` נגיש **רק אחרי התחברות**.
- תוצאות חיפוש למעלה, מועדפים למטה, אפשר למחוק מועדפים.

בהצלחה!

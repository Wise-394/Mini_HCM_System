import './config/firebaseAdmin.js';
import express from 'express';
import cors from 'cors';
import { usersRouter } from './routes/usersRoute.js';
import { errorRouter } from './routes/errorRoute.js';
import { attendanceRouter } from './routes/attendanceRoute.js';
import { dailySummaryRouter } from './routes/dailySummaryRoute.js';
import { seedDatabaseIfEmpty } from './services/seedDatabaseService.js';
import { adminRouter } from './routes/adminRoute.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://mini-hcm-system.web.app',
  'https://mini-hcm-system.firebaseapp.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

await seedDatabaseIfEmpty();

app.get('/health', (req, res) => res.sendStatus(200));
app.use('/users', usersRouter);
app.use('/attendance', attendanceRouter);
app.use('/daily-summaries', dailySummaryRouter);
app.use('/admin', adminRouter);
app.use(errorRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

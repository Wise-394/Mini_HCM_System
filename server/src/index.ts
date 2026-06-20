import './config/firebaseAdmin.js';
import express from 'express';
import cors from 'cors';
import { usersRouter } from './routes/usersRoute.js';
import { errorRouter } from './routes/errorRoute.js';
import { attendanceRouter } from './routes/attendanceRoute.js';
import { dailySummaryRouter } from './routes/dailySummaryRoute.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', usersRouter);
app.use('/attendance', attendanceRouter);
app.use('/daily-summaries', dailySummaryRouter);
app.use(errorRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

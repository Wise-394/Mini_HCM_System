import './config/firebaseAdmin.js';
import express from 'express';
import cors from 'cors';
import { usersRoute } from './routes/usersRoute.js';
import { errorRouter } from './routes/errorRoute.js';
import { attendanceRouter } from './routes/attendanceRoute.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', usersRoute);
app.use('/attendance', attendanceRouter);
app.use(errorRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

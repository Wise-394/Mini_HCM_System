import './config/firebaseAdmin.js';
import express from 'express';
import { usersRoute } from './routes/usersRoute.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/users', usersRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

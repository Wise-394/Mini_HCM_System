import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';

const router = Router();
// GET    /admin/employees                        → get all employees
// GET    /admin/attendance/:userId               → get attendance records of a specific employee
// PUT    /admin/attendance/:attendanceId         → edit a specific punch record
// GET    /admin/reports/daily?date=              → get daily report of all employees
// GET    /admin/reports/weekly?start=            → get weekly report of all employees

router.use(verifyToken);

router.get('/employees', () => {});
router.get('/attendance/:userId', () => {});
router.put('/attendance/:attendanceId', () => {});
router.get('/reports/daily', () => {});
router.get('/reports/weekly', () => {});

export default router;

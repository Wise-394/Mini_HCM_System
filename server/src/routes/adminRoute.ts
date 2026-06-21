import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import { getKPIOfAllEmployees } from '../controller/adminController.js';

const router = Router();

// GET    /admin/daily-summary/date               → get daily summary of all employees by date
// GET    /admin/kpi/date                         → get daily kpi of all employees by date
// GET    /admin/employees                        → get all employees

// GET    /admin/attendance/:userId               → get attendance records of a specific employee
// PUT    /admin/attendance/:attendanceId         → edit a specific punch record
// GET    /admin/reports/weekly?start=            → get weekly report of all employees

router.use(verifyToken, verifyAdmin);

router.get('/kpi/:date', getKPIOfAllEmployees);
router.get('/attendance/:userId', () => {});
router.put('/attendance/:attendanceId', () => {});
router.get('/reports/daily', () => {});
router.get('/reports/weekly', () => {});

export default router;

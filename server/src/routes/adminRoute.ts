import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import {
  getAllUserAttendanceByDate,
  getKPIOfAllEmployees,
} from '../controller/adminController.js';

export const adminRouter = Router();

// GET    /admin/daily-summary/date               → get daily summary of all employees by date
// GET    /admin/kpi/date                         → get daily kpi of all employees by date
// GET    /admin/employees                        → get all employees

// GET    /admin/attendance/:userId               → get attendance records of a specific employee
// PUT    /admin/attendance/:attendanceId         → edit a specific punch record
// GET    /admin/reports/weekly?start=            → get weekly report of all employees

adminRouter.use(verifyToken, verifyAdmin);

adminRouter.get('/kpi/:date', getKPIOfAllEmployees);
adminRouter.get('/daily-summar/:date', getAllUserAttendanceByDate);

adminRouter.get('/attendance/:userId', () => {});
adminRouter.put('/attendance/:attendanceId', () => {});
adminRouter.get('/reports/daily', () => {});
adminRouter.get('/reports/weekly', () => {});

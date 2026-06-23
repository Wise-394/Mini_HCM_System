import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import {
  getAllAttendanceOfUser,
  getAllEmployees,
  getAllUsersAttendanceByDate,
  getKPIOfAllEmployees,
  updateAttendanceByDate,
} from '../controller/adminController.js';

export const adminRouter = Router();

// GET    /admin/daily-summary/date               → get daily summary of all employees by date
// GET    /admin/kpi/date                         → get daily kpi of all employees by date
// GET    /admin/employees                        → get all employees
// GET    /admin/attendance/:userId               → get all attendance records of a specific employee
// PUT    /admin/attendance/:userId/:date         → edit a specific punch record

adminRouter.use(verifyToken, verifyAdmin);

adminRouter.get('/kpi/:date', getKPIOfAllEmployees);
adminRouter.get('/daily-summar/:date', getAllUsersAttendanceByDate);
adminRouter.get('/employees', getAllEmployees);
adminRouter.get('/attendance/:userId', getAllAttendanceOfUser);
adminRouter.put('/attendance/:userId/:date', updateAttendanceByDate);

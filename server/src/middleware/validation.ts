import { body } from 'express-validator';

//----------------------------------------------------------------
//Middleware for validating user inputs

export const validateUserProfile = [
  body('uid')
    .trim()
    .notEmpty()
    .withMessage('User ID is required.')
    .bail()
    .isString()
    .withMessage('User ID must be a string.'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .bail()
    .isString()
    .withMessage('Name must be a string.')
    .bail()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required.')
    .bail()
    .isEmail()
    .withMessage('Invalid email format.')
    .normalizeEmail(),
  body('timezone')
    .trim()
    .notEmpty()
    .withMessage('Timezone is required.')
    .bail()
    .isString()
    .withMessage('Timezone must be a string.'),
  body('schedule')
    .notEmpty()
    .withMessage('Schedule is required.')
    .bail()
    .isObject(),
  body('schedule.start')
    .trim()
    .notEmpty()
    .withMessage('Schedule start time is required.')
    .bail()
    .isString()
    .withMessage('Schedule start time must be a string.'),
  body('schedule.end')
    .trim()
    .notEmpty()
    .withMessage('Schedule end time is required.')
    .bail()
    .isString()
    .withMessage('Schedule end time must be a string.'),
];

export const validateAttendance = [
  body('type')
    .trim()
    .notEmpty()
    .withMessage('Punch type is required.')
    .bail()
    .isString()
    .withMessage('Punch type must be a string.')
    .bail()
    .isIn(['in', 'out'])
    .withMessage('Invalid punch type.'),
];

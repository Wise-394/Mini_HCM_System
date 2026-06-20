import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const db = getFirestore();
const auth = getAuth();

export const seedDatabaseIfEmpty = async () => {
  try {
    const [usersSnap, attendanceSnap, summarySnap] = await Promise.all([
      db.collection('users').limit(1).get(),
      db.collection('attendance').limit(1).get(),
      db.collection('dailySummary').limit(1).get(),
    ]);

    if (!usersSnap.empty || !attendanceSnap.empty || !summarySnap.empty) {
      console.log(
        'Seeding skipped: One or more collections already contain data.'
      );
      return;
    }

    console.log('Collections are empty. Starting database seeding...');
    const batch = db.batch();
    const defaultPassword = '11111111';

    const users = [
      {
        uid: 'user-001',
        name: 'employee',
        email: 'admin@company.com',
        role: 'admin',
        timezone: 'Asia/Manila',
        schedule: { start: '09:00', end: '18:00' },
      },
      {
        uid: 'user-002',
        name: 'Juan Dela Cruz',
        email: 'juan@company.com',
        role: 'employee',
        timezone: 'Asia/Manila',
        schedule: { start: '09:00', end: '18:00' },
      },
      {
        uid: 'user-003',
        name: 'Maria Santos',
        email: 'maria@company.com',
        role: 'employee',
        timezone: 'Asia/Manila',
        schedule: { start: '22:00', end: '06:00' },
      },
    ];

    for (const user of users) {
      try {
        await auth.createUser({
          uid: user.uid,
          email: user.email,
          password: defaultPassword,
          displayName: user.name,
        });
        console.log(`Auth account created for: ${user.email}`);
      } catch (error: any) {
        if (
          error.code !== 'auth/email-already-exists' &&
          error.code !== 'auth/uid-already-exists'
        ) {
          throw error;
        }
        console.log(`Auth account already exists for: ${user.email}`);
      }

      const ref = db.collection('users').doc(user.uid);
      batch.set(ref, user);
    }

    const attendance = [
      {
        id: 'att-001',
        userId: 'user-002',
        type: 'in',
        date: '2026-06-16',
        timestamp: Timestamp.fromDate(new Date('2026-06-16T09:00:00+08:00')),
      },
      {
        id: 'att-002',
        userId: 'user-002',
        type: 'out',
        date: '2026-06-16',
        timestamp: Timestamp.fromDate(new Date('2026-06-16T20:00:00+08:00')),
      },
      {
        id: 'att-003',
        userId: 'user-002',
        type: 'in',
        date: '2026-06-17',
        timestamp: Timestamp.fromDate(new Date('2026-06-17T09:30:00+08:00')),
      },
      {
        id: 'att-004',
        userId: 'user-002',
        type: 'out',
        date: '2026-06-17',
        timestamp: Timestamp.fromDate(new Date('2026-06-17T16:00:00+08:00')),
      },
      {
        id: 'att-005',
        userId: 'user-002',
        type: 'in',
        date: '2026-06-18',
        timestamp: Timestamp.fromDate(new Date('2026-06-18T09:00:00+08:00')),
      },
      {
        id: 'att-006',
        userId: 'user-002',
        type: 'out',
        date: '2026-06-18',
        timestamp: Timestamp.fromDate(new Date('2026-06-18T18:00:00+08:00')),
      },
      {
        id: 'att-007',
        userId: 'user-002',
        type: 'in',
        date: '2026-06-19',
        timestamp: Timestamp.fromDate(new Date('2026-06-19T10:00:00+08:00')),
      },
      {
        id: 'att-008',
        userId: 'user-002',
        type: 'out',
        date: '2026-06-19',
        timestamp: Timestamp.fromDate(new Date('2026-06-19T18:00:00+08:00')),
      },
      {
        id: 'att-009',
        userId: 'user-002',
        type: 'in',
        date: '2026-06-20',
        timestamp: Timestamp.fromDate(new Date('2026-06-20T09:00:00+08:00')),
      },
      {
        id: 'att-010',
        userId: 'user-002',
        type: 'out',
        date: '2026-06-20',
        timestamp: Timestamp.fromDate(new Date('2026-06-20T18:00:00+08:00')),
      },
      {
        id: 'att-011',
        userId: 'user-003',
        type: 'in',
        date: '2026-06-16',
        timestamp: Timestamp.fromDate(new Date('2026-06-16T22:00:00+08:00')),
      },
      {
        id: 'att-012',
        userId: 'user-003',
        type: 'out',
        date: '2026-06-16',
        timestamp: Timestamp.fromDate(new Date('2026-06-17T06:00:00+08:00')),
      },
      {
        id: 'att-013',
        userId: 'user-003',
        type: 'in',
        date: '2026-06-17',
        timestamp: Timestamp.fromDate(new Date('2026-06-17T22:45:00+08:00')),
      },
      {
        id: 'att-014',
        userId: 'user-003',
        type: 'out',
        date: '2026-06-17',
        timestamp: Timestamp.fromDate(new Date('2026-06-18T06:00:00+08:00')),
      },
      {
        id: 'att-015',
        userId: 'user-003',
        type: 'in',
        date: '2026-06-18',
        timestamp: Timestamp.fromDate(new Date('2026-06-18T22:00:00+08:00')),
      },
      {
        id: 'att-016',
        userId: 'user-003',
        type: 'out',
        date: '2026-06-18',
        timestamp: Timestamp.fromDate(new Date('2026-06-19T04:00:00+08:00')),
      },
      {
        id: 'att-017',
        userId: 'user-003',
        type: 'in',
        date: '2026-06-19',
        timestamp: Timestamp.fromDate(new Date('2026-06-19T22:00:00+08:00')),
      },
      {
        id: 'att-018',
        userId: 'user-003',
        type: 'out',
        date: '2026-06-19',
        timestamp: Timestamp.fromDate(new Date('2026-06-20T07:00:00+08:00')),
      },
      {
        id: 'att-019',
        userId: 'user-003',
        type: 'in',
        date: '2026-06-20',
        timestamp: Timestamp.fromDate(new Date('2026-06-20T22:00:00+08:00')),
      },
      {
        id: 'att-020',
        userId: 'user-003',
        type: 'out',
        date: '2026-06-20',
        timestamp: Timestamp.fromDate(new Date('2026-06-21T06:00:00+08:00')),
      },
    ];

    attendance.forEach((att) => {
      const ref = db.collection('attendance').doc(att.id);
      batch.set(ref, att);
    });

    const dailySummaries = [
      {
        userId: 'user-002',
        date: '2026-06-16',
        status: 'present',
        hoursWorked: 11,
        regularHours: 9,
        overtimeHours: 2,
        nightDifferentialHours: 0,
        lateMinutes: 0,
        undertimeMinutes: 0,
      },
      {
        userId: 'user-002',
        date: '2026-06-17',
        status: 'present',
        hoursWorked: 6.5,
        regularHours: 6.5,
        overtimeHours: 0,
        nightDifferentialHours: 0,
        lateMinutes: 30,
        undertimeMinutes: 120,
      },
      {
        userId: 'user-002',
        date: '2026-06-18',
        status: 'present',
        hoursWorked: 9,
        regularHours: 9,
        overtimeHours: 0,
        nightDifferentialHours: 0,
        lateMinutes: 0,
        undertimeMinutes: 0,
      },
      {
        userId: 'user-002',
        date: '2026-06-19',
        status: 'present',
        hoursWorked: 8,
        regularHours: 8,
        overtimeHours: 0,
        nightDifferentialHours: 0,
        lateMinutes: 60,
        undertimeMinutes: 60,
      },
      {
        userId: 'user-002',
        date: '2026-06-20',
        status: 'present',
        hoursWorked: 9,
        regularHours: 9,
        overtimeHours: 0,
        nightDifferentialHours: 0,
        lateMinutes: 0,
        undertimeMinutes: 0,
      },
      {
        userId: 'user-003',
        date: '2026-06-16',
        status: 'present',
        hoursWorked: 8,
        regularHours: 8,
        overtimeHours: 0,
        nightDifferentialHours: 8,
        lateMinutes: 0,
        undertimeMinutes: 0,
      },
      {
        userId: 'user-003',
        date: '2026-06-17',
        status: 'present',
        hoursWorked: 7.25,
        regularHours: 7.25,
        overtimeHours: 0,
        nightDifferentialHours: 7.25,
        lateMinutes: 45,
        undertimeMinutes: 0,
      },
      {
        userId: 'user-003',
        date: '2026-06-18',
        status: 'present',
        hoursWorked: 6,
        regularHours: 6,
        overtimeHours: 0,
        nightDifferentialHours: 6,
        lateMinutes: 0,
        undertimeMinutes: 120,
      },
      {
        userId: 'user-003',
        date: '2026-06-19',
        status: 'present',
        hoursWorked: 9,
        regularHours: 8,
        overtimeHours: 1,
        nightDifferentialHours: 8,
        lateMinutes: 0,
        undertimeMinutes: 0,
      },
      {
        userId: 'user-003',
        date: '2026-06-20',
        status: 'present',
        hoursWorked: 8,
        regularHours: 8,
        overtimeHours: 0,
        nightDifferentialHours: 8,
        lateMinutes: 0,
        undertimeMinutes: 0,
      },
    ];

    // Uses the custom format '${userId}_${date}' as the document key name
    dailySummaries.forEach((ds) => {
      const customDocId = `${ds.userId}_${ds.date}`;
      const ref = db.collection('dailySummary').doc(customDocId);
      batch.set(ref, ds);
    });

    await batch.commit();
    console.log('Database successfully seeded!');
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
};

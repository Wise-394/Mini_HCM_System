import { create } from 'zustand';
import type { DailyAttendanceWithSummary } from '../types/types';

//----------------------------------------------------------------
//responsible for storing states of the edit attendance modal

type AttendanceEditModalState = {
  isOpen: boolean;
  selectedDate: string | null;
  selectedRecord: DailyAttendanceWithSummary | null;
  selectedUserId: string | null;

  openModal: (
    userId: string,
    date: string,
    record: DailyAttendanceWithSummary
  ) => void; // add userId
  closeModal: () => void;
};

export const useAttendanceEditModalStore = create<AttendanceEditModalState>(
  (set) => ({
    isOpen: false,
    selectedDate: null,
    selectedRecord: null,
    selectedUserId: null,

    openModal: (userId, date, record) =>
      set({
        isOpen: true,
        selectedUserId: userId,
        selectedDate: date,
        selectedRecord: record,
      }),

    closeModal: () =>
      set({
        isOpen: false,
        selectedDate: null,
        selectedRecord: null,
        selectedUserId: null,
      }),
  })
);

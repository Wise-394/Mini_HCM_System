import { create } from 'zustand';
import type { DailyAttendanceWithSummary } from '../types/types';

type AttendanceEditModalState = {
  isOpen: boolean;
  selectedDate: string | null;
  selectedRecord: DailyAttendanceWithSummary | null;
  openModal: (date: string, record: DailyAttendanceWithSummary) => void;
  closeModal: () => void;
};

export const useAttendanceEditModalStore = create<AttendanceEditModalState>(
  (set) => ({
    isOpen: false,
    selectedDate: null,
    selectedRecord: null,

    openModal: (date, record) =>
      set({ isOpen: true, selectedDate: date, selectedRecord: record }),

    closeModal: () =>
      set({ isOpen: false, selectedDate: null, selectedRecord: null }),
  }),
);

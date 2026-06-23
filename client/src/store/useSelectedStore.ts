import { create } from 'zustand';

//----------------------------------------------------------------
//responsible for storing states of the selected date

interface SelectedDateState {
  selectedDate: string | null; //null = today's date
  setSelectedDate: (date: string) => void;
  resetToToday: () => void;
}

export const useSelectedDateStore = create<SelectedDateState>((set) => ({
  selectedDate: null,
  setSelectedDate: (date) => set({ selectedDate: date }),
  resetToToday: () => set({ selectedDate: null }),
}));

import { useState } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import { useAttendanceEditModalStore } from '../../../store/attendanceEditModalStore.ts';
import { formatDateLabel } from '../../../helpers/formats.ts';
import { useUpdateAttendance } from '../../../hooks/post/useUpdateAttendance.ts';
import type {
  DailyAttendanceWithSummary,
  FirestoreTimestamp,
} from '../../../types/types.ts';

//----------------------------------------------------------------
//The modal/dialog for editing the attendance of specific employee
//opening/closing states are managed by useAttendanceEditModalStore

const toTimeInput = (timestamp?: string | FirestoreTimestamp | null) => {
  if (!timestamp) return '';
  const date =
    typeof timestamp === 'string'
      ? new Date(timestamp)
      : new Date(timestamp._seconds * 1000);
  return date.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const toFirestoreTimestamp = (
  timeStr: string,
  dateStr: string
): FirestoreTimestamp => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(dateStr);
  date.setHours(hours, minutes, 0, 0);
  return { _seconds: Math.floor(date.getTime() / 1000), _nanoseconds: 0 };
};

const EditAttendanceModalContent = ({
  selectedUserId,
  selectedDate,
  selectedRecord,
  closeModal,
}: {
  selectedUserId: string;
  selectedDate: string;
  selectedRecord: DailyAttendanceWithSummary;
  closeModal: () => void;
}) => {
  const [timeIn, setTimeIn] = useState(
    toTimeInput(selectedRecord.in?.timestamp)
  );
  const [timeOut, setTimeOut] = useState(
    toTimeInput(selectedRecord.out?.timestamp)
  );

  const { updateAttendance, isUpdateLoading, updateError } =
    useUpdateAttendance();

  const handleSave = () => {
    updateAttendance(
      {
        userId: selectedUserId,
        date: selectedDate,
        ...(timeIn && { in: toFirestoreTimestamp(timeIn, selectedDate) }),
        ...(timeOut && { out: toFirestoreTimestamp(timeOut, selectedDate) }),
      },
      {
        onSuccess: closeModal,
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20
        p-4"
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white shadow-lg
          overflow-hidden"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-6 border-b
            border-slate-100"
        >
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Edit attendance
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Update employee time records
            </p>
          </div>
          <button
            onClick={closeModal}
            disabled={isUpdateLoading}
            className="w-9 h-9 flex items-center justify-center rounded-lg
              bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-400
              transition-colors hover:cursor-pointer disabled:opacity-50
              disabled:cursor-not-allowed"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 py-7 space-y-6">
          {/* Date */}
          <div>
            <p
              className="text-[11px] font-semibold text-slate-400 uppercase
                tracking-wider mb-2"
            >
              Date
            </p>
            <p
              className="text-sm font-medium text-slate-800 bg-slate-50
                rounded-lg px-4 py-3"
            >
              {formatDateLabel(selectedDate)}
            </p>
          </div>

          {/* Time inputs */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p
                className="text-[11px] font-semibold text-slate-400 uppercase
                  tracking-wider mb-2"
              >
                Time in
              </p>
              <input
                type="time"
                value={timeIn}
                onChange={(e) => setTimeIn(e.target.value)}
                disabled={isUpdateLoading}
                className="w-full bg-slate-50 rounded-lg px-4 py-3 text-sm
                  font-medium text-slate-800 focus:outline-none focus:ring-2
                  focus:ring-blue-200 focus:bg-blue-50 hover:bg-slate-100
                  transition-colors disabled:opacity-50
                  disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <p
                className="text-[11px] font-semibold text-slate-400 uppercase
                  tracking-wider mb-2"
              >
                Time out
              </p>
              <input
                type="time"
                value={timeOut}
                onChange={(e) => setTimeOut(e.target.value)}
                disabled={isUpdateLoading}
                className="w-full bg-slate-50 rounded-lg px-4 py-3 text-sm
                  font-medium text-slate-800 focus:outline-none focus:ring-2
                  focus:ring-blue-200 focus:bg-blue-50 hover:bg-slate-100
                  transition-colors disabled:opacity-50
                  disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Error */}
          {updateError && (
            <p className="text-xs text-red-500 font-medium">
              {updateError.message}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex justify-end gap-3 px-8 py-5 border-t border-slate-100
            bg-slate-50"
        >
          <button
            onClick={closeModal}
            disabled={isUpdateLoading}
            className="px-5 py-2.5 text-sm font-semibold text-slate-500 bg-white
              rounded-lg hover:bg-slate-100 transition-colors
              hover:cursor-pointer disabled:opacity-50
              disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdateLoading}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-500
              rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors
              hover:cursor-pointer disabled:opacity-50
              disabled:cursor-not-allowed"
          >
            {isUpdateLoading ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const EditAttendanceModal = () => {
  const isOpen = useAttendanceEditModalStore((state) => state.isOpen);
  const selectedDate = useAttendanceEditModalStore(
    (state) => state.selectedDate
  );
  const selectedRecord = useAttendanceEditModalStore(
    (state) => state.selectedRecord
  );
  const selectedUserId = useAttendanceEditModalStore(
    (state) => state.selectedUserId
  );
  const closeModal = useAttendanceEditModalStore((state) => state.closeModal);

  if (!isOpen || !selectedRecord || !selectedDate || !selectedUserId)
    return null;

  return (
    <EditAttendanceModalContent
      key={`${selectedDate}-${selectedRecord.in?.id ?? ''}-${selectedRecord.out?.id ?? ''}`}
      selectedUserId={selectedUserId}
      selectedDate={selectedDate}
      selectedRecord={selectedRecord}
      closeModal={closeModal}
    />
  );
};

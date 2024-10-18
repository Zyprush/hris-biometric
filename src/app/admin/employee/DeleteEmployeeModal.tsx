import { Dialog, Transition } from "@headlessui/react";

export const DeleteEmployeeModal = ({
  isOpen,
  onClose,
  onConfirm,
  reason,
  setReason,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reason: string;
  setReason: (value: string) => void;
}) => {
  return (
    <Transition show={isOpen}>
      <Dialog
        onClose={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <Transition.Child
          enter="transition ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="bg-white rounded-lg shadow-xl p-6">
            <Dialog.Title className="text-lg font-semibold">
              Reason for Deleting Employee
            </Dialog.Title>
            <Dialog.Description className="mt-2">
              Please provide the reason for deleting or archiving this employee
              (e.g., AWOL, resigned).
            </Dialog.Description>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input input-bordered w-full mt-4"
              placeholder="Enter reason"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={onConfirm} className="btn btn-danger">
                Confirm Delete
              </button>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

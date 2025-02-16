'use client';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react';
import { PiSealWarning } from 'react-icons/pi';

interface Props {
  deletePopup: boolean;
  setDeletePopup: (value: boolean) => void;
  onDelete: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  deleteBtnLoading: boolean;
}

const DeletePopup = ({ deletePopup, setDeletePopup, onDelete, deleteBtnLoading }: Props) => {
  const customHeader = (
    <p className="flex items-center gap-2 text-base font-medium">
      <PiSealWarning size={22} />
      Are you sure you want to proceed?
    </p>
  );

  return (
    <Dialog
      className="w-[100%] max-w-[355px]"
      header={customHeader}
      visible={deletePopup}
      closable={false}
      onHide={() => {
        if (!deletePopup) return;
        setDeletePopup(false);
      }}
    >
      <div className="mt-5 flex justify-end gap-4">
        <Button
          label="Yes"
          disabled={deleteBtnLoading}
          loading={deleteBtnLoading}
          className="rounded-lg bg-red-500 px-5 py-2 text-sm text-white"
          onClick={onDelete}
        />
        <button
          className="rounded-lg border bg-gray-100 px-5 py-2 text-sm font-medium text-gray-500"
          onClick={() => {
            setDeletePopup(false);
          }}
        >
          No
        </button>
      </div>
    </Dialog>
  );
};

export default DeletePopup;

import React from "react";
import Button from "./Button/Button";

type Props = {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  dataDeleted: any;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: (id: number) => void;
};

const DeleteConfirmationBox = (props: Props) => {
  const handleCancel = () => {
    props.setShowModal(false);
  };

  const handleDeleteConfirm = () => {
    props.handleDelete(props.dataDeleted.id);
    props.setShowModal(false);
    props.setShowAlert(true);
  };

  return (
    <div>
      <div className='flex justify-start'>
        <h5 className='text-black'>
          {`${props.dataDeleted.first_name} ${props.dataDeleted.last_name}`}
        </h5>
      </div>
      <div className='flex gap-5 justify-end w-full'>
        <Button size='sm' onClick={handleCancel}>
          Cancel
        </Button>
        <Button size='sm' variant='rose' onClick={handleDeleteConfirm}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default DeleteConfirmationBox;

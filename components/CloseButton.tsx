import React, { FC } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

interface CloseButtonProps {
  handleOnClick: () => void;
}

const CloseButton: FC<CloseButtonProps> = ({ handleOnClick }) => {
  return (
    <button
      type="button"
      className="
        ml-auto
        -mx-1.5
        -my-1.5
        text-gray-400
        hover:text-gray-700
        active:text-gray-400
        rounded-lg
        p-1.5
        inline-flex
        items-center
        justify-center
        h-8
        w-8
      "
      onClick={handleOnClick}
    >
      <IoCloseOutline size={24} />
    </button>
  );
};

export default CloseButton;

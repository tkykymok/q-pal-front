'use client';

import React, { FC, useEffect, useState } from 'react';
import CloseButton from '@/components/CloseButton';
import { AiFillCheckCircle } from 'react-icons/ai';
import { Message } from '@/constant/MessageType';
import { IoMdCloseCircle } from 'react-icons/io';
import MessageType = Message.MessageType;
import SUCCESS = Message.SUCCESS;
import ERROR = Message.ERROR;
import WARNING = Message.WARNING;
import { RiErrorWarningFill } from 'react-icons/ri';
import messageStore from '@/store/MessageStore';

interface ToastProps {
  content: string;
  type: MessageType;
}

const Toast: FC<ToastProps> = ({ content, type }) => {
  const { clearMessages } = messageStore();

  const [renderStarted, setRenderStarted] = useState(false);

  // コンポーネントがマウントされたときにrenderStartedをtrueに変更します。
  useEffect(() => {
    setTimeout(() => {
      setRenderStarted(true);
    }, 100);
  }, []);

  const MessageIcon = () => (
    <>
      {type === SUCCESS && <AiFillCheckCircle color="green" size={20} />}
      {type === WARNING && <RiErrorWarningFill color="orange" size={20} />}
      {type === ERROR && <IoMdCloseCircle color="red" size={20} />}
    </>
  );

  const handleClose = () => {
    setRenderStarted(false);
    setTimeout(() => {
      clearMessages();
    }, 300);
  };

  return (
    <div
      className={`
        justify-center
        flex
        items-center
        max-w-xl
        p-4
        mb-4
        text-gray-500
        bg-white
        rounded-lg
        shadow
        ${renderStarted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        transition-all
        ease-in-out
        duration-500
      `}
    >
      <div
        className="
          inline-flex
          items-center
          justify-center
          flex-shrink-0
          w-8
          h-8
          text-green-500
          rounded-lg
        "
      >
        <MessageIcon />
      </div>
      <div className="ml-3 text-sm font-normal">{content}</div>
      <CloseButton handleOnClick={handleClose} />
    </div>
  );
};

export default Toast;

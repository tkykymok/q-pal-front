'use client';

import Toast from '@/components/Toast';
import messageStore from '@/store/MessageStore';

const MessageList = () => {
  const { type, messages } = messageStore();

  return (
    <div className="absolute z-30 top-1.5 right-1.5">
      {type &&
        messages.map((msg, index) => (
          <Toast key={index} content={msg} type={type} />
        ))}
    </div>
  );
};

export default MessageList;

import create, { SetState, GetState, StoreApi } from 'zustand';
import {Message} from '@/constant/MessageType';
import MessageType = Message.MessageType;

type MessageStore = {
  type: MessageType | null;
  messages: string[]
  setType: (type: MessageType) => void;
  setMessages: (messages: string[]) => void;
  clearMessages: () => void;
};

const messageStore = create<MessageStore>(
  (set: SetState<MessageStore>, get: GetState<MessageStore>) => ({
    type: null,
    messages: [],
    setType: (type: MessageType) => set({ type: type }),
    setMessages: (messages: string[]) => set({ messages: messages }),
    clearMessages: () => set({type: null, messages: []})
  })
);

export default messageStore;

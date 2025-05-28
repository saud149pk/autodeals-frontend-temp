import { create } from 'zustand';

export interface UserData {
  user_id: string;
  exp: number;
  access_token: string;
}

interface ChatSummary {
  chat_id: string;
  header: string;
  timestamp: number;
}

// export interface Chat {
//   chat_id: string;
//   header: string;
//   timestamp: number;
//   conversations: {
//     question: string;
//     answer: string;
//   }[];
// }

export interface Chat {
  question: string;
  answer: string;
}

interface AppState {
  processing: boolean;
  userData: UserData | null;
  isAutoLoggedOut: boolean;
  currentChatId: string | null;
  isNewChat: boolean;

  setProcessing: (value: boolean) => void;
  setUserData: (data: UserData | null) => void;
  setIsAutoLoggedOut: (value: boolean) => void;
  setCurrentChatId: (chatId: string | null) => void;
  setIsNewChat: (value: boolean) => void;

  isSessionValid: () => boolean;

  chatHistory: ChatSummary[];
  setChatHistory: (chats: ChatSummary[]) => void;
  addToChatHistory: (chat: ChatSummary) => void;

  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  resetChats: () => void;

  updateLastChatAnswer: (answer: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  processing: false,
  userData: null,
  isAutoLoggedOut: false,
  currentChatId: null,
  isNewChat: true,
  chats: [],
  chatHistory: [],

  setProcessing: (value) => set({ processing: value }),
  setUserData: (data) => set({ userData: data }),
  setIsAutoLoggedOut: (value) => set({ isAutoLoggedOut: value }),
  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
  setIsNewChat: (value) => set({ isNewChat: value }),
  setChats: (chats) => set({ chats }),
  addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
  setChatHistory: (chats) => set({ chatHistory: chats }),
  resetChats: () => set({ chats: [] }),
  //   addToChatHistory: (chat) =>
  //     set({ chatHistory: [chat, ...get().chatHistory] }),
  addToChatHistory: (newChat) => {
    const existing = get().chatHistory.filter(
      (chat) => chat.chat_id !== newChat.chat_id
    );
    set({ chatHistory: [newChat, ...existing] });
  },
  updateLastChatAnswer: (answer: string) =>
    set((state) => {
      if (state.chats.length === 0) return state;
      const updatedChats = [...state.chats];
      updatedChats[updatedChats.length - 1] = {
        ...updatedChats[updatedChats.length - 1],
        answer,
      };
      return { chats: updatedChats };
    }),

  isSessionValid: () => {
    const { userData } = get();
    if (!userData || !userData.exp) return false;
    return userData.exp * 1000 > Date.now(); // exp is in seconds
  },
}));

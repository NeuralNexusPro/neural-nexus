import { create } from "zustand";

export default create((set) => ({
  quickReplies: [],
  initQuickReplies: (quickReplies: string[]) => set(() => ({ quickReplies })),
  addQuickReplies: (reply: string) => set((state) => ({ quickReplies: [ ...state.quickReplies, reply] })),
  
}));


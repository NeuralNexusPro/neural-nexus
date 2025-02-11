import { create } from "zustand";
import { subscribeWithSelector } from 'zustand/middleware';

export interface INexusStore {
  loading: boolean;
  waiting: boolean;
  answerStopped: boolean;
  setLoading: (flag: boolean) => void;
  setWaiting: (flag: boolean) => void;
  setAnswerStopped: (flag: boolean) => void;
}


const useStore = create(subscribeWithSelector<INexusStore>((set) => ({
  loading: true,
  setLoading: (flag: boolean) => set(() => ({ loading: flag })),
  waiting: false,
  setWaiting: (flag: boolean) => set(() => ({ waiting: flag })),
  answerStopped: false,
  setAnswerStopped: (flag: boolean) => set(() => ({ answerStopped: flag })),
})));

export default useStore;

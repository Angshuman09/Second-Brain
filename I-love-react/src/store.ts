import { create } from "zustand";
import toast from "react-hot-toast";

interface CountStore {
  count: number;
  increment: () => void;
  incrementAsync: () => Promise<void>;
  decrement: () => void;
  decrementAsync: () => Promise<void>;
}

export const useCountStore = create<CountStore>((set) => ({
  count: 0,
  increment: () => {
    set((state) => ({ count: state.count + 1 }));
  },
  incrementAsync: async () => {
    const id = toast.loading("state changing...");
    await new Promise(resolve => setTimeout(resolve, 5000))
    set((state) =>({ count: state.count + 1}));
    toast.success("state changed successful.",{
        id
    });
  },
  decrement: () => {
      set((state) => ({ count: state.count - 1 }));
  },
  decrementAsync: async ()=> {
    const id = toast.loading("state changing...");
    await new Promise((resolve)=> setTimeout(resolve, 5000));
    set((state)=> ({count: state.count-1}));
    toast.success("state changed successful.",{
        id
    });
  }
}));

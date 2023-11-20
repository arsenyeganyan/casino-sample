//implementing zustand for state management in this application
import { create } from "zustand";
import { persist, devtools } from 'zustand/middleware';

const store = (set) => ({
    news: null,
    setNews: (state) => (
        set((store) => {
            store.news = state
        }),
        false,
        "setNews"
    )
});

export const useStore = create(
    persist(devtools(store), { name: "store"})
);
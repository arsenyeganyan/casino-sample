//implementing zustand for state management in this application
import { create } from "zustand";
import { persist, devtools } from 'zustand/middleware';

const store = (set) => ({
    news: [],
    setNews: (state) =>
        set((store) => {
            store.news = state
        }, false, "setNews"),

    games: [],
    setGames: (state) =>
        set((store) => {
            store.games = state
        }, false, "setGames"),

    gameDetail: {},
    setGameDetail: (state) => 
        set((store) => {
            store.gameDetail = state
        }, false, "setGameDetail"),
});

export const useStore = create(
    persist(devtools(store), { name: "store" })
);
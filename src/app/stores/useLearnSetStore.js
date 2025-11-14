import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { useSetsStore } from '@/app/stores/useSetsStore';


export const useLearnSetStore = create(
      (set, get) => ({
        count: 0,
        matchedSet: null,
        currentWord: (state) => state.matchedSet?.words[state.count],
        setLength: (state) => state.matchedSet?.words.filter(w => !w.learned).length,
        setFinished: false,
        resetLearnSession: (slug) => {
                const sets = useSetsStore.getState().sets;
                const matched = sets.find((s) => s.slug === slug);
                if (!matched) return;
                const cloned = {...matched,
                words: matched.words.filter((w) => !w.archived).map((w) => ({ ...w,learned: false}))};set({ matchedSet: cloned, count: 0, setFinished: false });},
        increment: (setLength) => set((state) => ({count: state.count < setLength - 1 ? state.count + 1 : 0}), false, "increment"),
        decrement: (setLength) => set((state) => ({count: state.count > 0 ? state.count - 1 : setLength - 1}), false, "decrement"),
        learned: () => { set((state) => {;
if (state.matchedSet.words.length === 1){return {...state, setFinished: true, count: 0}};
          if(state.count >= state.matchedSet.words.length-1){set((state) => ({count: state.count -1}))}
          const updatedWords = state.matchedSet.words.map((word, index) => {
            if (index === state.count) {
              return { ...word, learned: true };}return { ...word };});
              const newWordsArray = updatedWords.filter((w) => !w.learned && w.active);
              return {matchedSet: {...state.matchedSet,words: newWordsArray, }}})},
        }))
       

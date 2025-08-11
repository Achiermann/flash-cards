import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export const useSetsStore = create(
  devtools(
    persist(
      (set, get) => ({
        sets: [],

  addSet: (name, id) => {
          const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
//.1     SET OBJECT                                 
          const newSet = {
            name,
            id,
            words: [],
            user: "",
            slug,
            createdAt: new Date().toISOString(),
          };
          set((state) => ({ sets: [...state.sets, newSet] }), false, "addSet");
        },

  editSet: (id, name) => {
          set(
            (state) => ({
              sets: state.sets.map((set) =>
                set.id === id ? { ...set, name } : set
              ),
            }),
            false,
            "editSet"
          );
        },

  deleteSet: (id) => {
          set(
            (state) => ({
              sets: state.sets.filter((set) => set.id !== id),
            }),
            false,
            "deleteSet"
          );
        },

  addWord: (setId, front, back) => {
          set(
            (state) => ({
              sets: state.sets.map((set) => {
                if (set.id === setId) {
                  return {
                    ...set,
                    words: [
                      ...set.words,
  //.1                    WORD OBJECT                                 

                      {
                        wordId: crypto.randomUUID(),
                        front,
                        back,
                        learned: false,
                        active: true,
                      },
                    ],
                  };
                }
                return set;
              }),
            }),
            false,
            "addWord"
          );
        },
        
  editWord: (setId, wordId, front, back) => {
  set(
    (state) => ({
      sets: state.sets.map((set) => set.id === setId
          ? {...set,
              words: set.words.map((word) =>
                word.wordId === wordId
                  ? {...word, front, back} 
                  : word
              ),
            } : set),}),
    false,
    "editWord"
  );
},

  deleteWord: (setId, wordId) => {
          set(
            (state) => ({
              sets: state.sets.map((set) => {
                if (set.id === setId) {
                  return {
                    ...set,
                    words: set.words.filter((word) => word.wordId !== wordId),
                  };
                }
                return set;
              }),
            }),
            false,
            "deleteWord"
          );
        },

  getSetBySlug: (slug) => {
          return get().sets.find((set) => set.slug === slug);
        },
        
  toggleActivateWord: (setId, wordId) => {
        set(
        (state) => ({
      sets: state.sets.map((set) =>
        set.id === setId
          ? {
              ...set,
              words: set.words.map((word) =>
                word.wordId === wordId
                  ? { ...word, active: !word.active }
                  : word
              ),
            }
          : set
      ),
    }),
    false,
    "toggleActivateWord"
  );
},
toggleLearnedWord: (setId, wordId) => {
        set(
          (state) => ({
            sets: state.sets.map((set) =>
              set.id === setId
                ? {
                    ...set,
                    words: set.words.map((word) =>
                      word.wordId === wordId
                        ? { ...word, learned: !word.learned }
                        : word),}: set),}),false,"toggleLearnedWord");}
                      }),{name: "Sets"}))
    );
    
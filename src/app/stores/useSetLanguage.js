import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export const useSetLanguage = create(
  devtools(
    persist(
      (set) => ({
        language: "italienisch",
        setLanguage: (language) => set({ language }, false, "setLanguage"),
      }),
      { name: "Language" }
    )
  )
);

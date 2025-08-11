import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export const useEditOptionsStore = create(
      (set, get) => ({
        showEditOptions: false,

  setShowEditOptions: (boolean) => {
          set((state) => ({ showEditOptions: boolean}), false, "toggleShowEditOptions");    
      }
    }))
import { create } from "zustand";

export const useEditOptionsStore = create(
      (set) => ({
        showEditOptions: false,

  setShowEditOptions: (boolean) => {
          set((state) => ({ showEditOptions: boolean}), false, "toggleShowEditOptions");    
      }
    }))
import { create } from "zustand"; import { persist, devtools } from "zustand/middleware";

export const useSetsStore = create(devtools(persist((set, get) => ({
  sets: [],
  // .2.          STATE MANAGEMENT FOR SETS         

  addSet: (name, id) => {
    const slug = String(name).toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const tempId = id ?? `temp-${Date.now()}`;
    const newSet = { name, id: tempId, words: [], user: "", slug, createdAt: new Date().toISOString() };
    set((state) => ({ sets: [...state.sets, newSet] }), false, "addSet");
    // sync to DB 
    fetch("/api/sets", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, words: [] }),
    })
      .then(async (res) => { if (!res.ok) { const err = await res.json().catch(() => ({})); 
      throw new Error(err.error || "Failed to create set"); } return res.json(); })
      .then((created) => {
        set((state) => ({ sets: state.sets.map((s) => s.id === tempId ? {
          ...s, id: created.id, name: created.set_name ?? s.name, slug: created.slug ?? s.slug,
          createdAt: created.createdAt ?? s.createdAt, words: Array.isArray(created.words) ? 
          created.words : s.words, } : s) }), false, "addSet.synced");
      }).catch((err) => { console.error("[useSetsStore] addSet sync failed:", err);
      });
  },

  editSet: (id, name) => {
    set((state) => ({ sets: state.sets.map((setItem) => setItem.id === id ? { ...setItem, name } : setItem) }), false, "editSet");
    // sync to DB 
    const slug = String(name).toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    fetch(`/api/sets/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, slug }) })
      .then(async (res) => { if (!res.ok) { const err = await res.json().catch(() => ({})); console.error("[useSetsStore] editSet sync failed:", err); } });
  },

  deleteSet: (id) => {
    set((state) => ({ sets: state.sets.filter((setItem) => setItem.id !== id) }), false, "deleteSet");
    // sync to DB 
    fetch(`/api/sets/${id}`, { method: "DELETE" })
      .then(async (res) => { if (!res.ok && res.status !== 204) { const err = await res.json().catch(() => ({})); throw new Error(err.error || "Failed to delete set"); } })
      .catch((e) => { console.error("[useSetsStore] deleteSet sync failed:", e);
      });
  },

  //.2      STATE MANAGEMENT FOR WORDS       

  addWord: (setId, front, back) => {
    const currentSet = get().sets.find((s) => s.id === setId); if (!currentSet) return;
    const newWord = { wordId: crypto.randomUUID(), front, back, learned: false, active: true, archived: false };
    const nextWords = [...currentSet.words, newWord];
    set((state) => ({ sets: state.sets.map((setItem) => setItem.id === setId ? 
    { ...setItem, words: nextWords } : setItem) }), false, "addWord");
    // sync to DB 
    const isTemp = typeof setId === "string" && setId.startsWith("temp-");
    if (!isTemp) { fetch(`/api/sets/${setId}`, 
    { method: "PATCH", headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify({ words: nextWords }) })
    .then(async (res) => { if (!res.ok) { const err = await res.json().catch(() => ({})); console.error("[useSetsStore] addWord sync failed:", err); } });
    }},

  editWord: (setId, wordId, front, back) => {
    const currentSet = get().sets.find((s) => s.id === setId); if (!currentSet) return;
    const nextWords = currentSet.words.map((w) => w.wordId === wordId ? { ...w, front, back } : w);
    set((state) => ({ sets: state.sets.map((setItem) => setItem.id === setId ? { ...setItem, words: nextWords } : setItem) }), false, "editWord");
    // sync to DB 
    const isTemp = typeof setId === "string" && setId.startsWith("temp-");
    if (!isTemp) {
      fetch(`/api/sets/${setId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ words: nextWords }) })
      .then(async (res) => { if (!res.ok) { const err = await res.json().catch(() => ({})); console.error("[useSetsStore] editWord sync failed:", err); } });
    }},

  deleteWord: (setId, wordId) => {
    const currentSet = get().sets.find((s) => s.id === setId); if (!currentSet) return;
    const nextWords = currentSet.words.filter((w) => w.wordId !== wordId);
    set((state) => ({ sets: state.sets.map((setItem) => setItem.id === setId ? { ...setItem, words: nextWords } : setItem) }), false, "deleteWord");
    // sync to DB 
    const isTemp = typeof setId === "string" && setId.startsWith("temp-");
    if (!isTemp) {
      fetch(`/api/sets/${setId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ words: nextWords }) })
      .then(async (res) => { if (!res.ok) { const err = await res.json().catch(() => ({})); console.error("[useSetsStore] deleteWord sync failed:", err); } });
    }},

  getSetBySlug: (slug) => get().sets.find((s) => s.slug === slug),
  
  toggleActivateWord: (setId, wordId) => {
    const currentSet = get().sets.find((s) => s.id === setId); if (!currentSet) return;
    const nextWords = currentSet.words.map((w) => w.wordId === wordId ? { ...w, active: !w.active } : w);
    set((state) => ({ sets: state.sets.map((setItem) => setItem.id === setId ? { ...setItem, words: nextWords } : setItem) }), false, "toggleActivateWord");
   // sync to DB 
    const isTemp = typeof setId === "string" && setId.startsWith("temp-");
    if (!isTemp) {
      fetch(`/api/sets/${setId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ words: nextWords }) })
      .then(async (res) => { if (!res.ok) { const err = await res.json().catch(() => ({})); console.error("[useSetsStore] toggleActivateWord sync failed:", err); } });
    }},

    toggleArchiveWord: (setId, wordId) => {
    const currentSet = get().sets.find((s) => s.id === setId); if (!currentSet) return;
    const nextWords = currentSet.words.map((w) => w.wordId === wordId ? { ...w, archived: !w.archived } : w);
    set((state) => ({ sets: state.sets.map((setItem) => setItem.id === setId ? { ...setItem, words: nextWords } : setItem) }), false, "toggleArchiveWord");
   // sync to DB 
    const isTemp = typeof setId === "string" && setId.startsWith("temp-");
    if (!isTemp) {
      fetch(`/api/sets/${setId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ words: nextWords }) })
      .then(async (res) => { if (!res.ok) { const err = await res.json().catch(() => ({})); console.error("[useSetsStore] toggleArchiveWord sync failed:", err); } });
    }},

  toggleLearnedWord: (setId, wordId) => {
    set((state) => ({ sets: state.sets.map((setItem) => setItem.id === setId ? {
      ...setItem, words: setItem.words.map((w) => w.wordId === wordId ? { ...w, learned: !w.learned } : w),
    } : setItem) }), false, "toggleLearnedWord");
  },

  // .2          DB MANAGEMENT        

  fetchSets: async () => {
    try {
      const res = await fetch("/api/sets", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch sets");
      const data = await res.json();
      const normalized = (Array.isArray(data) ? data : []).map((r) => ({
        id: r.id, name: r.set_name ?? r.name ?? "", words: Array.isArray(r.words) ? r.words : [],
        user: r.user ?? "", slug: r.slug ?? "", createdAt: r.createdAt ?? r.created_at ?? new Date().toISOString(),
      }));
      set({ sets: normalized }, false, "fetchSets");
    } catch (err) { console.error("[useSetsStore] fetchSets error:", err); }
  },
}), { name: "Sets" })));

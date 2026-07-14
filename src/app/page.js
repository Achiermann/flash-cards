'use client';

import { useState, useEffect } from 'react';
import { useSetsStore } from './stores/useSetsStore';
import SetItem from './setItem/SetItem';
import SetDetail from './setItem/SetDetail';
import { Plus } from 'lucide-react';
import { useEditOptionsStore } from './stores/useEditOptionsStore';
import { useIsMobile } from '@/components/isMobile';
import { useCenteredIndex } from "@/components/useCenteredIndex";
import { useSetLanguage } from './stores/useSetLanguage';


export default function SetsControl() {

  const [setName, setSetName] = useState('');
  const [showCreateField, setShowCreateField] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [selectedSetId, setSelectedSetId] = useState(null);
  const language = useSetLanguage((state) => state.language);
  // subscribe to the sets slice itself — calling getFilteredSets() here reads
  // the store without subscribing, so fetchSets() results never re-rendered
  const allSets = useSetsStore((state) => state.sets);
  const sets = allSets.filter((s) => s.language === language);
  const fetchSets = useSetsStore(s => s.fetchSets);
  const addSet = useSetsStore((state) => state.addSet);
  const setShowEditOptions = useEditOptionsStore((state) => state.setShowEditOptions);
  const showEditOptions = useEditOptionsStore((state) => state.showEditOptions);
  const isMobile = useIsMobile();
  const depsKey = `${isMobile}-${sets.length}`;
  // use a single ref returned from the hook and attach it to the scroller element
  const { ref: listRef, centerIndex } = useCenteredIndex({ depsKey });
  const sortedSets = [...sets].sort((a, b) => a.id - b.id);

  // On mobile, the card centered in the carousel viewport is the active set:
  // selecting it applies the `selected` class and drives the detail panel.
  const centeredSetId = sortedSets[centerIndex]?.id;

useEffect(() => {
    fetchSets(); // load from server on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isMobile && centeredSetId != null) setSelectedSetId(centeredSetId);
  }, [isMobile, centeredSetId]);

  // Show create set field
  const toggleCreateSetField = () => {
    setShowEditOptions(false);
    setShowCreateField((prev) => !prev);
  };

  // Show edit options
  const toggleEditOptions = () => {
    setShowCreateField(false);
    showEditOptions ? setShowEditOptions(false) : setShowEditOptions(true);
  };

  // Submit handler with input validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!setName.trim()) return;

    addSet(setName, crypto.randomUUID());
    setSetName('');
    toggleCreateSetField();
  };

  // Don't render until client-side load
  if (!isReady) return null;


  return (
    <div className="sets-control">
  <h2 className="your-sets-title">Your Sets</h2>
      <form onSubmit={handleSubmit}>
{/*//.2                       OPTION BUTTONS                       */}
        <div className="options-grid">
{/*//.1                       BUTTON CREATE                           */}
    <button type="button" className={showCreateField ? "btn-cancel-create" : "btn-add-set"} onClick={toggleCreateSetField}>{showCreateField ? 'Cancel' : <Plus className="plus-icon"/>} </button>
{/*//.1                       BUTTON EDIT                       */}
    <button type="button" className="btn-edit-sets" onClick={toggleEditOptions}>{showEditOptions ? 'Done' : 'Edit'}</button>
</div>
{/*//.1                       CREATE SET FIELD (HIDDEN)                      */}
     {showCreateField && (
<div className="create-set-field">
    <label>
      Setname:
      <input type="text" value={setName} onChange={(e) => setSetName(e.target.value)} />
      <button className = "btn-create-sets" type="submit">Create</button>
    </label>
  </div>
)}
      </form>
{/*//.2                       SETS-GRID                       */}
      <div className="sets-grid">
  {!isMobile && <ul> {sortedSets.map((set) => ( <li key={set.id}> <SetItem data={set} id={set.id} onSelect={setSelectedSetId} isSelected={selectedSetId === set.id} /> </li> ))} </ul>}
{isMobile && ( <ul className="snap-list" ref={listRef}> {sortedSets.map(s => ( <li className="snap-item" key={s.id}> <SetItem data={s} id={s.id} onSelect={setSelectedSetId} isSelected={selectedSetId === s.id} /> </li> ))} </ul> )}
  </div>
  <div className="dots-container">{sortedSets.map((el) => (<div className="dot" style={(el.id - 1) === centerIndex ? { backgroundColor: 'var(--color-line)' } : undefined}key={el.id}/>))}</div>
{/*//.2                       SET DETAIL                       */}
  <SetDetail setId={selectedSetId} />
    </div>
  );
}

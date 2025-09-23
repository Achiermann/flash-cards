'use client';

import { useState, useEffect, useMemo} from 'react';
import { useSetsStore } from './stores/useSetsStore';
import SetItem from './setItem/SetItem';
import { Plus } from 'lucide-react';
import { useEditOptionsStore } from './stores/useEditOptionsStore';
import { useIsMobile } from '@/components/isMobile';
import { useSwipeable } from 'react-swipeable';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useCenteredIndex } from "@/components/useCenteredIndex";
import { grid } from '@mui/system';


export default function SetsControl() {
  
  const [setName, setSetName] = useState('');
  const [showCreateField, setShowCreateField] = useState(false);
  const [isReady, setIsReady] = useState(false);  
  const sets = useSetsStore((state) => state.sets);
  const fetchSets = useSetsStore(s => s.fetchSets);
  const addSet = useSetsStore((state) => state.addSet);
  const addWord = useSetsStore((state) => state.addWord);
  const setShowEditOptions = useEditOptionsStore((state) => state.setShowEditOptions);
  const showEditOptions = useEditOptionsStore((state) => state.showEditOptions);
const isMobile = useIsMobile();
const [count, setCount] = useState(0);
const current = sets[count];
const depsKey = `${isMobile}-${sets.length}`;
const { ref: gridRef, centerIndex } = useCenteredIndex({ depsKey });
const sortedSets = sets.sort((a, b) => a.id - b.id);

useEffect(() => {
    fetchSets(); // load from server on mount
  }, [fetchSets]);
  

   useEffect(() => {
    setIsReady(true);
  }, []);

{//.1     Show create set field                    *}
}  const toggleCreateSetField = () => {
    setShowEditOptions(false);
    setShowCreateField((prev) => !prev);
  };

  {//.1     Show edit options                   *}

  const toggleEditOptions = () => {
    setShowCreateField(false);
 showEditOptions ? setShowEditOptions(false) : setShowEditOptions(true);}

  // Submit handler with input validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!setName.trim()) return;

    addSet(setName, crypto.randomUUID());
    setSetName('');
    toggleCreateSetField();
  };

  const handleCountUp = () => {
    if(count === sets.length -1) setCount(0);
    else setCount(count + 1)
};

 const handleCountDown = () => {
    if(count === 0) setCount(sets.length -1);
    else setCount(count - 1)
};

  // Don't render until client-side load
  if (!isReady) return null;

  return (
    <div className="sets-control">
  <h2>Your Sets</h2>
      <form onSubmit={handleSubmit}>
{/*//.2                       OPTION BUTTONS                       */}
        <div className="options-grid">
{/*//.1                       BUTTON CREATE                           */}
    <button type="button" className={showCreateField ? "btn-cancle-create" : "btn-add-set"} onClick={toggleCreateSetField}>{showCreateField ? 'Cancel' : <Plus className="plus-icon"/>} </button>
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
      <div className="sets-grid" ref={gridRef}>
  {!isMobile && <ul> {sortedSets.map((set) => ( <li key={set.id}> <SetItem data={set} editOptions={showEditOptions} id={set.id} /> </li> ))} </ul>}
  {isMobile && <ul className="snap-list"> {sortedSets.map(s => ( <li className="snap-item" key={s.id}> <SetItem data={s} id={s.id} editOptions={showEditOptions} /> </li> ))} </ul>}
          </div> 
  <div className="dots-container">{sortedSets.map((el) => (<div className="dot" style={(el.id - 1) === centerIndex ? { backgroundColor: '#fcfcfcff' } : undefined}key={el.id}/>))}</div>
    </div>
  );
}
}
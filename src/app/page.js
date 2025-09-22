'use client';

import { useState, useEffect } from 'react';
import { useSetsStore } from './stores/useSetsStore';
import SetItem from './setItem/SetItem';
import { Plus } from 'lucide-react';
import { useEditOptionsStore } from './stores/useEditOptionsStore';
import { useIsMobile } from '@/components/isMobile';
import { useSwipeable } from 'react-swipeable';

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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleCountDown,
    onSwipedRight: handleCountUp,
    trackTouch: true,
    trackMouse: true,
    preventScrollOnSwipe: true,
    delta: 10,  // min px to count as a swipe
  });

  // Don't render until client-side load
  if (!isReady) return null;

  return (
    <div className="sets-control">
  <h2>Your Sets</h2>
      <form onSubmit={handleSubmit}>
{/*//.2                       OPTION BUTTONS                       */}
        <div className="options-grid">
{/*//.1                       BUTTON CREATE                           */}
    <button type="button" className="btn-create-sets" onClick={toggleCreateSetField}>{showCreateField ? 'Cancel' : <Plus className="plus-icon"/>} </button>
{/*//.1                       BUTTON EDIT                       */}
    <button type="button" className="btn-edit-sets" onClick={toggleEditOptions}>{showEditOptions ? 'Done' : 'Edit'}</button>
</div>
{/*//.1                       CREATE SET FIELD (HIDDEN)                      */}
     {showCreateField && (
<div className="create-set-field">
    <label>
      Setname:
      <input type="text" value={setName} onChange={(e) => setSetName(e.target.value)} />
      <button type="submit">Create</button>
    </label>
  </div>
)}
      </form>
{/*//.2                       SETS-GRID                       */}
      <div className="sets-grid">
  {!isMobile && <ul> {sets.map((set) => ( <li key={set.id}> <SetItem data={set} editOptions={showEditOptions} id={set.id} /> </li> ))} </ul>}
  {isMobile && sets[count] && <ul {...swipeHandlers}><li key={sets[count].id}> <SetItem data={sets[count]} editOptions={showEditOptions} id={sets[count].id} /> </li></ul>}    
  </div> 
  <button onClick= {() => handleCountUp()}>Next</button>
  <button onClick= {() => handleCountDown()}>Prev</button>
    </div>
  );
}
}
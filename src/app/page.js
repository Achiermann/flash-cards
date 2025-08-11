'use client';

import { useState } from 'react';
import { useSetsStore } from '@/app/stores/useSetsStore';
import SetItem from '@/app/SetItem';
import { Plus } from 'lucide-react';
import { useEditOptionsStore } from '@/app/stores/useEditOptionsStore';


export default function SetsControl() {
  const [setName, setSetName] = useState('');
  const [showCreateField, setShowCreateField] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const sets = useSetsStore((state) => state.sets);
  const addSet = useSetsStore((state) => state.addSet);
  const addWord = useSetsStore((state) => state.addWord);
  const setShowEditOptions = useEditOptionsStore((state) => state.setShowEditOptions);
  const showEditOptions = useEditOptionsStore((state) => state.showEditOptions);


  useState(() => {
    setIsReady(true); // Zustand persist handles localStorage
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
  <ul> {sets.map((set) => ( <li key={set.id}> <SetItem data={set} editOptions={showEditOptions} id={set.id} /> </li> ))} </ul>
      </div> 
    </div>
  );
}
}
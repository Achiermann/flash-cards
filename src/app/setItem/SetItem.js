"use client";

import { useState, useEffect, use } from 'react';
import { useSetsStore } from '../stores/useSetsStore';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { Plus } from 'lucide-react';
import AddWordForm from '../buttons&forms/addWord/page';
import {useEditOptionsStore} from '../stores/useEditOptionsStore';
import toast from 'react-hot-toast';

export default function SetItem({ data, editOptions, id }) {

  const [editingSetNameId, setEditingSetNameId] = useState(null);
  const [editSetName, setEditSetName] = useState(`${data.name}`);

  const set = useSetsStore((state) => state.sets.find((s) => s.id === id));
  const deleteSet = useSetsStore((state) => state.deleteSet);
  const editSet = useSetsStore((state) => state.editSet);
  const setShowEditOptions = useEditOptionsStore((state) => state.setShowEditOptions);
  const showEditOptions = useEditOptionsStore((state) => state.showEditOptions);

  const handleSubmitName = (id, editSetName) => (e) => {
    e.preventDefault();
    if (editSetName === ``){
    setEditSetName(`${data.name}`)
    setShowEditOptions(false);
     return; 
    }
editSet(id, editSetName)
    setShowEditOptions(false);
  }

  return (
    <>
{/*//.2                 CONTENT                    */}
     <div className="set-item">
{/*//.2                 EDIT                    */}
       {showEditOptions && 
  <button className="button-delete-set" onClick={(e) => {e.preventDefault(); e.stopPropagation(); deleteSet(data.id)} }> 
  <Trash2 className="trash-icon"/> </button>}
     {!showEditOptions && (<div className='set-top-row'> <h3 className="set-title">{data.name}</h3></div>)}
      {showEditOptions && (<form onSubmit={handleSubmitName(id, editSetName)}><input className="edit-set-name-input" type="text" value={editSetName} onChange={(e) => setEditSetName(e.target.value)}></input>
      <button type="submit" style={{display: "none"}}/></form>)} 

{/*//.2                 ADD A WORD                    */}

<AddWordForm setId={data.id} className="add-word-form-homepage"/>

{/*//.2                 LEARN & MANAGE                 */}
{!showEditOptions && <div className="set-option-button-container">
{set.words.length > 0 && <Link href={`/learnView/${set.slug}`}> <button className="button-learn"> Learn</button> </Link>} 
{set.words.length === 0 && <button className="button-learn" onClick={() => toast.error(`This set contains no words yet!`)}> Learn</button>}
 <Link href={`/manageSet/${set.slug}`}> <button className="button-manage"> Manage Set </button> </Link>
 </div>}</div>
    </>
  );
}

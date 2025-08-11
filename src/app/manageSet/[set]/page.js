"use client";

import { useParams } from "next/navigation";
import { useSetsStore } from "@/app/stores/useSetsStore";
import Link from "next/link";
import { Trash2 } from 'lucide-react';
import { useState } from "react";
import AddWordForm from "@/app/buttons&forms/addWord/page";


export default function ManageSetView() {

  
  {/*//.1      VARIABLES            */}

  const { set: slug } = useParams();
  const set = useSetsStore((state) => state.sets.find((s) => s.slug === slug));

  const addWord = useSetsStore((state) => state.addWord);
  const deleteWord = useSetsStore((state) => state.deleteWord);
  const editWord = useSetsStore((state) => state.editWord);
  const matchedSet = useSetsStore((state) =>
    state.sets.find((s) => s.slug === slug)
  );
  const toggleActivateWord = useSetsStore((state) => state.toggleActivateWord);

  {/*//.1      States            */}

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [readyToAddWord, setReadyToAddWord] = useState(false);
const [editingWordId, setEditingWordId] = useState(null);
const [editFront, setEditFront] = useState('');
const [editBack, setEditBack] = useState('');

  {/*//.1      HANDLERS            */}

  const handleAddWord = (e) => {
    if (!readyToAddWord) {
      console.log('Please Add Front And Back!');
      return;
    }
    e.preventDefault();
    addWord(data.id, front.trim(), back.trim());
    setFront('');
    setBack('');
  };

  const handleToggleActive = (wordId) => (e) => {
    toggleActivateWord(matchedSet.id, wordId);
  }

  const handleEditWord = (wordId) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const word = matchedSet.words.find((w) => w.wordId === wordId);
    setEditFront(word.front);
    setEditBack(word.back);
    setEditingWordId(wordId);
  }

  const handleEditSubmit = (setId, wordId, front, back) => (e) => {
    e.preventDefault();
      if (editFront === '' || editBack === '') {
       setEditingWordId(null);
    setEditBack('');
    setEditFront('');
      return;
    }
    editWord(setId, wordId, front, back)
    setEditingWordId(null);
    setEditBack('');
    setEditFront('');
   ;}

  {/*//.1      HTML            */}


  if (!matchedSet) return <div className="p-4">Loading or Set not found</div>;

  return (
    <div className="manage-set-content">

{/*//.2        HEADER                             */}

  <div className='manage-set-content-header'>
  <div className='manage-set-title'><h2>Manage Set: {matchedSet.name}</h2></div>
  <Link href={`/learnView/${set.slug}`}> <button className="button-learn"> Learn</button> </Link>
  <AddWordForm setId={set.id} className = "add-word-form-manage-page"/> </div>

{/*//.2        WORDLIST                            */}
<div className='wordlist-container'>
    <ul>
      {matchedSet.words.map((wordObj) => {
      const isEditing = editingWordId === wordObj.wordId;
      return (
        <li className='wordlist-item' key={wordObj.wordId}>
            <div className='wordlist-item-delete' 
            onClick={(e) => {e.preventDefault();
            e.stopPropagation();
            deleteWord(matchedSet.id, wordObj.wordId)}}
            >
      <Trash2 className="trash-icon"
    /></div>
    {/*//.2         WORD DISPLAY                            */}
    {!isEditing && (<><div className='wordlist-item-front' onClick={handleEditWord(wordObj.wordId)}><h4>{wordObj.front}</h4></div>
          <div className='wordlist-item-back' onClick={handleEditWord(wordObj.wordId)}><h4>{wordObj.back}</h4></div></>)}
    {/*//.2        EDIT WORD FORM                           */}

    {isEditing 
    && (<div className="editword-input-wrapper"><form onSubmit={handleEditSubmit(matchedSet.id, wordObj.wordId, editFront, editBack)}>    
    <input type="text" value={editFront} onChange={(e) => setEditFront(e.target.value)} className="editword-input-field front" />
    <input type="text" value={editBack} onChange={(e) => setEditBack(e.target.value)} className="editword-input-field back" /> 
    <button type='submit' style={{display: "none"}}></button></form></div>)}
          
    {/*//.2        ACTIVE SLIDER-SWITCH                                */}
        <label className="switch"><input type="checkbox" defaultChecked={wordObj.active} onChange={handleToggleActive(wordObj.wordId)}/>
        <span className="slider"></span></label>
        </li>
      )})}
    </ul> </div> </div>
  );
}






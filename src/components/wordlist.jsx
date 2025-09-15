"use client";

import { useParams } from "next/navigation";
import { useSetsStore } from "@/app/stores/useSetsStore";
import Link from "next/link";
import { Trash2, Archive, ArchiveRestore } from 'lucide-react';
import { useState } from "react";
import AddWordForm from "@/components/addWordForm";
import toast from "react-hot-toast";
import { usePathname } from 'next/navigation';


export default function Wordlist({matchedSet}) {

  
  {/*//.1      VARIABLES            */}

const [front, setFront] = useState('');
const [back, setBack] = useState('');
const deleteWord = useSetsStore((state) => state.deleteWord);
const editWord = useSetsStore((state) => state.editWord);
const archiveWord = useSetsStore((state) => state.archiveWord);
const toggleActivateWord = useSetsStore((state) => state.toggleActivateWord);
const toggleArchiveWord = useSetsStore((state) => state.toggleArchiveWord);
const [editingWordId, setEditingWordId] = useState(null);
const [readyToAddWord, setReadyToAddWord] = useState(false);
const [editFront, setEditFront] = useState('');
const [editBack, setEditBack] = useState('');
const pathname = usePathname();
const isArchive = pathname === '/archive';
// filter words array for archive or non-archive
const filteredWordsArr = isArchive ?  matchedSet.words.filter(word => word.archived) : matchedSet.words.filter(word => !word.archived);
const filteredMatchedSet = {...matchedSet, words: filteredWordsArr};


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
    toggleActivateWord(filteredMatchedSet.id, wordId);
  }

const handleToggleArchive = (wordId) => {
  toggleArchiveWord(filteredMatchedSet.id, wordId);
  filteredWordsArr.find(word => word.wordId === wordId)?.archived ? toast.success('Word put back to Set!') : toast.success('Word archived!');
  }

  const handleEditWord = (wordId) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const word = filteredMatchedSet.words.find((w) => w.wordId === wordId);
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


  if (!filteredMatchedSet) return <div className="p-4">Loading or Set not found</div>;
  return (
<div className='wordlist-container'>
    <ul>
      {filteredMatchedSet.words.map((wordObj) => {
      const isEditing = editingWordId === wordObj.wordId;
      return (
        <li className='wordlist-item' key={wordObj.wordId}>
            <div className='wordlist-item-delete' onClick={(e) => 
          {e.preventDefault(); e.stopPropagation(); deleteWord(filteredMatchedSet.id, wordObj.wordId)}} > 
            <Trash2 className="trash-icon" /> </div>
    {/*//.2         WORD DISPLAY                            */}
    {!isEditing && (<><div className='wordlist-item-front' onClick={handleEditWord(wordObj.wordId)}><h4>{wordObj.front}</h4></div>
          <div className='wordlist-item-back' onClick={handleEditWord(wordObj.wordId)}><h4>{wordObj.back}</h4></div></>)}
    {/*//.2        EDIT WORD FORM                           */}

    {isEditing 
    && (<div className="editword-input-wrapper"><form onSubmit={handleEditSubmit(filteredMatchedSet.id, wordObj.wordId, editFront, editBack)}>    
    <input type="text" value={editFront} onChange={(e) => setEditFront(e.target.value)} className="editword-input-field front" />
    <input type="text" value={editBack} onChange={(e) => setEditBack(e.target.value)} className="editword-input-field back" /> 
    <button type='submit' style={{display: "none"}}></button></form></div>)}
          
{/*//.2        ACTIVE SLIDER-SWITCH                                */}
        {!isArchive && <label className="switch"><input type="checkbox" defaultChecked={wordObj.active} onChange={handleToggleActive(wordObj.wordId)}/>
        <span className="slider"></span></label>}
{/*//.2        ARCHIVE BUTTON                                */}
       <div className='wordlist-item-archive' onClick={(e) => 
          {e.preventDefault(); e.stopPropagation(); 
           handleToggleArchive(wordObj.wordId)}} > 
            {isArchive ? <ArchiveRestore className="archive-icon" /> : <Archive className="archive-icon" />} </div></li>
      )})}
    </ul></div>
  );
}






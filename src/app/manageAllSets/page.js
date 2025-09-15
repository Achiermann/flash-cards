"use client";

import { useSetsStore } from "@/app/stores/useSetsStore";
import Link from "next/link";
import { useState } from "react";
import AddWordForm from "@/components/addWordForm";
import Wordlist from "@/app/wordlist/page";
import { useEffect } from "react";

export default function ManageAllSetsView() {
    
const sets = useSetsStore((state) => state.sets);
const addWord = useSetsStore((state) => state.addWord);
    
const [selectedSet, setSelectedSet] = useState(null);

useEffect(() => {
if(sets?.length && !selectedSet) setSelectedSet(sets[0])
}, [sets, selectedSet]);

const handleSelectionChange = (e) => {
    setSelectedSet(sets.find(set => set.name === e.target.value))
}

  return (
    <div className="manage-set-content">

{/*//.2        HEADER                             */}

  <div className='manage-set-content-header'>
    <h2 style={{margin: '30px 0px 50px 0px'}}>Manage All Sets</h2>
{sets.map((matchedSet) => {
return (<div className="manage-all-sets-set-container" key={matchedSet.id}> 
<div className="sets-separator-line"/>
<div className="manage-set-title all-sets"><h2>{matchedSet.name}</h2></div>
  {matchedSet.words.length > 0 ? <Wordlist matchedSet={matchedSet}/> : <div className="no-words-in-set"><p style={{margin: '20px 0px 20px 0px'}}>This set contains no words yet</p></div> }
   </div>)
} )}
{selectedSet && <AddWordForm setId={selectedSet.id} className = "add-word-form-manage-page all-sets"/>}
<label htmlFor="add-word-@-manage-all-sets"><div className="add-to-title">Add to:</div></label>
<select name="set-options" id="add-word-@-manage-all-sets" onChange={handleSelectionChange}>
{sets.map((set) => {
    return (  <option key={set.id} value={set.name}>{set.name}</option>
)
})}
</select>
</div></div>
  );
}






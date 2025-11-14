"use client";

import { useSetsStore } from "@/app/stores/useSetsStore";
import Wordlist from "@/components/wordlist";

export default function ArchiveView() {

const sets = useSetsStore((state) => state.sets);

  return (
    <div className="manage-set-content">

{/*//.2        HEADER                             */}

  <div className='manage-set-content-header'>
<h2 style={{margin: '30px 0px 50px 0px'}}>Words Archive</h2>
{sets.map((matchedSet) => {
    const hasArchivedWords = matchedSet.words.filter((word) => word.archived).length > 0;
    const hasWords = matchedSet.words.length > 0;
return (<div className="manage-all-sets-set-container" key={matchedSet.id}> 
<div className="sets-separator-line"/>
<div className="manage-set-title all-sets"><h2>{matchedSet.name}</h2></div>
{hasArchivedWords && <Wordlist matchedSet={matchedSet}/>}
{hasWords && !hasArchivedWords && <div className="no-words-in-set"><p style={{margin: '20px 0px 20px 0px'}}>No archived words in this set</p></div> }
{!hasWords && <div className="no-words-in-set"><p style={{margin: '20px 0px 20px 0px'}}>No words in this set yet</p></div>}
   </div>)
} )}
</div></div>
  );
}






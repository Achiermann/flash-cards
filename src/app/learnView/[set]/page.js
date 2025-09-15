"use client";

import { useParams } from "next/navigation";
import { useSetsStore } from "@/app/stores/useSetsStore";
import {useLearnSetStore} from "@/app/stores/useLearnSetStore";
import { use, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { LinearProgress } from "@mui/material";

export default function LearnView() {

const [showAnswer, setShowAnswer] = useState(false);

const { set: slug } = useParams();
const { matchedSet, count, increment, decrement, resetLearnSession, learned, setFinished} = useLearnSetStore();
let currentSetLength = matchedSet?.words?.length || 0;
const initSetLength = useRef(currentSetLength)
const evaluateProgress = function(){
  if(setFinished) return 100;
  else if (!setFinished) return initSetLength.current === 0 ? 0 : ((100 / initSetLength.current) * (initSetLength.current - currentSetLength)).toFixed(2)
}
const progress = evaluateProgress();

useEffect(() => {
  initSetLength.current = 0
  currentSetLength = 0;
},[])

useEffect(() => {
  if(initSetLength.current === 0 && currentSetLength){
    initSetLength.current = currentSetLength || 0;
  }
}, [currentSetLength]);

const initLearnSession = !matchedSet && slug;
if (initLearnSession) {
  resetLearnSession(slug);
}

useEffect(() => {
resetLearnSession(slug);
},[resetLearnSession, slug]);

useEffect(() => {
  setShowAnswer(false);
}, [count, matchedSet]);

if(!matchedSet) {return <div className="loading">Loading...</div>;}
 
  const front = matchedSet.words[count].front;
  const back = matchedSet.words[count].back;
  const setLength = matchedSet.words.filter((w) => {return !w.learned && w.active}).length;matchedSet.words.length > 0

  return (<div className = "learn-view-container">
<div className="progress-and-flashcard">
  <div className="progress-bar-wrapper">
  <LinearProgress variant="determinate" value={progress} /></div>
  <div className = "flashcard" onClick={() => setShowAnswer(!showAnswer)}>
      {!setFinished &&<><ul className="flashcard-word-wrapper">
      <li className="flashcard-front"><p>{front}</p></li>
      <div className="flashcard-separator"/>
      <li className="flashcard-back"><p>{showAnswer ? back : ``}</p></li>
    </ul>
  <div className="options-container">
    <button className="button-prev" onClick={(e) => {e.stopPropagation(); decrement(setLength)}}>Prev</button>
    <button className="button-learned" onClick={(e) => {e.stopPropagation(); learned()}}>Learned</button>
    <button className="button-repeat" onClick={(e) => {e.stopPropagation(); increment(setLength)}}>Repeat</button>
  </div></>}
   {setFinished && <div className="set-finished-display">
  <h2>Well done! <br/> You finished the Set.</h2>
  <button className="button-reset" onClick={() => resetLearnSession(slug)}>Again</button>   
 <Link href={`/`}> <button className="button-goback"> Go Back</button> </Link>
  </div>} 
  </div></div>
      </div>);}


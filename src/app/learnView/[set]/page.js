'use client';

import { useParams } from 'next/navigation';
import { useLearnSetStore } from '@/app/stores/useLearnSetStore';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { LinearProgress } from '@mui/material';

export default function LearnView() {
  const [showAnswer, setShowAnswer] = useState(false);
  const { set: slug } = useParams();

  const {
    matchedSet,
    count,
    increment,
    decrement,
    resetLearnSession,
    learned,
    setFinished,          // assuming this is a boolean flag in your store
  } = useLearnSetStore();

  // Track the initial count once per session
  const initialCountRef = useRef(null);

  // Start / reset the session when slug changes
  useEffect(() => {
    resetLearnSession(slug);
    initialCountRef.current = null;        // clear initial so it can be set again
  }, [resetLearnSession, slug]);

  // Set the initial count once when words are available
  useEffect(() => {
    if (matchedSet && initialCountRef.current === null) {
      const initial = matchedSet.words.filter(w => !w.learned && w.active).length;
      initialCountRef.current = initial;
    }
  }, [matchedSet]);

  // Hide answer when card index or set changes
  useEffect(() => {
    setShowAnswer(false);
  }, [count, matchedSet]);

  if (!matchedSet) return <div className="loading">Loading...</div>;

  const remaining = matchedSet.words.filter(w => !w.learned && w.active).length;
  const initial = initialCountRef.current ?? remaining; // fallback on first render
  const progress = initial > 0 ? ((initial - remaining) / initial) * 100 : 0; // number, not string

  const front = matchedSet.words[count].front;
  const back  = matchedSet.words[count].back;

  return (
    <div className="learn-view-container">
      <div className="progress-and-flashcard">
        <div className="progress-bar-wrapper">
          <LinearProgress variant="determinate" value={setFinished ? 100 : progress} />
        </div>

        <div className="flashcard" onClick={() => setShowAnswer(!showAnswer)}>
          {!setFinished && (
            <>
              <ul className="flashcard-word-wrapper">
                <li className="flashcard-front"><p>{front}</p></li>
                <div className="flashcard-separator" />
                <li className="flashcard-back"><p>{showAnswer ? back : ''}</p></li>
              </ul>

              <div className="options-container">
                <button className="button-prev"    onClick={(e) => { e.stopPropagation(); decrement(remaining); }}>Prev</button>
                <button className="button-learned" onClick={(e) => { e.stopPropagation(); learned(); }}>Learned</button>
                <button className="button-repeat"  onClick={(e) => { e.stopPropagation(); increment(remaining); }}>Repeat</button>
              </div>
            </>
          )}

          {setFinished && (
            <div className="set-finished-display">
              <h2>Well done! <br /> You finished the Set.</h2>
              <button className="button-reset" onClick={() => resetLearnSession(slug)}>Again</button>
              <Link href="/"><button className="button-goback">Go Back</button></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

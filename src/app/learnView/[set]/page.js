'use client';

import { useParams } from 'next/navigation';
import { useLearnSetStore } from '@/app/stores/useLearnSetStore';
import { useSetsStore } from '@/app/stores/useSetsStore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LinearProgress } from '@mui/material';
import { Archive } from 'lucide-react';
import toast from 'react-hot-toast';

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
    setFinished,
    learnedCount,
    archivedCount,
    initialTotal,
  } = useLearnSetStore();

  const toggleArchiveWord = useSetsStore((state) => state.toggleArchiveWord);

  {/*//.1      HANDLERS            */}

  const handleToggleArchive = (wordId) => (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Archive the word in the main store
    toggleArchiveWord(matchedSet.id, wordId);

    // Remove the word from the current learn session immediately
    const updatedWords = matchedSet.words.filter(w => w.wordId !== wordId);


    // Update the learn session
    useLearnSetStore.setState((state) => {
      let newCount = state.count;
      // If we're at the end and removed the last word, go back one
      if (newCount >= updatedWords.length && updatedWords.length > 0) {
        newCount = updatedWords.length - 1;
      }
      // If no words left, finish the session
      if (updatedWords.length === 0) {
        return { ...state, setFinished: true, count: 0, archivedCount: state.archivedCount + 1 };
      }
      return {
        ...state,
        matchedSet: { ...state.matchedSet, words: updatedWords },
        count: newCount,
        archivedCount: state.archivedCount + 1
      };
    });

    toast.success('Word archived!');
  };
  
  {/*//.1      VARIABLES            */}

  // Start / reset the session when slug changes
  useEffect(() => {
    resetLearnSession(slug);
  }, [resetLearnSession, slug]);

  // Hide answer when card index or set changes
  useEffect(() => {
    setShowAnswer(false);
  }, [count, matchedSet]);

  if (!matchedSet) return <div className="loading">Loading...</div>;

  const completedWords = learnedCount + archivedCount;
  const progress = initialTotal > 0 ? (completedWords / initialTotal) * 100 : 0;
  const remaining = matchedSet.words.filter(w => !w.learned).length;

  const currentWord = matchedSet.words[count];
  const front = currentWord.front;
  const back  = currentWord.back;
  const wordId = currentWord.wordId;
  
  console.log('matchedSet', matchedSet);
  return (
    <div className="learn-view-container">
      <div className="progress-and-flashcard">
        <div className="progress-bar-wrapper">
          <LinearProgress variant="determinate" value={setFinished ? 100 : progress} />
        </div>

        <div className="flashcard" onClick={() => setShowAnswer(!showAnswer)}>
          {!setFinished && (
            <>
              <div className='wordlist-item-archive' onClick={handleToggleArchive(wordId)}>
                <Archive className="archive-icon" />
              </div>
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
            <div className="finished-message"><p>Well done! <br /> You finished the Set.</p></div>
            <div className="finished-options-container">
            <button className="button-reset" onClick={() => resetLearnSession(slug)}>Again</button> <Link href="/"><button className="button-goback">Go Back</button></Link> </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

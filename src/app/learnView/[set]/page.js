'use client';

import { useParams } from 'next/navigation';
import { useLearnSetStore } from '@/app/stores/useLearnSetStore';
import { useSetsStore } from '@/app/stores/useSetsStore';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import LinearProgress from '@mui/material/LinearProgress';
import { Archive } from 'lucide-react';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/components/isMobile';
import '@/styles/learnView.css';
import Conjugator from '@/components/Conjugator';


export default function LearnView() {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showConjugator, setShowConjugator] = useState(false);
  const { set: slug } = useParams();
  const isMobile = useIsMobile();

  // Swipe state lives in refs and drives the card transform directly —
  // no re-render per touchmove while the card follows the finger
  const cardRef = useRef(null);
  const dragRef = useRef({ startX: 0, startY: 0, active: false, horizontal: false, dx: 0 });
  const suppressClickRef = useRef(false);
  const animatingRef = useRef(false);

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
  const fetchSets = useSetsStore((state) => state.fetchSets);

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

  // Tap flips the card — unless the touch was a swipe
  const handleCardClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    setShowAnswer(!showAnswer);
  };

  // Swipe (mobile): the card follows the finger; releasing past the
  // threshold slides it out — left = next card, right = previous card
  const handleTouchStart = (e) => {
    if (!isMobile || setFinished || animatingRef.current) return;
    const touch = e.touches[0];
    dragRef.current = { startX: touch.clientX, startY: touch.clientY, active: true, horizontal: false, dx: 0 };
    suppressClickRef.current = false;
    if (cardRef.current) cardRef.current.style.transition = '';
  };

  const handleTouchMove = (e) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const touch = e.touches[0];
    const dx = touch.clientX - drag.startX;
    const dy = touch.clientY - drag.startY;
    if (!drag.horizontal) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      if (Math.abs(dx) <= Math.abs(dy)) {
        drag.active = false;
        return;
      }
      drag.horizontal = true;
    }
    drag.dx = dx;
    if (cardRef.current) cardRef.current.style.transform = `translateX(${dx}px)`;
  };

  const handleTouchEnd = () => {
    const drag = dragRef.current;
    if (!drag.active) return;
    drag.active = false;
    if (!drag.horizontal || !cardRef.current) return;
    suppressClickRef.current = true;
    const card = cardRef.current;
    const threshold = 60;
    if (Math.abs(drag.dx) > threshold) {
      const goNext = drag.dx < 0;
      const offscreen = card.offsetWidth + 60;
      animatingRef.current = true;
      card.style.transition = 'transform 0.2s ease';
      card.style.transform = `translateX(${goNext ? -offscreen : offscreen}px)`;
      setTimeout(() => {
        const rem = matchedSet.words.filter(w => !w.learned).length;
        if (goNext) increment(rem);
        else decrement(rem);
        card.style.transition = '';
        card.style.transform = '';
        animatingRef.current = false;
      }, 200);
    } else {
      card.style.transition = 'transform 0.2s ease';
      card.style.transform = '';
    }
  };

  {/*//.1      VARIABLES            */}

  // Start / reset the session when slug changes — refresh from the server first
  // so the session snapshot (and matchedSet.id used for archiving) uses current DB ids
  useEffect(() => {
    let active = true;
    (async () => {
      await fetchSets();
      if (active) resetLearnSession(slug);
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

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

  return (
    <div className="learn-view-container">
  <Conjugator drilledVerb={currentWord.back} isOpen={showConjugator} onClose={() => setShowConjugator(false)} />
      <div className="progress-and-flashcard">
        <div className="progress-bar-wrapper">
          <LinearProgress variant="determinate" value={setFinished ? 100 : progress} />
        </div>

        <div
          className="flashcard"
          ref={cardRef}
          onClick={handleCardClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {!setFinished && (
            <>
              <div className='wordlist-item-archive' onClick={handleToggleArchive(wordId)}>
                <Archive className="archive-icon" />
              </div>
              <ul className="flashcard-word-wrapper">
                <li className="flashcard-front"><p>{front}</p></li>
                <div className="flashcard-separator" />
                <li className="flashcard-back"><p>{showAnswer ? back : ''}</p></li>
              {showAnswer && <button className="conjugator-button" onClick={() => setShowConjugator(true)}> Conjugate </button>}
              </ul>


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
              <div className="options-container">
                {!isMobile && <button className="button-prev" onClick={(e) => { e.stopPropagation(); decrement(remaining); }}>Prev</button>}
                <button className="button-learned" onClick={(e) => { e.stopPropagation(); learned(); }}>Learned</button>
                <button className="button-repeat"  onClick={(e) => { e.stopPropagation(); increment(remaining); }}>Repeat</button>
              </div>
    </div>
  );
}

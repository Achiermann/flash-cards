'use client';

import { useState, useEffect, useMemo} from 'react';
import { useSetsStore } from './stores/useSetsStore';
import SetItem from './setItem/SetItem';
import { Plus } from 'lucide-react';
import { useEditOptionsStore } from './stores/useEditOptionsStore';
import { useIsMobile } from '@/components/isMobile';
import { useSwipeable } from 'react-swipeable';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export default function SetsControl() {
  
  const [setName, setSetName] = useState('');
  const [showCreateField, setShowCreateField] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  const sets = useSetsStore((state) => state.sets);
  const fetchSets = useSetsStore(s => s.fetchSets);
  const addSet = useSetsStore((state) => state.addSet);
  const addWord = useSetsStore((state) => state.addWord);
  const setShowEditOptions = useEditOptionsStore((state) => state.setShowEditOptions);
  const showEditOptions = useEditOptionsStore((state) => state.showEditOptions);
const isMobile = useIsMobile();
const [count, setCount] = useState(0);
const current = sets[count];

  useEffect(() => {
    fetchSets(); // load from server on mount
  }, [fetchSets]);
  

   useEffect(() => {
    setIsReady(true);
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

  const handleCountUp = () => {
    if(count === sets.length -1) setCount(0);
    else setCount(count + 1)
};

 const handleCountDown = () => {
    if(count === 0) setCount(sets.length -1);
    else setCount(count - 1)
};

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleCountDown,
    onSwipedRight: handleCountUp,
    trackTouch: true,
    trackMouse: true,
    preventScrollOnSwipe: true,
    delta: 10,  // min px to count as a swipe
  });

// --- Framer bits for the mobile card ---
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const opacity = useTransform(x, [-220, -80, 0, 80, 220], [0, 1, 1, 1, 0.0]);

  // Thresholds based on viewport width
  const { swipeDistance, flingVelocity } = useMemo(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 375;
    return {
      swipeDistance: Math.min(180, Math.max(80, w * 0.25)), // 25% width (80..180px)
      flingVelocity: 600,                                   // px/s
    };
  }, []);

  function onDragEnd(_, info) {
    const { offset, velocity } = info; // offset.x, velocity.x
    const goLeft  = offset.x < -swipeDistance || velocity.x < -flingVelocity;
    const goRight = offset.x >  swipeDistance || velocity.x >  flingVelocity;

    if (goLeft) {
      // animate off-left, then go next, then reset position
      animate(x, -window.innerWidth, { duration: 0.25 }).then(() => {
        handleCountUp();
        x.set(0); // reset for next card
      });
    } else if (goRight) {
      animate(x,  window.innerWidth, { duration: 0.25 }).then(() => {
        handleCountDown();
        x.set(0);
      });
    } else {
      // snap back
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 30 });
    }
  }


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
  {!isMobile && <ul> {sets.map((set) => ( <li key={set.id}> <SetItem data={set} editOptions={showEditOptions} id={set.id} /> </li> ))} </ul>}
 {isMobile && (
<div className="swipe-stage"> <ul> {current && ( <li key={current.id}>
<motion.div className="swipe-card" style={{ x, touchAction: 'pan-y' }} whileDrag={{ scale: 0.98 }} drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={onDragEnd} whileTap={{ cursor: 'grabbing' }} >
 <SetItem data={current} editOptions={showEditOptions} id={current.id} /> </motion.div> </li> )} </ul> </div> )}
          </div> 
    </div>
  );
}
}
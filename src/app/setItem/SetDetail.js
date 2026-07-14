'use client';

import Link from 'next/link';
import { useSetsStore } from '../stores/useSetsStore';
import AddWordForm from '@/components/addWordForm';
import toast from 'react-hot-toast';
import { useIsMobile } from '@/components/isMobile';
import '@/styles/setDetail.css';

export default function SetDetail({ setId }) {

  const set = useSetsStore((state) => state.sets.find((s) => s.id === setId));
  const isMobile = useIsMobile();

{/*//.2                 EMPTY STATE                    */}
  if (!set) {
    return (
      <div className="set-detail set-detail-empty">
        <p>Please select a set</p>
      </div>
    );
  }

  const wordCount = set.words.length;

  return (
    <div className="set-detail">
      <div className="set-detail-body">
{/*//.2                 SET TOP ROW (desktop only)                    */}
        {!isMobile && (
          <div className="set-top-row">
            <h3 className="set-title">{set.name}</h3>
            <div className="set-item-words-count"><p>{wordCount} word{wordCount === 1 ? "" : "s"}</p></div>
          </div>
        )}

{/*//.2                 OPTIONS (desktop only — mobile learns via the card)   */}
        {!isMobile && (
          <div className="set-option-button-container">
            {wordCount > 0
              ? <Link href={`/learnView/${set.slug}`}><button className="button-learn">Learn</button></Link>
              : <button className="button-learn" onClick={() => toast.error(`This set contains no words yet!`)}>Learn</button>}
            <Link href={`/manageSet/${set.slug}`}><button className="button-manage">Manage</button></Link>
          </div>
        )}

{/*//.2                 ADD WORD FORM                    */}
        <AddWordForm setId={set.id} className="add-word-form-homepage" />

{/*//.2                 MANAGE (mobile only, under the form)                  */}
        {isMobile && (
          <div className="set-option-button-container">
            <Link href={`/manageSet/${set.slug}`}><button className="button-manage">Manage</button></Link>
          </div>
        )}
      </div>
    </div>
  );
}

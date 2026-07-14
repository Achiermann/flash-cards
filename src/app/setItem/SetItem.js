"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSetsStore } from '../stores/useSetsStore';
import { Trash2 } from 'lucide-react';
import { useEditOptionsStore } from '../stores/useEditOptionsStore';
import { useIsMobile } from '@/components/isMobile';
import toast from 'react-hot-toast';
import '@/styles/setItem.css';

export default function SetItem({ data, id, onSelect, isSelected }) {

  const { setConfirmDeleteMessage } = useSetsStore();
  const [editSetName, setEditSetName] = useState(`${data.name}`);

  const router = useRouter();
  const isMobile = useIsMobile();
  const editSet = useSetsStore((state) => state.editSet);
  const setShowEditOptions = useEditOptionsStore((state) => state.setShowEditOptions);
  const showEditOptions = useEditOptionsStore((state) => state.showEditOptions);

  const handleSubmitName = (id, editSetName) => (e) => {
    e.preventDefault();
    if (editSetName === ``) {
      setEditSetName(`${data.name}`);
      setShowEditOptions(false);
      return;
    }
    editSet(id, editSetName);
    setShowEditOptions(false);
  };

  const wordCount = data.words.length;

  // Mobile: the selected (centered) card acts like the Learn button did
  const handleMobileCardClick = () => {
    if (!isMobile || showEditOptions || !isSelected) return;
    if (wordCount > 0) router.push(`/learnView/${data.slug}`);
    else toast.error(`This set contains no words yet!`);
  };

  return (
    <div className={`set-item${isSelected ? ' selected' : ''}`} onClick={handleMobileCardClick}>
{/*//.2                 EDIT: DELETE                    */}
      {showEditOptions &&
        <button className="button-delete-set" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmDeleteMessage("confirm-delete", data.id); }}>
          <Trash2 className="trash-icon" /> </button>}

{/*//.2                 CONTENT (click to open detail)                    */}
      {!showEditOptions && (
        <div className="set-content" onClick={() => onSelect(data.id)}>
          <h3 className="set-title">{data.name}</h3>
          <div className="set-item-words-count"><p>{wordCount} word{wordCount === 1 ? "" : "s"}</p></div>
        </div>
      )}

{/*//.2                 EDIT: RENAME                    */}
      {showEditOptions && (
        <form onSubmit={handleSubmitName(id, editSetName)}>
          <input className="edit-set-name-input" type="text" value={editSetName} onChange={(e) => setEditSetName(e.target.value)} />
          <button type="submit" style={{ display: "none" }} />
        </form>)}
    </div>
  );
}

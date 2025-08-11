import { useSetsStore } from "@/app/stores/useSetsStore";
import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AddWordForm({setId, className=""}) {

      const addWord = useSetsStore((state) => state.addWord);

      const [readyToAddWord, setReadyToAddWord] = useState(false);
      const [front, setFront] = useState('');
      const [back, setBack] = useState('');

      // Are the two fields filled? 
        useEffect(() => {
          setReadyToAddWord(front.trim() !== '' && back.trim() !== '');
        }, [front, back]);
      
        const handleAddWord = (e) => {
          if (!readyToAddWord) {
            console.log('Please Add Front And Back!');
            return;
          }
          e.preventDefault();
          addWord(setId, front.trim(), back.trim());
          setFront('');
          setBack('');
        };

   return (
    <>
   <form className = {className} onSubmit={handleAddWord}>
    <fieldset className="add-word-field">
  <legend><p>Add A New Word</p></legend>
  <label><input className='word-input-field front' type="text" placeholder='front' value={front}
  onChange={(e) => setFront(e.target.value)}/></label>
  <div className="separator-line"></div>
  <label><input className='word-input-field back' type="text" placeholder='back' value={back}
  onChange={(e) => setBack(e.target.value)}/></label>
      <button type="submit" style={{ display: 'none' }} />
  </fieldset>
</form>
    </>)
}
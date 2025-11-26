'use client';

import { useState, useEffect } from 'react';
import '@/styles/conjugator.css';
import { usePathname } from 'next/navigation';
import { useSetLanguage } from '@/app/stores/useSetLanguage';

export default function Conjugator({ isOpen, onClose, drilledVerb }) {

  // *** VARIABLES ***
  const [conjugationData, setConjugationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [insertedVerb, setInsertedVerb] = useState('')
  const [error, setError] = useState(null);
  const verb = insertedVerb || drilledVerb || "essere"
  const path = usePathname()
  const { language } = useSetLanguage()

  // *** FUNCTIONS/HANDLERS ***
  useEffect(() => {
    if (isOpen) {
      fetchConjugations();
    }
  }, [isOpen]);


  async function fetchConjugations() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/conjugator?verb=${verb}&language=${language}`);
      const data = await response.json();
      console.log('fetched data', data);
      if (data.error) {
        setError(data.error);
      } else {
        setConjugationData(data.conjugations || []);
      }
    } catch (err) {
      setError('Failed to fetch conjugations');
    } finally {
      setLoading(false);
    }
  }

  function handleOverlayClick(e) {
    if (e.target.className === 'conjugator-overlay') {
      onClose();
    }
  }

  const isConjugatorPage = path.includes("conjugatorPage");

  return (
    <>
      {isOpen && (
        <div className={isConjugatorPage ? "conjugator-page-wrapper" : "conjugator-overlay"} onClick={!isConjugatorPage ? handleOverlayClick : undefined}>
          <div className="conjugator-container">
{!path.includes("learnView") &&
               <div className="verb-insert-field">
 <div className="verb-insert-field-title"><p>Insert Verb</p></div>
 <form onSubmit={(e) => { e.preventDefault(); fetchConjugations(); }}>
  <label><input className='verb-insert' type="text" placeholder='Write Verb' value={insertedVerb}
  onChange={(e) => setInsertedVerb(e.target.value)}/></label>
</form></div>}
            {!path.includes("conjugatorPage") && <button className="conjugator-close" onClick={onClose}>×</button>}

            {loading && <div className="conjugator-loading">Loading...</div>}

            {error && <div className="conjugator-error">Please insert a Verb </div>}

            {!loading && !error && conjugationData.length > 0 && (
              <div className="conjugator-grid">
                {conjugationData.map((box, index) => (
                  <div key={index} className="verb-term-conjugation-box">
                    <h3 className="conjugation-title">{box.title}</h3>
                    <ul className="conjugation-list">
                      {box.conjugations.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && conjugationData.length === 0 && (
              <div className="conjugator-empty">No conjugations found</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

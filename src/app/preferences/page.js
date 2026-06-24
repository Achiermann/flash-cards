"use client";

import { useSetLanguage } from "@/app/stores/useSetLanguage";
import { languageOptions } from "@/lib/languages";
import { topicClass } from "@/lib/topicColor";
import "@/styles/preferences.css";

export default function PreferencesPage() {
  const { language, setLanguage } = useSetLanguage();

  return (
    <div className="preferences">
      <h2 className="preferences-title">Preferences</h2>

      {/*//.2                 CONJUGATOR LANGUAGE                    */}
      <section className="preferences-section">
        <h3 className="preferences-section-title">Conjugator language</h3>

        <fieldset className="language-radio-list">
          {languageOptions.map((option) => {
            const selected = language === option.value;
            return (
              <label
                key={option.value}
                className={`language-radio${selected ? ` selected ${topicClass(option.value)}` : ""}`}
              >
                <input
                  type="radio"
                  name="conjugator-language"
                  value={option.value}
                  checked={selected}
                  onChange={() => setLanguage(option.value)}
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </fieldset>
      </section>
    </div>
  );
}

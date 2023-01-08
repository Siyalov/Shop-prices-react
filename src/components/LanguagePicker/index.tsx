import React, { useState } from "react"
import { Globe } from "react-bootstrap-icons"
import { useTranslation } from "react-i18next"
import "./style.css";

import { supportedLanguages, supportedLanguagesFullNames, flags } from "../../i18n/all";

export default function LanguagePicker() {
  const { t, i18n } = useTranslation();
  const [ isOpen, setIsOpen ] = useState(false);

  function switchSelectionBox() {
    setIsOpen(!isOpen);
  }

  return <>
    {isOpen ? <div className="language-picker-choices">
      {supportedLanguages.map(e => {
        return <div className="clickable" onClick={() => i18n.changeLanguage(e)}>
          <img
            width={24}
            src={
              // @ts-ignore TODO: fix
              flags[e] || ''
            }
            alt={e}/>
            {supportedLanguagesFullNames[e]}
        </div>
      })}
    </div> : ''}
    <a href="javascript: void" onClick={switchSelectionBox}>
      <Globe />
      <span>
        <img
          height={24}
          src={
            // @ts-ignore TODO: fix
            flags[i18n.language] || ''
          }
          alt={i18n.language}/>
      </span>
    </a>
  </>
}

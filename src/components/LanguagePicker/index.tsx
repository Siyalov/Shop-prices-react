import React, { useState } from "react";
import { Globe } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import "./style.css";

import {
  supportedLanguages,
  supportedLanguagesFullNames,
  flags,
} from "../../i18n/all";

export default function LanguagePicker() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  function switchSelectionBox() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      {isOpen ? (
        <div className="language-picker-choices">
          {supportedLanguages.map((lang) => {
            return (
              <div
                className={
                  "clickable language-list-item" +
                  (i18n.language === lang ? " active" : "")
                }
                onClick={() => i18n.changeLanguage(lang)}
              >
                <div
                  className="flag"
                  style={{
                    backgroundImage: `url("${flags[lang]}")`,
                  }}
                ></div>
                <span className="language-list-item-name">
                  {supportedLanguagesFullNames[lang]}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
      <a href="javascript: void" onClick={switchSelectionBox}>
        <Globe />
        <span>
          <img
            className="header-flag"
            height={20}
            src={
              // @ts-ignore TODO: fix
              flags[i18n.language] || ""
            }
            alt={i18n.language}
          />
        </span>
      </a>
    </>
  );
}

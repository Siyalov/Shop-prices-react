import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { supportedLanguages } from "./all";

import en from "./en.json";
import ru from "./ru.json";
import fi from "./fi.json";
import uk from "./uk.json";
import sv from "./sv.json";
import da from "./da.json";
import eo from "./eo.json";
import la from "./la.json";


// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: { translation: en },
  ru: { translation: ru },
  fi: { translation: fi },
  uk: { translation: uk },
  sv: { translation: sv },
  da: { translation: da },
  eo: { translation: eo },
  la: { translation: la },
};

let preferredLanguage = "en";
for (const lang of navigator.languages) {
  if ((supportedLanguages as readonly string[]).includes(lang)) {
    preferredLanguage = lang;
    break;
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: preferredLanguage, // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    fallbackLng: "en",
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

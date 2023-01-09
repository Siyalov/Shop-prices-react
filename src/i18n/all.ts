import * as icons from "./icons";

// NOTE: order matters!
export const supportedLanguages = [
  "en",
  "fi",
  "sv",
  "da",
  "ru",
  "uk",
  "la",
  "eo",
] as const;

// TODO: move to translation
export const supportedLanguagesFullNames = {
  en: "English",
  fi: "Finnish",
  sv: "Swedish",
  ru: "Russian",
  uk: "Ukraine",
  eo: "Esperanto",
  da: "Danish",
  la: "Latin",
};

export const flags = icons;

export interface LocaleName {
  lang: string;
  value: string;
  isAuto: boolean;
}

export function getLocaleFromList(list: Array<LocaleName>, lang: string) {
  for (const element of list) {
    if (element.lang === lang) {
      return element;
    }
  }
  return null;
}

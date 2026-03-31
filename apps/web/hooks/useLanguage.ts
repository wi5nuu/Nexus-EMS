import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LanguageState {
  lang: string;
  setLang: (lang: string) => void;
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set) => ({
      lang: "en",
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'nexus-language-storage',
    }
  )
);

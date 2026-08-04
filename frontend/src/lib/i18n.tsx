"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import zhMessages from "../../messages/zh.json";
import enMessages from "../../messages/en.json";

type Locale = "zh" | "en";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const messages: Record<Locale, Record<string, any>> = {
  zh: zhMessages,
  en: enMessages,
};

const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: any, path: string): string {
  const result = path.split(".").reduce((acc, part) => acc?.[part], obj);
  return typeof result === "string" ? result : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale | null;
    if (stored && (stored === "zh" || stored === "en")) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  }, []);

  const t = useCallback(
    (key: string): string => {
      return getNestedValue(messages[locale], key);
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export type { Locale };

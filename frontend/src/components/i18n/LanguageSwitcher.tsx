"use client";

import { useEffect, useRef, useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

const localeOptions: { value: Locale; label: string; flag: string }[] = [
  { value: "zh", label: "中文", flag: "🇨🇳" },
  { value: "en", label: "English", flag: "🇺🇸" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  const currentOption = localeOptions.find((o) => o.value === locale) || localeOptions[0];

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={switcherRef} className="relative void-language-switcher">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="void-language-button"
        aria-label="Switch language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentOption.label}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="void-language-backdrop" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div className="void-language-menu" role="listbox" aria-label="Language">
            <div>
              {localeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setLocale(option.value);
                    setIsOpen(false);
                  }}
                  className={`void-language-option ${
                    locale === option.value
                      ? "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                      : "text-theme hover:bg-theme-secondary"
                  }`}
                  role="option"
                  aria-selected={locale === option.value}
                >
                  <span className="flex items-center gap-2">
                    <span>{option.flag}</span>
                    <span>{option.label}</span>
                  </span>
                  {locale === option.value && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

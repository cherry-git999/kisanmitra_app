import React from "react";
import { Globe, ChevronRight } from "lucide-react";
import { useI18n, languageList } from "../i18n";

interface LanguageSelectionProps {
  onLanguageSelect: (language: string) => void;
}

const languages = languageList;

export default function LanguageSelection({
  onLanguageSelect,
}: LanguageSelectionProps) {
  const { t, setLanguage } = useI18n();
  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Globe size={80} className="mx-auto text-primary-500 mb-4" />
          <h1 className="text-3xl font-bold text-primary-500 mb-2">
            {t("chooseLanguage")}
          </h1>
          <p className="text-secondary-500">भाषा चुनें / భాష ఎంచుకోండి</p>
        </div>

        <div className="space-y-4">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                setLanguage(language.code as "en" | "hi" | "te");
                onLanguageSelect(language.code);
              }}
              className="w-full card hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-2xl font-bold text-primary-500 mb-1">
                    {language.name}
                  </div>
                  <div className="text-sm text-secondary-500">
                    {language.englishName}
                  </div>
                </div>
                <ChevronRight size={24} className="text-secondary-500" />
              </div>
            </button>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-secondary-500">{t("changeLater")}</p>
        </div>
      </div>
    </div>
  );
}

import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
      aria-label="Switch language"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm">
        {i18n.language === 'ko' ? 'EN' : 'KO'}
      </span>
    </button>
  );
};

import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="btn btn-ghost btn-sm md:btn-md"
      aria-label="Switch language"
    >
      <span className="text-sm md:text-base">
        {i18n.language === 'ko' ? '🇬🇧 EN' : '🇰🇷 KO'}
      </span>
    </button>
  );
};

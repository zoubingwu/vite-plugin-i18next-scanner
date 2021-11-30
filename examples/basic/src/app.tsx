import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function App() {
  const [t, i18n] = useTranslation();
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const handleLangChange = useCallback(() => {
    const nextLang = lang === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(nextLang);
    setLang(nextLang);
  }, [lang])

  return (
    <>
      <button onClick={handleLangChange}>
        {t('toggle')}
      </button>

      <h1>{t('hello world')}</h1>

      <h1>{t('welcome')}</h1>
    </>
  );
}

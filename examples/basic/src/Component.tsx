import React from "react";
import {useTranslation} from "react-i18next";

const Component = () => {
  const [t] = useTranslation()
  return <div>{t('hello from component')}</div>;
};

export default Component;
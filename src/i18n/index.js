import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { es } from "./languages";

const configurei18n = (store) => {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: () => {
        return "es";
      },
      ns: ["translations"],
      defaultNS: "translations",
      debug: true,
      interpolation: {
        escapeValue: false,
      },
      resources: {
        es,
      },
    });
};

export default configurei18n;

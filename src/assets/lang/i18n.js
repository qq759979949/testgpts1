import { createI18n } from 'vue-i18n'; //引入vue-i18n组件
import messages from './index';

const i18n = createI18n({
  fallbackLocale: 'zh',
  globalInjection: true,
  legacy: false, // you must specify 'legacy: false' option
  locale: 'zh',
  messages,
});

export const intl = (key) => {
  const isHas = i18n.global.te(key);
  return {
    d: (text) => {
      return isHas ? i18n.global.t(key) : text;
    },
  };
};

export default i18n;

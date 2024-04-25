// import { createPinia } from 'pinia';
// const pinia = createPinia();
// export default pinia;

import { useUserStore } from './modules/user';
import { useCommonApi } from './modules/commonApi';
import { defineStore, createPinia } from 'pinia';

const pinia = createPinia();

export { useUserStore, useCommonApi };
export default pinia;

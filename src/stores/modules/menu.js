import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menus', {
  state: () => ({
    activeIndex: '',
    leftMenuWidth: '210',
  }),
});

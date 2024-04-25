/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-11 16:07:04
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\stores\modules\navTag.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia';
import { intl } from '@/assets/lang/i18n';
export const homeTag = [{ title: intl('projectList').d('项目列表'), name: 'projectList' }];
export const useNavTagStore = defineStore('navTags', {
  state: () => ({
    tagList: JSON.parse(sessionStorage.getItem('tagList')) || homeTag,
    activedTag: '',
    keepAliveList: [],
  }),
  actions: {
    /**添加标签 */
    addTag(route) {
      if (route.name === 'homePage') return;
      const isHas = this.tagList.some((tag) => tag.name === route.name);
      if (!isHas && route.name) {
        this.tagList.push({
          name: route.name,
          title: route.meta.tagTitle,
          query: route.query,
          path: route.path,
        });
        sessionStorage.setItem('tagList', JSON.stringify(this.tagList));
      }
    },
    /**
     * 移除标签
     * @param {*} tag route
     * @param {*} router 路由跳转数据
     * @param {*} target 指定跳转到哪个页面，例如'todopage'
     * @param {*} isJump 是否跳转，默认不需要传
     */
    removeTag(tag, router, target, isJump) {
      const i = this.tagList.findIndex((el) => el.name === tag.name);
      if (i > -1) {
        if (this.tagList[i].name === this.activedTag) {
          if (!isJump) {
            router.push({ name: target || this.tagList[i - 1].name, query: this.tagList[i - 1].query });
          }
        }
        this.tagList.splice(i, 1);
        sessionStorage.setItem('tagList', JSON.stringify(this.tagList));
      }
    },

    /**
     * 添加缓存标签
     * @param {*} route 传入路由对象
     */
    addCacheTag(route) {
      const isHas = this.keepAliveList.some((e) => e === route.name);
      if (!isHas && route.name) {
        this.keepAliveList.push(route.name);
      }
    },
    /**
     * 移除缓存标签
     * @param {*} name 传入路由的name即可
     */
    removeCacheTag(name) {
      const index = this.keepAliveList.findIndex((item) => item === name);
      index >= 0 && this.keepAliveList.splice(index, 1);
    },

    /**清空缓存--每次进入新的项目就要清除之前项目的缓存，入口有项目列表和任务中心 */
    removeAllCache() {
      this.keepAliveList = [];
    },
  },
});

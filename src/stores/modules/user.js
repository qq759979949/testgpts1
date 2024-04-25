/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-19 16:08:05
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\stores\modules\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { defineStore } from 'pinia';
import router from '@/router';
import { useNavTagStore } from '@/stores/modules/navTag.js';
const { MODE, VITE_BASE_URL } = import.meta.env;

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    authorToken: null,
    // userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {}, //用户信息
    userInfo: window.$Cookies.get('userInfo') ? JSON.parse(window.$Cookies.get('userInfo')) : {}, //用户信息
  }),
  actions: {
    /**
     * 登录后设置用户登录信息
     * @userInfo {object} 用户信息
     * */
    login(userInfo) {
      window.$Cookies.set('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      this.authorToken = window.$Cookies.get('Admin-Token');
      this.userInfo = userInfo;
    },

    /**退出登录 */
    // logout() {
    //   const navTagStore = useNavTagStore();
    //   // 点击确认
    //   let param = {
    //     oauthRefreshToken: sessionStorage.getItem('RefreshToken'),
    //     oauthAccessToken: sessionStorage.getItem('AccessToken'),
    //   };
    //   window.$api.loginApi.Oauthlogout(param).then(() => {
    //     let arr = navTagStore.tagList.filter((v) => v.name !== 'projectList');
    //     arr.forEach((item) => {
    //       navTagStore.removeTag(item, router);
    //     });
    //     // window.$api.loginApi.logout().then(() => {
    //     sessionStorage.clear();
    //     window.$Cookies.remove('authorToken');
    //     window.$Cookies.remove('Admin-Token');
    //     window.$Cookies.remove('subAppToken');
    //     window.$Cookies.remove('userInfo');
    //     // window.$Cookies.remove('username');
    //     // window.$Cookies.remove('password');
    //     // window.$Cookies.remove('rememberMe');
    //     window.$Cookies.remove('JSESSIONID');
    //     // window.$Cookies.set('userInfo', '');
    //     // this.clearAllCookie();
    //     localStorage.removeItem('menList');
    //     localStorage.removeItem('buttonList');
    //     localStorage.removeItem('currentProjectRole');
    //     localStorage.removeItem('singleProjectRole');
    //     this.userInfo = {};
    //     this.authorToken = null;
    //     if (MODE === 'development') {
    //       router.push('/login');
    //     } else {
    //       window.location.href = VITE_BASE_URL;
    //     }

    //     // });
    //   });
    // },
    //清除所有cookie函数
    clearAllCookie() {
      var cookies = document.cookie.split(';');
      // 遍历所有cookie，将它们都删除
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf('=');
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      }
    },
  },
});

/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-04-19 14:56:05
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-19 16:05:39
 * @FilePath: \daima\src\permission.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ElLoading } from "element-plus";
import router from "@/router";
import { useMenuStore } from "./stores/modules/menu";
import { useBreadcrumbStore } from "./stores/modules/breadcrumb";
import { useNavTagStore } from "./stores/modules/navTag";
import { qiankunWindow } from "vite-plugin-qiankun/dist/helper";

// 白名单，里面是路由对象的name
const WhiteList = ["login"];

let loadingInstance = null;
// 通过路由信息获取面包屑数据;
function getSingleBreadcrumb(route) {
  let breadcrumbList = [];
  route.matched.forEach((el) => {
    if (el.meta.breadcrumb) {
      breadcrumbList.push(...el.meta.breadcrumb);
    }
  });
  return breadcrumbList;
}

function getMicroBreadcrumb(route) {
  let breadcrumbList = [];
  route.matched.forEach((el) => {
    const breadcrumb = el.meta.breadcrumb;
    if (breadcrumb) {
      if (route.name === el.name) {
        breadcrumb[breadcrumb.length - 1].name = route.name;
      }
      breadcrumb.forEach((i) => {
        if (i.name) {
          i.path = router.resolve({ name: i.name }).fullPath;
        }
      });
      breadcrumbList.push(...breadcrumb);
    }
  });
  return breadcrumbList;
}

const getBreadcrumb = qiankunWindow.__POWERED_BY_QIANKUN__
  ? getMicroBreadcrumb
  : getSingleBreadcrumb;

// vue-router4的路由守卫不再是通过next放行，而是通过return返回true或false或者一个路由地址
router.beforeEach(async (to) => {
  // if (to.name !== "login" && !sessionStorage.getItem("authorToken")) {
  //   router.push({ name: "login" });
  //   return;
  // }
  loadingInstance = ElLoading.service({
    lock: true,
    // text: '正在加载数据，请稍候~',
    background: "rgba(255, 255, 255, 0.7)",
  });
  if (WhiteList.includes(to.name)) {
    return true;
  }
  // 路由跳转时确定当前菜单ID
  const menuStore = useMenuStore();
  menuStore.activeIndex = to.meta.menuId;

  // 路由跳转时确定当前面包屑
  const breadcrumbStore = useBreadcrumbStore();
  breadcrumbStore.breadcrumb = getBreadcrumb(to);

  // 路由跳转时确定当前导航栏
  const navTagStore = useNavTagStore();
  navTagStore.activedTag = to.name;
  navTagStore.addTag(to);
});

router.afterEach((to) => {
  loadingInstance.close();
});

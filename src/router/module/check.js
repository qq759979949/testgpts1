/*
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-05 08:23:31
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-08 14:22:47
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\router\module\check.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { intl } from '@/assets/lang/i18n';
/**考核激励路由 */
// const { MODE } = import.meta.env;
const checkRoute = [
  {
    path: '/project/examineIncentive',
    name: 'examineIncentive',
    meta: {
      menuId: '3-16',
      breadcrumb: [{ title: intl('projectList').d('项目列表'), name: 'projectList' }, { title: '考核激励' }],
      tagTitle: '考核激励',
    },
    component: () => import('@/views/examineIncentive/index.vue'),
    // component: () => (MODE === 'development' ? import('@/views/examineIncentive/index.vue') : import('@/views/404.vue')),
  },
];
export default checkRoute;

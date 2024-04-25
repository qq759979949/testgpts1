import { getActionMenus, getCustomizeHeaders, getTableViewColumns, pagingSearchUser } from '@/api/common';
import { formatData } from './utils';
import { ElMessage } from 'element-plus';
import { useNavTagStore } from '@/stores/modules/navTag.js';
const menuList = [
  {
    title: '单项目首页',
    icon: 'icon-homePage',
    name: 'projectDetail',
    id: '3-1',
  },
  {
    title: '团队',
    icon: 'icon-tuandui',
    name: 'projectTeam',
    id: '3-2',
  },
  {
    title: '目标/指标',
    icon: 'icon-zhibiao',
    name: 'target',
    id: '3-3',
  },
  {
    title: '产品配置',
    icon: 'icon-peizhi',
    // name: 'productConfig',
    name: 'addConfig',
    id: '3-4',
  },
  {
    title: '计划',
    icon: 'icon-jihua',
    name: 'projectPlan',
    id: '3-5',
  },
  {
    title: '文件',
    icon: 'icon-wenjian',
    name: 'projectFiles',
    id: '3-6',
  },
  {
    title: '基线',
    icon: 'icon-jixian',
    name: 'baseline',
    id: '3-7',
  },
  {
    title: '评审',
    icon: 'icon-pingshen',
    name: 'projectReview',
    id: '3-8',
  },
  {
    title: '变更',
    icon: 'icon-biangeng',
    name: 'projectChange',
    id: '3-9',
  },
  {
    title: '问题',
    icon: 'icon-shuoming',
    name: 'projectQuestion',
    id: '3-10',
  },
  {
    title: '风险',
    icon: 'icon-fengxian',
    name: 'projectRisk',
    id: '3-11',
  },
  {
    title: '报表',
    icon: 'icon-baobiao',
    name: 'reportForms',
    id: '3-15',
  },
  {
    title: '考核激励',
    icon: 'icon-yanshou-qu',
    name: 'examineIncentive',
    id: '3-16',
  },
  {
    title: '评价验收',
    icon: 'icon-pingjia',
    name: 'projectEvaluate',
    id: '3-12',
  },
  {
    title: '相关进程',
    icon: 'icon-renwujincheng',
    name: 'relatedProcesses',
    id: '3-14',
  },
  {
    title: '薪酬包',
    icon: 'icon-qiandai',
    name: 'payPacket',
    id: '3-13',
  },
  {
    title: '产品和竞品配置参数',
    icon: 'icon-peizhi',
    name: 'competitorConfig',
    id: '3-17',
  },
];
const menuListCommon = [
  {
    title: '单项目首页',
    icon: 'icon-homePage',
    name: 'projectDetail',
    id: '3-1',
  },
  {
    title: '团队',
    icon: 'icon-tuandui',
    name: 'projectTeam',
    id: '3-2',
  },
  {
    title: '计划',
    icon: 'icon-jihua',
    name: 'projectPlan',
    id: '3-5',
  },
  {
    title: '文件',
    icon: 'icon-wenjian',
    name: 'projectFiles',
    id: '3-6',
  },
  {
    title: '变更',
    icon: 'icon-biangeng',
    name: 'projectChange',
    id: '3-9',
  },
  {
    title: '问题',
    icon: 'icon-shuoming',
    name: 'projectQuestion',
    id: '3-10',
  },
  {
    title: '风险',
    icon: 'icon-fengxian',
    name: 'projectRisk',
    id: '3-11',
  },
  {
    title: '报表',
    icon: 'icon-baobiao',
    name: 'reportForms',
    id: '3-15',
  },
  {
    title: '考核激励',
    icon: 'icon-yanshou-qu',
    name: 'examineIncentive',
    id: '3-16',
  },
  {
    title: '相关进程',
    icon: 'icon-renwujincheng',
    name: 'relatedProcesses',
    id: '3-14',
  },
];
const menuListINfo = [
  {
    title: '单项目首页',
    icon: 'icon-homePage',
    name: 'projectDetail',
    id: '3-1',
  },
  {
    title: '团队',
    icon: 'icon-tuandui',
    name: 'projectTeam',
    id: '3-2',
  },
  {
    title: '目标/指标',
    icon: 'icon-zhibiao',
    name: 'target',
    id: '3-3',
  },
  {
    title: '计划',
    icon: 'icon-jihua',
    name: 'projectPlan',
    id: '3-5',
  },
  {
    title: '文件',
    icon: 'icon-wenjian',
    name: 'projectFiles',
    id: '3-6',
  },
  {
    title: '变更',
    icon: 'icon-biangeng',
    name: 'projectChange',
    id: '3-9',
  },
  {
    title: '问题',
    icon: 'icon-shuoming',
    name: 'projectQuestion',
    id: '3-10',
  },
  {
    title: '风险',
    icon: 'icon-fengxian',
    name: 'projectRisk',
    id: '3-11',
  },
  {
    title: '报表',
    icon: 'icon-baobiao',
    name: 'reportForms',
    id: '3-15',
  },
  {
    title: '考核激励',
    icon: 'icon-yanshou-qu',
    name: 'examineIncentive',
    id: '3-16',
  },
  {
    title: '评价验收',
    icon: 'icon-pingjia',
    name: 'projectEvaluate',
    id: '3-12',
  },
  {
    title: '相关进程',
    icon: 'icon-renwujincheng',
    name: 'relatedProcesses',
    id: '3-14',
  },
  {
    title: '薪酬包',
    icon: 'icon-qiandai',
    name: 'payPacket',
    id: '3-13',
  },
];
const commonApisFun = {
  // 通用按钮
  async getBtnMenus(parmas) {
    const { success, data } = await getActionMenus(parmas);
    if (success) {
      return data;
    }
  },
  // 通用表头
  async getColums(tableColums, allColums) {
    let columsStr = '';
    // 获取表头
    await getCustomizeHeaders(tableColums).then((res) => {
      if (res.success) {
        columsStr = res.data.labelList.replace(/ /g, '');
      } else {
        ElMessage({
          message: res,
          type: 'error',
        });
      }
    });
    // 获取表头所有数据
    let colunmsData = [];
    let allColumsData = [];
    await getTableViewColumns(allColums).then((res) => {
      let temp = res.data.columns;
      colunmsData = columsStr.split(',').map((v) => {
        return {
          title: temp[v],
          dataIndex: v,
          ellipsis: true,
          width: 130,
        };
      });
      for (let key in temp) {
        let obj = {
          title: temp[key],
          dataIndex: key,
          ellipsis: true,
          width: 130,
        };
        allColumsData.push(obj);
      }
    });
    return {
      columsStr,
      colunmsData,
      allColumsData,
    };
  },

  // 获取全部表头
  async getAllColumns(params, params1) {
    // params为显示表头的参数， params1为全部表头的参数
    let displayHeader = [];
    let allHeader = [];
    let columnsStr = '';
    await window.$api.commonApi.listSetupColumn(params).then((res) => {
      if (res.success) {
        columnsStr = res.data.column;
        for (let key in columnsStr) {
          let obj = {
            title: columnsStr[key],
            dataIndex: key,
            ellipsis: {
              placement: 'right-end',
            },
            filters: columnsStr[key].includes('时间') ? 'date' : 'select',
            minWidth: 120,
          };
          displayHeader.push(obj);
        }
      } else {
        window.$message.error(res);
      }
    });
    await window.$api.projectChangeApi.listDictItem(params1).then((res) => {
      if (res.success) {
        allHeader = JSON.parse(res.data[0].itemValue);
      } else {
        window.$message.error(res.message);
      }
    });
    return {
      displayHeader,
      allHeader,
      columnsStr,
    };
  },

  // 通用创建布局
  async getCreateLayoutData(parmas, url) {
    let formList = [];
    let submitData = {};
    await window.$api.commonApi[url ? url : 'getCreateLayout'](parmas).then((res) => {
      if (res.success) {
        let datas = res.data;
        // datas.forEach((v) => {
        //   v.items.forEach((e) => {
        //     submitData[e.name] = '';
        //   });
        // });
        formList = formatData(datas, submitData);
      } else {
        formList = [];
      }
    });
    return {
      formList,
      submitData,
    };
  },

  // 通用查人接口
  async searchUser(parmas) {
    let data = [];
    await pagingSearchUser(parmas).then((res) => {
      if (res.success) {
        data = res.data.rows;
      }
    });
    return data;
  },

  // 通用编辑布局接口
  async getEditLayoutData(parmas, url) {
    let formList = [];
    let submitData = {};
    await window.$api.commonApi[url ? url : 'getEditLayout'](parmas).then((res) => {
      if (res.success) {
        let datas = res.data;
        // datas.forEach((v) => {
        //   v.items.forEach((e) => {
        //     submitData[e.name] = '';
        //   });
        // });
        formList = formatData(datas, submitData);
      } else {
        formList = [];
      }
    });
    return {
      formList,
      submitData,
    };
  },

  // 通过项目OID和账号名称获取该账号所属全部角色名称集合
  async _getRoleNamesByUserName(oid, name) {
    let currentProjectRole = [];
    let params = {
      projectOid: oid,
      userName: name,
    };
    await window.$api.commonApi.getRoleNamesByUserName(params).then((res) => {
      if (res.success) {
        currentProjectRole = res?.data;
        localStorage.setItem('currentProjectRole', JSON.stringify(currentProjectRole));
      } else {
        window.$message.error(res.message);
      }
    });
  },

  // 通过项目ID和账号名称获取该项目下账号所属角色的全部权限组的权限集合
  async _getPermissionByProjectldAndUserName(oid, name) {
    let btnRole = [];
    let params = {
      projectOid: oid,
      userName: name,
    };
    await window.$api.commonApi.getPermissionByProjectldAndUserName(params).then((res) => {
      if (res.data && res.data.length > 0) {
        btnRole = res?.data.map((e) => {
          return e.path;
        });
        localStorage.setItem('singleProjectRole', JSON.stringify(btnRole));
      } else {
        localStorage.setItem('singleProjectRole', JSON.stringify(['a:a:a']));
      }
    });
  },

  // 通过项目OID和账号名称获取该账号所属全部组集合
  async _getGroupNamesByUserName(name) {
    let btnRole = [];
    let params = {
      userName: name,
    };
    await window.$api.commonApi.getGroupNamesByUserName(params).then((res) => {
      if (res.data && res.data.length > 0) {
        btnRole = res?.data;
        localStorage.setItem('groupRole', JSON.stringify(btnRole));
      } else {
        localStorage.setItem('groupRole', JSON.stringify(['a:a:a']));
      }
    });
  },
  // 获取菜单
  async getProjectMenuList(oid, name, type) {
    let newMenuList = [];
    const router = useRouter();
    const navTagStore = useNavTagStore();
    if (type === '产品开发类项目' || type === '制造技术类项目' || type === '信息技术类项目') {
      let params = {
        projectOid: oid,
        userName: name,
      };
      await window.$api.commonApi.getProjectPermission(params).then((res) => {
        if (res.success) {
          const projectMenu = menuList.filter((item) => {
            if (res.data.includes(item.name)) {
              return item;
            }
          });
          const newD = ['projectList', 'warningTask', 'toDoPage', 'reportsTools', 'createProject', 'productConfig', 'indexLibrary'];
          const newData = [...res.data, ...newD];
          navTagStore.tagList.forEach((item) => {
            if (newData.includes(item.name)) {} else {
              navTagStore.removeTag(item, router);
            }
          });
          newMenuList = projectMenu;
          if (newMenuList.length > 0) {
            sessionStorage.setItem('projectMenu', JSON.stringify(projectMenu));
          }
        } else {
          window.$message.error(res.message);
        }
      });
    } 
    // else if (type === '制造技术类项目' || type === '信息技术类项目') {
    //   const newD1 = menuListINfo.map((item) => {
    //     return item.name;
    //   });
    //   const newD = ['projectList', 'warningTask', 'toDoPage', 'reportsTools', 'createProject', 'productConfig', 'indexLibrary'];
    //   const newData = [...newD1, ...newD];
    //   navTagStore.tagList.forEach((item) => {
    //     if (newData.includes(item.name)) {} else {
    //       navTagStore.removeTag(item, router);
    //     }
    //   });
    //   newMenuList = menuListINfo;
    //   sessionStorage.setItem('projectMenu', JSON.stringify(menuListINfo));
    // } 
    else {
      const newD1 = menuListCommon.map((item) => {
        return item.name;
      });
      const newD = ['projectList', 'warningTask', 'toDoPage', 'reportsTools', 'createProject', 'productConfig', 'indexLibrary'];
      const newData = [...newD1, ...newD];
      navTagStore.tagList.forEach((item) => {
        if (newData.includes(item.name)) {} else {
          navTagStore.removeTag(item, router);
        }
      });
      newMenuList = menuListCommon;
      sessionStorage.setItem('projectMenu', JSON.stringify(menuListCommon));
    }
    return newMenuList;
  },
};

export default commonApisFun;

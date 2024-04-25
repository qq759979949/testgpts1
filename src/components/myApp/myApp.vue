<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-18 19:10:42
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\components\myApp\myApp.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="title">
    我的应用
    <el-button class="title-btn" size="small" @click="configApp">
      <el-icon><Edit /></el-icon>
      编辑
    </el-button>
  </div>
  <div class="section-box" v-loading="contentLoading">
    <div v-for="item in myApp" class="app-item" @click="goApp(item)" :key="item.id">
      <i class="iconfont btn-icon" :class="item.imageUrl" />
      <div class="app-text">{{ item.functionName }}</div>
    </div>
    <div class="app-item" @click="openFinance" v-if="roleList.includes('财务管理组')">
      <i class="iconfont btn-icon" :class="'icon-qiandai'" />
      <div class="app-text">财务信息</div>
    </div>
  </div>
  <el-dialog v-model="showAppConfig" title="我的应用编辑" width="60%">
    <div class="dialog-box">
      <section class="section-top">
        <div class="title">
          当前应用
          <span class="text-tip">（可拖拽排序）</span>
        </div>
        <div class="app-box">
          <draggable v-model="tempApp" item-key="id" animation="200">
            <template #item="{ element }">
              <div class="app-item">
                <i class="iconfont" :class="element.icon"></i>
                <span>{{ element.description }}</span>
                <el-icon class="btn-icon" @click="delApp(element)"><RemoveFilled /></el-icon>
              </div>
            </template>
          </draggable>
        </div>
      </section>
      <section class="section-bottom">
        <div class="title">更多应用</div>
        <div class="app-box">
          <div v-for="item in appStore" :key="item.id" class="app-item">
            <i class="iconfont" :class="item.icon" />
            <span>{{ item.description }}</span>
            <el-icon class="btn-icon" @click="addApp(item)"><CirclePlusFilled /></el-icon>
          </div>
        </div>
      </section>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showAppConfig = false">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="confirmConfig">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <pisx-dialog :isShow="isShowStatus" :title="'设置状态'" :width="'20%'" @close="isShowStatus = false" @submit="setStatus" :loading="loading">
    <template #content>
      <el-form-item :label="'目标状态: '">
        <el-select v-model="selectStatus" style="width: 100%">
          <el-option v-for="(item, index) of optionList" :key="index" :value="item.innerName" :label="item.display"></el-option>
        </el-select>
      </el-form-item>
    </template>
  </pisx-dialog>
  <el-dialog v-model="showSummaryDeliverables" title="交付物汇总" width="80%">
    <deliverablesSummary></deliverablesSummary>
  </el-dialog>
  <financeDesk :size="'40%'" v-model:isShow="isShowFinance" :title="'财务信息'" :info="info" @downLoad="downLoad"></financeDesk>
</template>

<script>
// import * as _ from 'lodash';
import draggable from 'vuedraggable';
import { defineComponent, reactive, toRefs, onMounted, markRaw, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { getFuncList, setupFunc, listDictItem } from '@/api/homePage.js';
import { WarningFilled } from '@element-plus/icons-vue';
import { useNavTagStore } from '@/stores/modules/navTag.js';
import { permissionList } from '@/views/projectList/data.js';
import financeDesk from '@/views/projectInitiation/components/financeDesk.vue';
import deliverablesSummary from '@/views/projectPlan/deliverablesSummary.vue';
import { useCommonHandler } from '@/hooks';
// import { ro } from 'element-plus/es/locale';
let permissionStorage = JSON.parse(localStorage.getItem('buttonList')) || ['a:a:a']; // 获取中台的按钮权限集合
let singleProjectPermissionsList = JSON.parse(localStorage.getItem('singleProjectRole')) || ['a:a:a']; // 获取账号在系统中的按钮权限
export default defineComponent({
  components: {
    draggable,
    financeDesk,
    deliverablesSummary,
  },
  props: {
    oid: String, // 项目的oid
  },
  emits: ['initData'],
  setup(props, { emit }) {
    const api = window.$api;
    const { proxy: that } = getCurrentInstance();
    const navTagStore = useNavTagStore();
    const router = useRouter();
    const app = reactive({
      userInfo: JSON.parse(window.$Cookies.get('userInfo')),
      roleList: JSON.parse(localStorage.getItem('groupRole')) || [],
      isShowFinance: false, // 财务信息抽屉
      info: [],
      selectStatus: '', // 状态值
      optionList: [], //
      isShowStatus: false, // 设置状态
      showAppConfig: false,
      tempApp: [],
      myApp: [],
      isLoading: false,
      appList: [
        {
          id: '1',
          icon: 'icon-wenti',
          path: '/project/projectQuestion',
          name: '创建问题',
        },
        {
          id: '2',
          icon: 'icon-fengxian',
          path: '/project/projectRisk',
          name: '创建风险',
        },
        {
          id: '3',
          icon: 'icon-biaodan',
          path: '',
          name: '创建评审',
        },
        {
          id: '4',
          icon: 'icon-renwu',
          path: '',
          name: '创建项目任务书',
        },
        {
          id: '5',
          icon: 'icon-biaodan',
          path: '',
          name: '创建结项验收表',
        },
        {
          id: '6',
          icon: 'icon-bianji',
          path: '/project/updateProject',
          name: '编辑项目',
        },
        {
          id: '7',
          icon: 'icon-xiangmujiaofuwu',
          path: '',
          name: '上传交付物',
        },
        {
          id: '8',
          icon: 'icon-xiangmushuju',
          path: '',
          name: '汇总项目数据',
        },
        {
          id: '9',
          icon: 'icon-xiangmuguanli',
          path: '',
          name: '更新进度',
        },
        {
          id: '10',
          icon: 'icon-jiankong',
          path: '',
          name: '设置状态',
        },
        {
          id: '11',
          icon: 'icon-biaodan',
          path: '',
          name: '结项检查',
        },
        {
          id: '12',
          icon: 'icon-tuisong',
          path: '',
          name: '推送项目数据到thingworx',
        },
      ],
      appStore: [],
      loading: false,
      showSummaryDeliverables: false,
      contentLoading: false,
      projectType: JSON.parse(sessionStorage.getItem('currentProject')).type,
    });

    //设置状态确定按钮
    const setStatus = () => {
      if (app.selectStatus === '') return window.$message.warning('请选择目标状态!');
      window.$ElMessageBox
        .confirm(`更改项目状态，会终止正在运行的立项流程或者定级流程!`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          app.loading = true;
          let params = new FormData();
          params.append('oid', props.oid);
          params.append('state', app.selectStatus);
          api.projectApi.editProjectState(params).then((res) => {
            if (res.success) {
              app.loading = false;
              window.$message.success('状态设置成功!');
              let newState = app.optionList.filter((item) => item.innerName === app.selectStatus);
              let project = JSON.parse(sessionStorage.getItem('currentProject'));
              project['state'] = newState[0].display;
              sessionStorage.setItem('currentProject', JSON.stringify(project));
              app.isShowStatus = false;
              emit('initData');
            } else {
              app.loading = false;
              window.$message.error(res.message);
            }
          });
        })
        .catch(() => {});
    };

    // const appStore = computed(() => {
    //   let arr = []
    //   app.appList.forEach(ele => {
    //     let obj = app.tempApp.find(item => item.id === ele.id)
    //     if (!obj) {
    //       arr.push(ele)
    //     }
    //   })
    //   return arr
    // })

    // const getMyApp = () => {
    //   getUserApp().then(res => {
    //     if (!res.data.myAppList) {
    //       app.myApp = []
    //     } else {
    //       let arr = res.data.myAppList.split(',')
    //       app.myApp = []
    //       arr.forEach(item => {
    //         let obj = app.appList.find(v => v.id === item)
    //         app.myApp.push(obj)
    //       })
    //     }
    //   })
    // }
    const configApp = () => {
      app.showAppConfig = true;
      funcListAll();
      // app.tempApp = _.cloneDeep(app.myApp)
    };
    const goApp = (item) => {
      const currentProject = JSON.parse(sessionStorage.getItem('currentProject'));
      const projectState = sessionStorage.getItem('projectState');
      if (item.functionName === '项目定级') {
        if (currentProject.type === '产品开发类项目' || currentProject.type === '信息技术类项目' || currentProject.type === '制造技术类项目') {
          // console.log(currentProject.state === '工作进行中')
          window.$api.commonApi.checkStarProcess({ oid: currentProject.oid, processTemplate: 'SDLG_ProjectRankingWF' }).then((res) => {
            if (res.success) {
              router.push({ name: 'createProjectGrading', query: { oid: currentProject.oid } });
            } else {
              window.$message.error(res.message);
            }
          });
          // if (currentProject.state !== '工作进行中') {
          //   ElMessageBox.confirm('只允许对“工作进行中”的项目发起定级流程！', '', {
          //     confirmButtonText: '确定',
          //     cancelButtonText: '取消',
          //     type: 'error',
          //     icon: markRaw(WarningFilled),
          //   });
          // } else {
          //   router.push({ name: 'createProjectGrading', query: { oid: currentProject.oid } });
          // }
        } else {
          ElMessageBox.confirm('当前类型的项目不支持发起定级流程！', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error',
            icon: markRaw(WarningFilled),
          });
        }
      } else if (item.functionName === '设置状态') {
        app.selectStatus = '';
        app.isShowStatus = true;
        QueryDocStates();
      } else if (item.functionName === '更新进度') {
        ElMessageBox.confirm('更新如下内容：WBS节点实际完成时间、活动状态、完成百分比；', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              // 开启按钮加载
              instance.confirmButtonLoading = true;
              window.$api.projectApi
                .updateProjectProgress({ oid: currentProject.oid })
                .then((res) => {
                  if (res.success) {
                    window.$message.success('操作成功');
                    done();
                  } else {
                    window.$message.error(res.message);
                  }
                })
                .catch(() => {})
                .finally(() => {
                  // 接口回调结束，关闭按钮加载
                  instance.confirmButtonLoading = false;
                });
            } else {
              done();
            }
          },
        }).catch(() => {});
        // })
        //   .then(() => {
        //     window.$api.projectApi.updateProjectProgress({ oid: currentProject.oid }).then((res) => {
        //       if (res.success) {
        //         window.$message.success('操作成功');
        //       } else {
        //         window.$message.error(res.message);
        //       }
        //     });
        //   })
        //   .catch(() => {});
      } else if (item.functionName === '项目立项') {
        window.$api.commonApi.checkStarProcess({ oid: currentProject.oid, processTemplate: 'PIProjectStartWf' }).then((res) => {
          if (res.success) {
            router.push({ path: item.functionUrl });
          } else {
            window.$message.error(res.message);
          }
        });
      } else if (item.functionName === '删除项目') {
        if (projectState === '废止') {
          ElMessageBox.confirm('您确定要删除项目吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              window.$api.projectApi.deleteProject({ oid: currentProject.oid }).then((res) => {
                if (res.success) {
                  window.$message.success('操作成功');
                  navTagStore.tagList = [{ name: 'projectList', title: '项目列表' }];
                  router.push({ name: navTagStore.tagList[0].name, query: navTagStore.tagList[0].query ? navTagStore.tagList[0].query : {} });
                } else {
                  window.$message.error(res.message);
                }
              });
            })
            .catch(() => {});
        } else {
          window.$message.error('只能删除废止状态的项目');
        }
      } else if (item.functionName === '创建变更') {
        if (currentProject.type === '产品开发类项目' || currentProject.type === '制造技术类项目' || currentProject.type === '信息技术类项目') {
          if (projectState === '工作进行中') {
            window.$api.projectChangeApi.hasChangeProcess({ oid: currentProject.oid }).then((res) => {
              if (res.success) {
                if (!res.data) {
                  router.push({ name: 'createProjectChange' });
                } else {
                  window.$message.error('存在正在进行的变更流程，不可以再发起变更！');
                }
              } else {
                window.$message.error(res.message);
              }
            });
          } else {
            window.$message.error('该项目状态下不支持发起变更！');
          }
        } else {
          window.$message.error('该项目类型不支持发起变更！');
        }
      } else if (item.functionName === '交付物汇总') {
        app.showSummaryDeliverables = true;
      } else if (item.functionName === '编辑项目') {
        if (projectState === '待处理') {
          router.push({ path: item.functionUrl });
        } else {
          window.$message.error('当前状态下项目不可编辑');
        }
      } else if (item.functionName === '创建评审') {
        projectState !== '' ? router.push({ path: item.functionUrl }) : window.$message.warning('项目类型为空,不允许创建');
      } else {
        if (item.functionUrl) {
          router.push({ path: item.functionUrl });
        }
      }
    };
    const confirmConfig = () => {
      app.isLoading = true;
      const userFunctionAreaList = app.tempApp.map((item) => {
        const obj = {};
        obj.functionName = item.description;
        obj.functionUrl = item.path;
        obj.imageUrl = item.icon;
        return obj;
      });
      const params = {
        userFunctionAreaList,
        userFunctionType: '3',
      };
      setupFunc(params).then((res) => {
        if (res.success) {
          app.isLoading = false;
          funcList();
          app.showAppConfig = false;
        } else {
          app.isLoading = false;
          that.$message.error(res.message);
        }
      });
      // app.isLoading = true
      // let tempArr = []
      // app.tempApp.forEach(item => {
      //   tempArr.push(item.id)
      // })
      // setUserApp({
      //   myAppList: tempArr.join()
      // }).then(res => {
      //   app.isLoading = false
      //   getMyApp()
      //   app.showAppConfig = false
      // })
    };
    const addApp = (obj) => {
      app.tempApp.push(obj);
      app.appStore = app.appStore.filter((item) => item.id !== obj.id);
    };
    const delApp = (obj) => {
      app.appStore.push(obj);
      app.tempApp = app.tempApp.filter((item) => item.id !== obj.id);
    };
    // 获取应用
    const funcList = async () => {
      app.contentLoading = true;
      app.myApp = [];
      app.tempApp = [];
      await getFuncList({ functionType: '3' }).then((res) => {
        if (res.code === 200) {
          let arr = []; // 获取权限对应的中文名称
          permissionList.forEach((e) => {
            // 如果中台权限列表里面的权限在应用中存在,就把有权限的模块提取出来。
            if (permissionStorage.includes(e.value) || singleProjectPermissionsList.includes(e.value) || e.label === '交付物汇总') {
              arr.push(e.label);
            }
          });
          // 在展示的应用中过滤出来有中台权限的应用
          let postPermission = res.data.filter((e) => {
            return arr.includes(e.functionName);
          });
          if (app.projectType !== '产品开发类项目') {
            postPermission = postPermission.filter((item) => item.functionName !== '创建评审');
          }
          app.myApp = postPermission ? postPermission : [];
          app.tempApp = postPermission
            ? postPermission.map((item) => {
                item.description = item.functionName;
                item.icon = item.imageUrl;
                item.path = item.functionUrl;
                return item;
              })
            : [];
          app.contentLoading = false;
        } else {
          app.contentLoading = false;
          that.$message.error(res.message);
        }
      });
    };
    // 获取全部应用
    const funcListAll = async () => {
      app.appStore = [];
      await listDictItem({ dictCode: 'myApp' }).then((res) => {
        if (res.code === 200) {
          const newArr = res.data.map((item) => {
            item.icon = item.itemValue.split(',')[0];
            item.path = item.itemValue.split(',')[1] ? item.itemValue.split(',')[1] : '';
            return item;
          });
          const newArr1 = app.tempApp.map((item) => {
            return item.description;
          });
          let arr = []; // 获取权限对应的中文名称
          permissionList.forEach((e) => {
            // 如果中台权限列表里面的权限在应用中存在,就把有权限的模块提取出来。
            if (permissionStorage.includes(e.value) || singleProjectPermissionsList.includes(e.value) || e.label === '交付物汇总') {
              arr.push(e.label);
            }
          });
          // 在展示的应用中过滤出来有中台权限的应用
          let postPermission = newArr.filter((e) => {
            return arr.includes(e.description);
          });
          if (app.projectType !== '产品开发类项目') {
            postPermission = postPermission.filter((item) => item.description !== '创建评审');
          }
          app.appStore = postPermission.filter((item) => {
            if (!newArr1.includes(item.description)) {
              return item;
            }
          });
        } else {
          that.$message.error(res.message);
        }
      });
    };

    // 获取项目的流程状态
    const QueryDocStates = () => {
      api.fileApi.queryDocStates({ oid: props.oid }).then((res) => {
        if (!res?.success) return window.$message.error(res.message);
        app.optionList = res.data;
        res.data.forEach((item) => {
          if (item.display === sessionStorage.getItem('projectState')) {
            app.selectStatus = item.innerName;
          }
        });
      });
    };

    // 打开财务审核
    const openFinance = () => {
      app.isShowFinance = true;
      getFinancialInfo(props.oid);
    };

    // 获取财务信息
    const getFinancialInfo = (oid) => {
      let params = new FormData();
      params.append('projectOid', oid);
      api.projectInitiationApi.queryFinancialInfo(params).then((res) => {
        if (res.success) {
          let arr = res.data; // 相关评审的布局
          let newArr = [];
          for (var key in arr) {
            newArr.push({
              groupName: key,
              items: arr[key],
            });
          }
          app.info = newArr; // 查看财务信息的抽屉
        } else {
          window.$message.error(res.message);
        }
      });
    };

    // 财务信息下载接口
    const downLoad = (e, fileName) => {
      let params = new FormData();
      params.append('oid', e);
      api.commonApi.downloadContent(params).then((res) => {
        if (!res) return window.$message.error('下载失败');
        useCommonHandler.download(res, fileName);
      });
    };

    onMounted(() => {
      // getMyApp()
      funcList();
    });

    return {
      ...toRefs(app),
      configApp,
      goApp,
      confirmConfig,
      addApp,
      delApp,
      funcList,
      funcListAll,
      setStatus,
      QueryDocStates,
      getFinancialInfo,
      downLoad,
      openFinance,
    };
  },
});
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  font-weight: 600;
  height: 24px;
  line-height: 24px;
  margin-bottom: 16px;
  .title-btn {
    margin-left: 6px;
    transform: translateY(-2px);
  }
}
.section-box {
  .app-item {
    display: inline-block;
    margin-right: 40px;
    cursor: pointer;
    .btn-icon {
      width: 60px;
      height: 60px;
      display: inline-block;
      background: #f6f9fe;
      border-radius: 12px;
      font-size: 30px;
      line-height: 60px;
      text-align: center;
      color: var(--el-color-primary);
      margin-bottom: 8px;
    }
    .app-text {
      text-align: center;
      color: #666;
      font-size: 14px;
    }
  }
  .app-item:hover {
    i {
      background: #f9fcff;
    }
  }
}
.dialog-box {
  min-height: 400px;
  section {
    .title {
      margin-bottom: 8px;
      font-size: 14px;
    }
    .app-item {
      display: inline-block;
      margin-right: 8px;
      margin-bottom: 8px;
      border: 1px solid #ddd;
      width: 260px;
      height: 50px;
      border-radius: 4px;
      line-height: 48px;
      padding: 0 12px;
      .iconfont {
        height: 25px;
        width: 25px;
        border-radius: 4px;
        display: inline-block;
        text-align: center;
        line-height: 25px;
        background: #f6f9fe;
        margin-right: 8px;
        color: var(--el-color-primary);
      }
      .btn-icon {
        float: right;
        color: #ccc;
        font-size: 20px;
        transform: translateY(14px);
        cursor: pointer;
      }
      .btn-icon:hover {
        color: #ddd;
      }
    }
  }
  .section-top {
    .text-tip {
      font-size: 12px;
      color: #ccc;
    }
  }
  .section-bottom {
    .app-item {
      background: #f4f4f5;
    }
  }
}
</style>

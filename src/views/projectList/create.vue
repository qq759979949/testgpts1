<template>
  <div class="createProject" v-loading="isLoading">
    <div class="formBox" :style="{ height: `calc(100vh - 180px)`, overflowY: 'scroll' }">
      <div class="projectType">
        <div class="title">类型</div>
        <span class="labelCss">类型：</span>
        <el-select :fit-input-width="true" :popper-append-to-body="false" popper-class="select_class" v-model="projectTypeValue">
          <el-option v-for="item in projectTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <FormLayout ref="form" labelWidth="auto" :formList="formList" v-model:submitData="submitData" :isProject="true" :projectTypeValue="projectTypeValue"></FormLayout>
    </div>
    <el-affix target=".createProject" position="bottom" :offset="12">
      <div class="actionRow">
        <el-button @click="goback">{{ $intl('btn.cancel').d('取消') }}</el-button>
        <el-button @click="onSubmit" :loading="isLoading" type="primary">{{ $intl('btn.determine').d('确定') }}</el-button>
      </div>
    </el-affix>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, getCurrentInstance, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import FormLayout from '@/components/formLayout/index.vue';
import { getAllInstantiableSubTypes, getCreateLayout } from '@/api/common';
import { saveProject } from '@/api/project';
import dayjs from 'dayjs';
import * as _ from 'lodash';
// import { userInfo } from 'os';
export default defineComponent({
  name: 'createProject', // 页面添加缓存，此变量要与当前页面路由一致
  components: { FormLayout },
  setup() {
    const { proxy: that } = getCurrentInstance();
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      formList: [],
      submitData: {},
      fixed: true,
      isLoading: false,
      projectTypeValue: '',
      projectTypeOptions: [],
      userInfo: JSON.parse(window.$Cookies.get('userInfo')),
      marketList: [],
    });

    watch(
      () => state.projectTypeValue,
      async () => {
        if (state.projectTypeValue === 'cn.sdlg.productDevelopProject') {
          await getMainMarkets();
        }
        if (state.projectTypeValue) {
          await getFormData(state.projectTypeValue);
        }
      },
    );
    const initFun = () => {
      let typeParmas = {
        // type: 'com.pisx.pmgt.project.PIProject',
        operator: state.userInfo.username,
        includeSelf: 'true',
      };
      getAllInstantiableSubTypes(typeParmas).then((res) => {
        if (res.success) {
          for (let key in res.data.options) {
            let obj = {};
            obj.value = key;
            obj.label = res.data.options[key];
            state.projectTypeOptions.push(obj);
          }
          if (state.projectTypeOptions.length === 1) {
            state.projectTypeValue = state.projectTypeOptions[0].value;
          }
        } else {
          that.$message.error(res.message);
        }
      });
    };

    const getFormData = (type) => {
      state.isLoading = true;
      let params = {
        serviceKey: 'com.pisx.pmgt.project.PIProject',
        softType: type,
      };
      getCreateLayout(params).then((res) => {
        if (res.success) {
          let datas = res.data;
          datas.forEach((v) => {
            v.items.forEach((e) => {
              if (e.name === 'DevelopAttributes_A' || e.name === 'DevelopAttributes_B') {
                e.readOnly = true;
              }
              if (e.name === 'ProjectBudget') {
                e.dataType = 'java.lang.Long';
              }
              if (e.name === 'planStartDate') {
                e.value = getNowTime();
              }
              if (e.name === 'planEndDate') {
                e.value = getNext12Months();
              }
              if (e.name === 'MainMarkets') {
                e.filedType = 'TREESELECT';
                e.options = state.marketList;
              }
              // console.log(e);
              state.submitData[e.name] = '';
            });
          });
          state.formList = that.$formatData(datas, state.submitData);
          // if (type === 'cn.sdlg.technicalProject') {
          //   that.$refs.form.$refs.ruleForm.clearValidate();
          // }
        } else {
          state.formList = [];
          that.$message.error(res.message);
        }
        state.isLoading = false;
      });
    };
    // 获取主要市场
    const getMainMarkets = () => {
      window.$api.projectApi.getMainMarket().then((res) => {
        if (res.success) {
          state.marketList = changeMainValue(res.data);
        } else {
          window.$message.error(res.message);
        }
      });
      // console.log(newData);
      // return newData;
    };
    // 更改主要市场内部值
    const changeMainValue = (data) => {
      data = data.map((item) => {
        item.value = item.id;
        item.label = item.areaName;
        if (item.children && item.children.length > 0) {
          changeMainValue(item.children);
        }
        return item;
      });
      return data;
    };
    const getNowTime = () => {
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
      month = month + 1;
      month = month.toString().padStart(2, '0');
      date = date.toString().padStart(2, '0');
      var defaultDate = `${year}-${month}-${date}`;
      return defaultDate;
    };

    const getNext12Months = () => {
      const now = new Date(); // 当前日期和时间
      const nextYear = now.getFullYear() + 1; // 下一年
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
      month = month + 1;
      month = month.toString().padStart(2, '0');
      date = date.toString().padStart(2, '0');
      var defaultDate = `${nextYear}-${month}-${date}`;
      return defaultDate;
    };
    const submitFun = () => {
      that.$refs.form.$refs.ruleForm.validate((valid, fileds) => {
        if (valid) {
          if (checkObjectWords()) {
            if (planCheck()) {
              if (state.projectTypeValue === 'cn.sdlg.productDevelopProject') {
                state.submitData.dealMainMarkets = _.cloneDeep(state.submitData.MainMarkets);
                state.marketList.forEach((item) => {
                  changeMainValue1(item);
                });
                state.submitData.MainMarkets = state.submitData.MainMarkets.join(',');
                state.submitData.dealMainMarkets = state.submitData.dealMainMarkets.join(',');
              }
              let formObj = {
                type: state.projectTypeValue,
                attributes: JSON.parse(JSON.stringify(state.submitData)),
              };
              let params = {
                serviceKey: 'com.pisx.pmgt.project.PIProject',
                formData: JSON.stringify(formObj),
              };
              state.isLoading = true;
              saveProject(params).then((res) => {
                if (res.success) {
                  // window.$message.success('创建成功');
                  // window.$navTagStore.removeTag(route, router);
                  // window.$navTagStore.removeCacheTag(route.name);
                  // router.push({ name: 'projectList' });
                  // state.isLoading = false;
                  // window.$api.commonApi.queryProjectInfo({ projectOid: res.data }).then((res1) => {
                  //   if (res1.success) {
                  window.$api.processApi.getByOid({ oid: res.data }).then(async (res2) => {
                    if (res2.success) {
                      window.$navTagStore.removeAllCache();
                      sessionStorage.setItem('currentProject', JSON.stringify(res2.data));
                      sessionStorage.setItem('editOid', res.data);
                      await window.$commonApisFun.getProjectMenuList(res2.data.oid, state.userInfo.username, res2.data.type);
                      // setTimeout(() => {
                      window.$navTagStore.removeTag(route, router);
                      window.$navTagStore.removeCacheTag(route.name);
                      that.$message.success('创建成功');
                      router.push({ name: 'projectDetail' });
                      state.isLoading = false;
                      // }, 300);
                    } else {
                      state.isLoading = false;
                      window.$message.error(res2.message);
                    }
                  });
                  // } else {
                  //   state.isLoading = false;
                  //   window.$message.error(res1.message);
                  // }
                  // });
                } else {
                  state.isLoading = false;
                  that.$message.warning(res.message);
                }
              });
            } else {
              state.isLoading = false;
              window.$message.error('请检查项目阶段时间，后一时间不可早于前一时间');
            }
          } else {
            window.$message.error('成果及效益字符不能超过500');
          }
        } else {
          state.isLoading = false;
          let arr = [];
          for (let i in fileds) {
            arr.push(fileds[i][0].message);
          }
          window.$message.error(arr.join(','));
        }
      });
    };
    // 进度变更校验
    const planCheck = () => {
      let newD = [];
      state.formList.forEach((item) => {
        if (item.groupName === '项目阶段时间') {
          newD = item.items.map((it) => {
            it.value = state.submitData[it.name];
            return it;
          });
        }
      });
      let isMistake = true;
      const newData = newD.filter((item) => item.value);
      newData.forEach((item, index) => {
        if (newData.length - index >= 2) {
          if (dayjs(item.value) > dayjs(newData[index + 1].value)) {
            isMistake = false;
          }
        }
      });
      return isMistake;
    };
    // 校验成果及效益
    const checkObjectWords = () => {
      let isCheck = true;
      if (state.submitData.ObjectivesAndDeliverables) {
        if (JSON.stringify(state.submitData.ObjectivesAndDeliverables).length > 500) {
          isCheck = false;
        }
      }
      return isCheck;
    };
    onBeforeMount(() => {
      initFun();
    });

    // 获取类型下拉
    // const projectTypeChange = (val) => {
    //   state.projectTypeValue = val;
    //   if (state.projectTypeValue === 'cn.sdlg.productDevelopProject') {
    //     getMainMarkets();
    //   }
    //   getFormData(val);
    // };
    // 取消
    const goback = () => {
      router.push({ name: 'projectList' });
    };
    const changeMainValue1 = (node) => {
      if (node === null) return; // 当前节点为空，则直接返回
      let index = state.submitData.MainMarkets.findIndex((v) => v === node?.id);
      if (index !== -1) {
        state.submitData.dealMainMarkets.splice(index, 1, getParentIdList(state.marketList, node?.id));
      }
      node.children.forEach((el) => {
        changeMainValue1(el);
      });
    };

    // 传入参数：需要遍历的arr，需要匹配的末级id
    // 注：id为节点id，columnName 为节点name，children为子节点key，parentId为当前节点的父级id
    const getParentIdList = (data2, nodeId2) => {
      var arrRes = [];
      if (data2.length == 0) {
        if (nodeId2) {
          arrRes.unshift(data2.label);
        }
        return arrRes;
      }
      let rev = (data, nodeId) => {
        for (var i = 0, length = data.length; i < length; i++) {
          let node = data[i];
          if (node.id == nodeId) {
            arrRes.unshift(node.label);
            rev(data2, node.parentId);
            break;
          } else {
            if (node.children) {
              rev(node.children, nodeId);
            }
          }
        }
        return arrRes;
      };
      arrRes = rev(data2, nodeId2);
      return arrRes.join('/');
    };

    // const tempArr = ref([]);
    // const handLabel = (item) => {
    //   state.marketList.forEach((m) => {
    //     if (item.parentId === m.id) {
    //       tempArr.unshift(m.label);
    //       handLabel(m);
    //     } else {
    //       m.children.forEach((el) => {
    //         handLabel(el);
    //       });
    //     }
    //   });
    // };

    // 提交
    const onSubmit = () => {
      submitFun();
    };
    return {
      ...toRefs(state),
      // projectTypeChange,
      goback,
      onSubmit,
    };
  },
});
</script>

<style scoped lang="scss">
.createProject {
  // min-height: calc(100vh - 158px);
  // display: flex;
  // // flex-direction: column;
  // background-color: #fff;
  // margin: 16px;
  .MainTitle {
    font-weight: bold;
  }
  .formBox {
    margin: 0 16px;
    padding: 16px;
    background: #fff;
    // flex: 1;
    // width: 600px;
    .projectType {
      .title {
        font-size: 16px;
        font-weight: bolder;
      }
      .labelCss {
        // width: 212px;
        width: 150px;
        display: inline-block;
        text-align: left;
        padding: 0 12px 0 20px;
      }
      :deep(.el-select) {
        width: calc(50% - 212px);
      }
    }
  }
  .actionRow {
    text-align: right;
    background: #fff;
    border-top: 1px solid var(--el-border-color-light);
    padding: 16px 20px 16px 0;
    position: absolute;
    bottom: 0;
    width: 100%;
  }
}
</style>

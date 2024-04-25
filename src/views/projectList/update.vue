<template>
  <div class="createProject" v-loading="isLoading">
    <div class="formBox" :style="{ height: `calc(100vh - 180px)`, overflowY: 'scroll' }">
      <FormLayout ref="form" labelWidth="auto" :formList="formList" v-model:submitData="submitData" :isProject="true" :projectTypeValue="projectTypeValue"></FormLayout>
    </div>
    <el-affix target=".createProject" position="bottom" :offset="16">
      <div class="actionRow">
        <el-button @click="goback">{{ $intl('btn.cancel').d('取消') }}</el-button>
        <el-button @click="onSubmit" :loading="isLoading" type="primary">{{ $intl('btn.determine').d('确定') }}</el-button>
      </div>
    </el-affix>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, ref, getCurrentInstance, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import FormLayout from '@/components/formLayout/index.vue';
import { getEditLayout } from '@/api/common';
import { editProject, getProjectEditLayout } from '@/api/project';
import { userHandDataStore } from '@/stores/modules/handData';
import dayjs from 'dayjs';
import * as _ from 'lodash';
export default defineComponent({
  components: { FormLayout },
  setup() {
    const { proxy: that } = getCurrentInstance();
    const router = useRouter();
    const route = useRoute();
    const handDataStore = userHandDataStore();
    const { selectData } = storeToRefs(handDataStore);

    const state = reactive({
      formList: [],
      submitData: {},
      fixed: true,
      isLoading: false,
      projectTypeValue: '',
      projectTypeOptions: [],
      editOid: sessionStorage.getItem('editOid'),
      tonnageList: [],
    });
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

    const getFormData = () => {
      state.isLoading = true;
      let params = {
        serviceKey: 'com.pisx.pmgt.project.PIProject',
        oid: selectData.value[0] || state.editOid,
      };
      getProjectEditLayout(params).then((res) => {
        if (res.success) {
          let datas = res.data;
          datas.forEach((v) => {
            v.items.forEach((e) => {
              state.submitData[e.name] = '';
              if (e.name === 'projectShortName') {
                e.readOnly = true;
              }
              if (e.name === 'ProjectBudget') {
                e.dataType = 'java.lang.Long';
              }
              if (e.name === 'MainMarkets') {
                e.filedType = 'TREESELECT';
                e.options = state.marketList;
                e.displayValue = e.displayValue.split(',');
                e.value = e.value.split(',');
              }
              if (!isNaN(parseFloat(e.value)) && isFinite(e.value)) {
                // 将数值转化为字符串
                e.value = e.value.toString();
              }
            });
            state.projectTypeValue = v.objType;
          });
          state.formList = that.$formatData(datas, state.submitData);
          console.log(state.formList);
        } else {
          state.formList = [];
        }
        state.isLoading = false;
      });
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
    const submitFun = () => {
      that.$refs.form.$refs.ruleForm.validate((valid, fields) => {
        if (valid) {
          if (checkObjectWords()) {
            if (planCheck()) {
              if (JSON.parse(sessionStorage.getItem('currentProject')).type === '产品开发类项目') {
                state.submitData.dealMainMarkets = _.cloneDeep(state.submitData.MainMarkets);
                state.marketList.forEach((item) => {
                  changeMainValue1(item);
                });
                state.submitData.MainMarkets = state.submitData.MainMarkets.join(',');
                state.submitData.dealMainMarkets = state.submitData.dealMainMarkets.join(',');
              }
              let formObj = {
                oid: selectData.value[0] || state.editOid,
                attributes: JSON.parse(JSON.stringify(state.submitData)),
              };
              let params = {
                serviceKey: 'com.pisx.pmgt.project.PIProject',
                formData: JSON.stringify(formObj),
              };
              state.isLoading = true;
              editProject(params).then((res) => {
                if (res.success) {
                  that.$message.success('操作成功');
                  window.$navTagStore.removeTag(route, router);
                  window.$navTagStore.removeCacheTag(route.name);
                  if (router.options.history.state.back === '/project/initiation') {
                    router.push({ path: router.options.history.state.back });
                  } else {
                    router.push({ name: 'projectDetail' });
                  }
                  let project = JSON.parse(sessionStorage.getItem('currentProject'));
                  project['projectName'] = state.submitData.projectName;
                  sessionStorage.setItem('currentProject', JSON.stringify(project));
                } else {
                  that.$message.warning(res.message);
                }
                state.isLoading = false;
              });
            } else {
              state.isLoading = false;
              window.$message.error('请检查项目阶段时间，后一时间不可早于前一时间');
            }
          } else {
            window.$message.error('成果及效益字符不能超过500');
          }
        } else {
          let arr = [];
          for (let i in fields) {
            arr.push(fields[i][0].message);
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

    onMounted(() => {});

    onBeforeMount(async () => {
      if (JSON.parse(sessionStorage.getItem('currentProject')).type === '产品开发类项目') {
        await getMainMarkets();
      }
      await getFormData();
    });

    // 获取类型下拉
    // const projectTypeChange = (val) => {
    //   state.projectTypeValue = val;
    //   getFormData(val);
    // };
    // 取消
    const goback = () => {
      window.$navTagStore.removeTag(route, router);
      window.$navTagStore.removeCacheTag(route.name);
      if (router.options.history.state.back === '/project/initiation') {
        router.push({ path: router.options.history.state.back });
      } else {
        router.push({ name: 'projectDetail' });
      }
    };
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
  // flex-direction: column;
  // background-color: #fff;
  // padding: 16px;
  .MainTitle {
    font-weight: bold;
  }
  .formBox {
    // flex: 1;
    margin: 0 16px;
    padding: 16px;
    background: #fff;
    // width: 600px;
    .projectType {
      .title {
        font-size: 16px;
        font-weight: bolder;
      }
      .labelCss {
        width: 150px;
        display: inline-block;
        text-align: left;
        padding: 0 12px 0 20px;
      }
      :deep(.el-select) {
        width: calc(50% - 200px);
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

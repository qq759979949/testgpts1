<template>
  <div class="select_user" v-loading="Data.processLoading">
    <div class="title" v-if="isTitle">
      {{ title }}
    </div>
    <div class="select_form">
      <el-col :span="12">
        <el-form ref="ruleForm" :model="Data.userForm" label-width="120px" :rules="Data.rulesForm" label-position="left">
          <el-form-item v-for="(item, index) in Data.userFormData" :key="index" :label="item.activityName + ' ：'" :prop="item.activityName">
            <el-select
              v-model="Data.userForm[item.activityName]"
              :placeholder="Data.userForm[item.activityName].length !== 1 ? item.groupListStr : '请选择'"
              filterable
              clearable
              :multiple="true"
              @focus="selectFocus(item)"
              style="width: 100%"
              :fit-input-width="true"
              :popper-append-to-body="false"
              popper-class="select_class"
              @change="selectChange"
              :disabled="item.activityName === '自检' || item.activityName === '创建阶段评价通知' || item.activityName === '修改完善'"
            >
              <el-option
                v-for="item in item.userSelectOptions"
                :key="item.userId"
                :label="item?.stag ? item.realname : item.realname + '(' + item.username + ')'"
                :value="item.username + '_pdc_' + item.ibaOne"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </div>
  </div>
</template>

<script setup>
import * as _ from 'lodash';
import { set } from 'lodash';
import { inject } from 'vue';
const route = useRoute();
const props = defineProps({
  isTitle: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '流程选人',
  },

  /**入参--模板名称 */
  // parmasObj: {
  //   type: Object,
  //   default: () => {},
  // },
  userObj: {
    type: Object,
    default: () => {},
  },
});
const Data = reactive({
  processLoading: false,
  userForm: {},
  userFormData: [],
  rulesForm: {},

  // 项目id
  projectOid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  checkUserList: [],
  parmasObj: {
    oid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
    reviewConfKey: 'piproject',
    reviewType: '会议评审',
    reviewPoint: '',
  },
  stepArr: [],
  checkManList: [],
  tempSelectUser: {},
});
const api = window.$api;
onMounted(async () => {
  Data.parmasObj.reviewType = route.name === 'editReview' || route.query.workItemName === '重新提交' ? JSON.parse(sessionStorage.getItem('basicForm')).reviewType : '会议评审';
  if (route.name === 'editReview' || route.query.workItemName === '重新提交') {
    Data.parmasObj.reviewPoint = JSON.parse(sessionStorage.getItem('basicForm')).processType + '-' + JSON.parse(sessionStorage.getItem('basicForm')).reviewPoint;
  }
  await getUserInfoData(Data.parmasObj);
  // await getSelectUserData(Data.stepArr.value);
  // checkUser();
  // getEditFlowUser();
});
watch(
  () => Data.userFormData,
  (val) => {
    Data.userFormData = val;
  },
  {
    deep: true,
    immediate: true,
  },
);
const getUserInfoData = async (val) => {
  Data.processLoading = true;
  await api.reviewApi
    .getReviewProcessorConfig(val)
    .then((res) => {
      if (res.success) {
        Data.userFormData = res.data.cellList.map((v) => {
          v.userSelectValue = []; // 流程选人都是多选，所以此为数组
          v.userSelectOptions = [];
          return v;
        });

        // 获取校验规则数据
        getRule(res.data.cellList);
        // 获取入参
        Data.stepArr.value = Data.userFormData.map((e) => {
          let obj = {};
          obj.type = e.activityName;
          obj.groupList = e.groupList;
          obj.roleList = e.roleList;
          obj.oid = Data.projectOid;
          return obj;
        });
        // emit('update:stepArr', Data.stepArr.value);
        getSelectUserData(Data.stepArr.value);
      }
    })
    .catch((err) => {
      window.$message.error(err);
    });
};
// 校验规则数据
const getRule = (dataList) => {
  // 添加校验规则
  dataList.forEach((e) => {
    let obj = [
      {
        required: e.mustSelected,
        message: '请输入' + e.activityName + '人员',
        trigger: ['blur', 'change'],
      },
    ];
    // if (e.activityName === '评审' || e.activityName === '审阅' || e.activityName === '批准') {
    Data.rulesForm = { ...Data.rulesForm, [e.activityName]: obj };
    // }
    Data.userForm = { ...Data.userForm, ...{ [e.activityName]: [] } };
  });
};
// 获取人员数据
const getSelectUserData = async (val) => {
  await api.commonApi
    .getUserData(val)
    .then((res) => {
      if (res.success) {
        Data.userFormData.forEach((el) => {
          let newVal = res.data[el.activityName];
          // ibaOne为拓展字段，为防止不同地方出现不同参数，类似流程选人是：thirdUsername
          newVal.member.forEach((e) => {
            e.ibaOne = e?.thirdUsername;
          });
          // 当人员只有一个的时候，直接展示出来
          if (newVal.member.length > 0 && newVal.member.length === 1) {
            el.userSelectValue = [newVal.member[0].username + '_pdc_' + newVal.member[0].ibaOne];
            // 下拉列表
            el.userSelectOptions = newVal.member;
          } else {
            if (newVal.roleList?.length > 0) {
              el.groupListStr = newVal.roleList?.map((v) => v.roleName).join(',');
            }
            el.userSelectOptions = [...newVal.member];
          }
          if (el.activityName === '修改完善') {
            el.groupListStr = JSON.parse(window.$Cookies.get('userInfo')).realName;
            el.userList = [JSON.parse(window.$Cookies.get('userInfo')).username];
          }
          if (el.activityName === '自检') {
            api.payPacketApi.getSelfCheckManConfig(props.userObj).then((res) => {
              if (res.success) {
                Data.checkManList = _.cloneDeep(res.data);
                el.groupListStr = res.data?.map((v) => v.realName).join(',');
                el.userList = [res.data?.map((v) => v.name).join(',')];
                selectChange();
              } else {
                window.$message.error(res.message);
              }
            });
          }
          // Data.tempSelectUser
          // for (let key in Data.tempSelectUser) {
          //   let userName = Data.tempSelectUser[key];
          //   console.log(userName, 'userName');
          //   if (Data.tempSelectUser[key]) {
          //   }
          // }
          // 赋值
          Data.userForm = { ...Data.userForm, ...{ [el.activityName]: el.userSelectValue } };
        });
        Data.processLoading = false;
      } else {
        Data.processLoading = false;
      }
    })
    .catch((err) => {
      window.$message.error('接口报错' + err);
    });
};
// 获取自检人
const checkUser = () => {
  api.payPacketApi.getSelfCheckManConfig(props.userObj).then((res) => {
    if (res.success) {
      Data.checkUserList = res.data;
    }
  });
};

// 获取焦点的时候调用查询人员接口
const selectFocus = (item) => {
  if (item.userSelectOptions.length > 0) return; // 如果点击过了，就不用加载了
};
// 评审编辑获取流程处理人信息
const getEditFlowUser = () => {
  api.commonApi.getProcessorWorkflow({ businessOid: route.query.oid }).then((res) => {
    if (res.success) {
      let obj = JSON.parse(res.data?.processUser);
      Data.tempSelectUser = obj;
      console.log(Data.tempSelectUser, 'res---2323');
    }
  });
};
/**选中人操作 */
const selectChange = () => {
  let newData = _.cloneDeep(Data.userForm);
  for (let ele in newData) {
    let newObj = {};
    newData[ele].forEach((v) => {
      let userArr = v.split('_pdc_');
      newObj = {
        ...newObj,
        ...{
          [userArr[0]]: userArr[userArr.length - 1],
        },
      };
    });
    if (ele === '自检') {
      Data.checkManList.forEach((item) => {
        set(newObj, item.name, item.thirdPartUser);
      });
    }
    if (ele === '修改完善') {
      set(newObj, JSON.parse(window.$Cookies.get('userInfo')).username, JSON.parse(window.$Cookies.get('userInfo')).thirdPartUser);
    }
    newData[ele] = newObj;
  }
  emit('update:selectUserData', newData);
};

/** 校验规则 */
const ruleForm = ref();
const validate = (valid, fields) => {
  return ruleForm.value.validate(valid, fields);
};
const checkForm = () => {
  ruleForm.value.validate((valid, fields) => {
    for (let v in fields) {
      fields[v].forEach((v) => {
        window.$message.warning(v.message);
      });
    }
  });
};

/**
 * emit输出
 */
const emit = defineEmits(['update:userFormData', 'update:selectUserData']);
defineExpose({
  validate,
  checkForm,
  getUserInfoData,
  getSelectUserData,
  checkUser,
  Data,
});
</script>

<style lang="less" scoped></style>

<template>
  <div class="select_user">
    <div class="title" v-if="isTitle">
      {{ title }}
    </div>
    <div class="select_form">
      <el-col :span="14">
        <el-form ref="ruleForm" :model="Data.userForm" label-width="auto" :rules="Data.rulesForm" label-position="right">
          <el-form-item v-for="(item, index) in Data.userFormData" :key="index" :label="item.activityName + ' ：'" :prop="item.activityName">
            <div class="select_row">
              <el-select
                v-model="Data.userForm[item.activityName]"
                :placeholder="'请选择'"
                filterable
                clearable
                :multiple="item.isSign"
                @focus="selectFocus(item)"
                style="width: 80%"
                :fit-input-width="true"
                :popper-append-to-body="false"
                popper-class="select_class"
                @change="selectChange"
              >
                <el-option
                  v-for="item in item.userSelectOptions"
                  :key="item.userId"
                  :label="item?.stag ? item.realname : item.realname + '(' + item.username + ')' + `${item.roleName ? item.roleName : ''}`"
                  :value="item.username + '_pdc_' + item.ibaOne"
                />
              </el-select>
              <div class="select_row_right">
                <el-tooltip :content="item.groupListStr" placement="top-start" :show-arrow="false">
                  <span class="rightTextOver">{{ item.groupListStr }}</span>
                </el-tooltip>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-col>
    </div>
    <!-- 流程描述信息 -->
    <div class="processDescripInfo" v-if="Data.processDescrip">
      流程描述:
      <div class="processDescripContent" v-html="Data.processDescrip.replace(/\n/g, '<br />')"></div>
    </div>
  </div>
</template>

<script setup>
import * as _ from 'lodash';
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
  parmasObj: {
    type: Object,
    default: () => {},
  },

  /**入参--接口 */
  apiUrl: {
    type: String,
    default: 'getReviewInfo',
  },
  workitemOid: {
    type: String,
    default: '',
  },
  // 选的的人数据
  selectUserData: {
    type: Object,
    default: () => {},
  },
  // 保存填写的流程选人
  changeOid: {
    type: String,
    default: '',
  },
});
const Data = reactive({
  userForm: {},
  userFormData: [],
  rulesForm: {},
  tempSelectUser: {},
  processDescrip: '',
  // 项目id
  projectOid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
});
const api = window.$api;
const isSelectData = ref({});
onMounted(async () => {
  /**重新提交 */
  if (props.workitemOid) {
    await api.commonApi.getProcessorUser({ workitemOid: props.workitemOid }).then((res) => {
      if (res.success) {
        isSelectData.value = res.data;
      } else {
        window.$message.error('获取人员失败！');
      }
    });
  }
  if (props.changeOid) {
    await _getProcessorWorkflow(props.changeOid); // 临时保存的选人数据
  }
  // await _getProcessorWorkflow(); // 临时保存的选人数据
  await getUserInfoData();
  await getSelectUserData();
  _getProcessDescription();
  nextTick(() => {
    ruleForm.value.clearValidate(); // 解决表单初始化执行校验的问题
  });
});

// 获取临时选人的数据
const _getProcessorWorkflow = async (oid) => {
  api.commonApi.getProcessorWorkflow({ businessOid: oid }).then((res) => {
    if (res.success) {
      // isSelectData.value = res.data;
      let obj = JSON.parse(res.data?.processUser);
      Data.tempSelectUser = obj;
    }
  });
};

//根据配置文件获取流程描述
const _getProcessDescription = () => {
  let params = {
    processTemplate: props.parmasObj.processTemplate,
    oid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
  };
  api.commonApi.getProcessDescription(params).then((res) => {
    if (res.success) {
      Data.processDescrip = res.data;
    } else {
      window.$message.error(res.message);
    }
  });
};

const stepArr = ref([]); // 获取中台用户数据入参
const getUserInfoData = async () => {
  await api.commonApi[props.apiUrl](props.parmasObj)
    .then((res) => {
      if (res.success && res.data) {
        Data.userFormData = res.data?.cellList.map((v) => {
          v.userSelectValue = []; // 流程选人都是多选，所以此为数组
          v.userSelectOptions = [];
          return v;
        });

        // 获取校验规则数据
        getRule(res.data.cellList);
        // 获取入参
        stepArr.value = Data.userFormData.map((e) => {
          let obj = {};
          obj.type = e.activityName;
          obj.groupList = e.groupList;
          obj.roleList = e.roleList;
          obj.oid = Data.projectOid;
          return obj;
        });
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
    Data.rulesForm = { ...Data.rulesForm, [e.activityName]: obj };
    Data.userForm = { ...Data.userForm, ...{ [e.activityName]: [] } };
  });
};
// 获取人员数据
const getSelectUserData = async () => {
  await api.commonApi
    .getUserData(stepArr.value)
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
            el.userSelectValue = el.isSign ? [newVal.member[0].username + '_pdc_' + newVal.member[0].ibaOne] : newVal.member[0].username + '_pdc_' + newVal.member[0].ibaOne;
            // 下拉列表
            el.userSelectOptions = newVal.member;
            if (newVal.roleList?.length > 0) {
              el.groupListStr = newVal.roleList?.map((v) => v.roleName).join(',');
            } else if (newVal.groupList?.length > 0) {
              el.groupListStr = newVal.groupList?.map((v) => v.groupName).join(',');
            }
          } else {
            // 先将角色组数据暂存，并且放在最后面
            // newVal.roleList.forEach((v) => {
            //   let obj = {};
            //   obj.userId = v.id;
            //   obj.realname = v.roleName;
            //   obj.username = v.roleCode;
            //   obj.ibaOne = 'staging'; //暂存
            //   obj.stag = true; // 暂存标记，在获取焦点的时候处理
            //   newVal.member.push(obj);
            //   // 将角色信息展示出来
            //   let str = obj.username + '_pdc_' + obj.ibaOne;
            //   el.userSelectValue.push(str);
            // });
            /**重新提交--用户接口回显 */
            if (props.workitemOid) {
              if (isSelectData.value[el.activityName]) {
                let isSelectArr = isSelectData.value[el.activityName];
                isSelectArr.forEach((e) => {
                  el.isSign ? el.userSelectValue.push(e.name + '_pdc_' + e?.thirdUsername) : (el.userSelectValue = e.name + '_pdc_' + e?.thirdUsername);
                });
              }
            } else {
              // 如果不是重新提交，是流程选人的话 将临时保存的选人数据赋值进去
              for (let key in Data.tempSelectUser) {
                let userName = Data.tempSelectUser[key];
                if (Data.tempSelectUser[key]) {
                  for (let key2 in userName) {
                    if (el.activityName === key && userName[key2]) {
                      el.isSign ? el.userSelectValue.push(key2 + '_pdc_' + userName[key2]) : (el.userSelectValue = key2 + '_pdc_' + userName[key2]);
                    }
                  }
                }
              }
            }
            if (newVal.roleList?.length > 0) {
              el.groupListStr = newVal.roleList?.map((v) => v.roleName).join(',');
            } else if (newVal.groupList?.length > 0) {
              el.groupListStr = newVal.groupList?.map((v) => v.groupName).join(',');
            }
            el.userSelectOptions = [...newVal.member];
          }

          // 赋值
          Data.userForm = { ...Data.userForm, ...{ [el.activityName]: el.userSelectValue } };
        });
        selectChange();
      }
    })
    .catch((err) => {
      window.$message.error('接口报错' + err);
    });
};
// 获取焦点的时候调用查询人员接口
const selectFocus = (item) => {
  if (item.userSelectOptions.length > 0) return; // 如果点击过了，就不用加载了
  // stepObj.value = { roleList: item.roleList, groupList: item.groupList, oid: Data.projectOid }; // 调用获取用户接口入参
};

/**选中人操作 */
const selectChange = () => {
  let newData = _.cloneDeep(Data.userForm);
  for (let ele in newData) {
    let newObj = {};
    if (typeof newData[ele] === 'string') {
      let userArr = newData[ele].split('_pdc_');
      newObj = {
        ...newObj,
        ...{
          [userArr[0]]: userArr[userArr.length - 1],
        },
      };
      newData[ele] = newObj;
    } else {
      newData[ele].forEach((v) => {
        let userArr = v.split('_pdc_');
        newObj = {
          ...newObj,
          ...{
            [userArr[0]]: userArr[userArr.length - 1],
          },
        };
      });
      newData[ele] = newObj;
    }
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
});
</script>

<style lang="less" scoped>
.select_row {
  width: 100%;
  display: flex;
  .select_row_right {
    margin-left: 10px;
    width: 50%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .rightTextOver {
      color: #606266;
    }
  }
}
.processDescripInfo {
  font-weight: bold;
  color: #f56c6c;
  margin-top: 20px;
  margin-left: 10px;
  .processDescripContent {
    margin-left: 60px;
  }
}
</style>
<style lang="less">
.el-popper.is-dark {
  max-width: 300px;
}
</style>

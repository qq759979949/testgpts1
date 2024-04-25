<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-12 08:56:35
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\projectChange\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="createProjectChange" v-loading="Data.isLoading">
    <el-affix target=".createProjectChange" :offset="100">
      <div class="top_area">
        <div class="depart">
          <div class="title_box">
            <span class="title title1">基本信息</span>
          </div>
          <section class="section-container">
            <el-form :model="Data.form" label-width="120px" label-position="right">
              <el-form-item label="所属阶段：" :required="true">
                <el-select v-model="Data.form.valuePlan" class="m-2" placeholder="请选择" style="width: 200px" disabled>
                  <el-option v-for="item in Data.optionsPlan" :key="item.displayName" :label="item.displayName" :value="item.displayName" />
                </el-select>
              </el-form-item>
              <el-form-item label="变更类别：" :required="true">
                <el-checkbox-group v-model="Data.form.type" @change="changeCheckBox">
                  <el-checkbox label="项目属性变更" name="type" />
                  <el-checkbox label="进度变更" name="type" />
                  <el-checkbox label="目标/指标变更" name="type" />
                  <el-checkbox label="薪酬包成员变更" name="type" />
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="变更说明：">
                <el-input v-model="Data.form.description"></el-input>
              </el-form-item>
            </el-form>
          </section>
        </div>
        <div class="tab_box">
          <el-tabs v-model="Data.tabValue" @tab-click="handleTabClick">
            <el-tab-pane :label="item.label" :name="item.name" v-for="(item, index) in Data.tabList" :key="index"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-affix>
    <div class="bottom_area">
      <div class="second_area second_area1">
        <div class="depart" id="project_attribute">
          <div class="title_box">
            <span class="hand_icon" @click="expandFunc('arrow1')" v-if="Data.arrowList.arrow1">-</span>
            <span class="hand_icon" @click="expandFunc('arrow1')" v-else>+</span>
            <span class="title">项目属性</span>
          </div>
          <section class="section-container" v-show="Data.arrowList.arrow1">
            <attribute @changeInput="changeInput" :isEdit="Data.editList.isEdit1" :is-create="true" ref="attributeTable" :oid="Data.parmasObj.oid"></attribute>
          </section>
        </div>
      </div>
      <div class="second_area">
        <div class="depart" id="milestone_plan">
          <div class="title_box">
            <span class="hand_icon" @click="expandFunc('arrow2')" v-if="Data.arrowList.arrow2">-</span>
            <span class="hand_icon" @click="expandFunc('arrow2')" v-else>+</span>
            <span class="title">里程碑计划</span>
          </div>
          <section class="section-container" v-show="Data.arrowList.arrow2">
            <milesstone-table @changeInput="changeInput" :isEdit="Data.editList.isEdit2" :is-create="true" ref="milessChangeTable" :oid="Data.parmasObj.oid"></milesstone-table>
          </section>
        </div>
      </div>
      <div class="second_area">
        <div class="depart" id="project_target">
          <div class="title_box">
            <span class="hand_icon" @click="expandFunc('arrow3')" v-if="Data.arrowList.arrow3">-</span>
            <span class="hand_icon" @click="expandFunc('arrow3')" v-else>+</span>
            <span class="title">目标/指标</span>
          </div>
          <section class="section-container" v-show="Data.arrowList.arrow3">
            <target-indicators
              :isEdit="Data.editList.isEdit3"
              :phaseList="Data.phaseList"
              ref="targetTable"
              :is-create="true"
              :oid="Data.parmasObj.oid"
              :projectType="Data.projectType"
            ></target-indicators>
          </section>
        </div>
      </div>
      <div class="second_area">
        <div class="depart" id="main_member">
          <div class="title_box">
            <span class="hand_icon" @click="expandFunc('arrow4')" v-if="Data.arrowList.arrow4">-</span>
            <span class="hand_icon" @click="expandFunc('arrow4')" v-else>+</span>
            <span class="title">薪酬包</span>
          </div>
          <section class="section-container" v-show="Data.arrowList.arrow4">
            <div class="contentTitle">主包成员表格</div>
            <mainMemberTable
              :isEdit="Data.editList.isEdit4"
              ref="mainChangeTable"
              :projectOid="Data.parmasObj.oid"
              :phaseListMain="Data.phaseList"
              :isCreate="true"
            ></mainMemberTable>
            <div v-if="Data.projectType === '产品开发类项目'">
              <div class="contentTitle">配包成员表格</div>
              <minorMemberTable
                :isEdit="Data.editList.isEdit4"
                ref="minorChangeTable"
                :projectOid="Data.parmasObj.oid"
                :phaseListMinor="Data.phaseList"
                :isCreate="true"
              ></minorMemberTable>
            </div>
          </section>
        </div>
      </div>
      <div class="second_area">
        <div class="depart" id="upload_file">
          <div class="title_box">
            <span class="hand_icon" @click="expandFunc('arrow6')" v-if="Data.arrowList.arrow6">-</span>
            <span class="hand_icon" @click="expandFunc('arrow6')" v-else>+</span>
            <span class="title">附件</span>
          </div>
          <section class="section-container" v-show="Data.arrowList.arrow6">
            <el-upload ref="upload" class="upload-demo" action="/" :auto-upload="false" v-model:file-list="Data.fileList" :on-exceed="handleExceed">
              <template #trigger>
                <el-button :icon="'upload'">上传</el-button>
              </template>
            </el-upload>
          </section>
        </div>
      </div>
      <div class="second_area">
        <div class="depart" id="process_setting">
          <div class="title_box">
            <span class="hand_icon" @click="expandFunc('arrow7')" v-if="Data.arrowList.arrow7">-</span>
            <span class="hand_icon" @click="expandFunc('arrow7')" v-else>+</span>
            <span class="title">流程设置</span>
          </div>
          <section class="section-container" v-show="Data.arrowList.arrow7">
            <select-user ref="selectUserGrading" :parmasObj="Data.parmasObj" v-model:selectUserData="Data.selectUserData"></select-user>
          </section>
        </div>
      </div>
    </div>
    <el-affix position="bottom" :offset="0">
      <div class="bottomConfirm">
        <el-button class="bottomBtn bottomBtn1" @click="cancel">取消</el-button>
        <el-button class="bottomBtn bottomBtn1" @click="saveCheck('save')">保存</el-button>
        <el-button type="primary" class="bottomBtn" @click="saveCheck('submit')">提交</el-button>
      </div>
    </el-affix>
  </div>
</template>

<script setup name="createProjectChange">
import attribute from './comp/attribute.vue';
import milesstoneTable from './comp/milesstoneTable.vue';
import mainMemberTable from './comp/mainMemberTable.vue';
import minorMemberTable from './comp/minorMemberTable.vue';
import targetIndicators from './comp/targetIndicators.vue';
import dayjs from 'dayjs';
const { proxy: that } = getCurrentInstance();
const selectUserGrading = ref(null);
const route = useRoute();
const router = useRouter();
const Data = reactive({
  tabList: [
    {
      label: '项目属性',
      name: 'project_attribute',
    },
    {
      label: '里程碑计划',
      name: 'milestone_plan',
    },
    {
      label: '目标/指标',
      name: 'project_target',
    },
    {
      label: '薪酬包',
      name: 'main_member',
    },
    {
      label: '附件',
      name: 'upload_file',
    },
    {
      label: '流程设置',
      name: 'process_setting',
    },
  ],
  tabValue: 'project_attribute',
  arrowList: {
    arrow1: false,
    arrow2: false,
    arrow3: false,
    arrow4: false,
    arrow6: true,
    arrow7: true,
  },
  form: {},
  fileList: [],
  parmasObj: {
    processTemplate: 'SDLG_ProjectModifyWF',
    oid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
  },
  selectUserData: [],
  editList: {
    isEdit1: false,
    isEdit2: false,
    isEdit3: false,
    isEdit4: false,
  },
  optionsPlan: [],
  userInfo: JSON.parse(window.$Cookies.get('userInfo')),
  projectType: JSON.parse(sessionStorage.getItem('currentProject')).type,
  phaseList: [],
  isLoading: false,
});
onMounted(() => {
  getPhaseColumns();
  getPlanList();
});
// 锚点
const handleTabClick = (tab) => {
  const id = tab.props.name;
  document.querySelector('#' + id).scrollIntoView({
    behavior: 'smooth', // 定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"
  });
};
// 展开缩起
const expandFunc = (index) => {
  Data.arrowList[index] = !Data.arrowList[index];
};
// 更改内容(基本属性/里程碑计划)
const changeInput = (scope) => {
  scope.isChange = true;
};
// 提交
const submit = () => {
  selectUserGrading.value.validate(async (valid, fields) => {
    if (valid) {
      for (let i in that.$refs.targetTable.Data.tableDataList) {
        that.$refs.targetTable.Data.tableDataList[i] = that.$refs.targetTable.Data.tableDataList[i].map((item) => {
          if (item.editFlag) {
            delete item.editFlag;
          }
          return item;
        });
      }
      const obj = new FormData();
      obj.append('projectOid', Data.parmasObj.oid);
      obj.append('description', Data.form.description ? Data.form.description : '');
      obj.append('changeType', Data.form.type.join(','));
      obj.append('stage', Data.form.valuePlan);
      obj.append('creator', Data.userInfo.username);
      obj.append('wcUser', Data.userInfo.thirdPartUser);
      obj.append('projectAttributeJson', JSON.stringify(that.$refs.attributeTable.Data.attributeTableData));
      obj.append('scheduleChangeJson', JSON.stringify(that.$refs.milessChangeTable.Data.planTableData));
      obj.append('primaryPackageJson', JSON.stringify(that.$refs.mainChangeTable.Data.mainMemberTableData));
      obj.append('secondaryPackageJson', Data.projectType === '产品开发类项目' ? JSON.stringify(that.$refs.minorChangeTable.Data.minorMemberTableData) : []);
      obj.append('targetAndIndexChangeJson', JSON.stringify(that.$refs.targetTable.Data.tableDataList));
      obj.append('selectUserJson', JSON.stringify(Data.selectUserData));
      Data.fileList.forEach((el) => {
        obj.append('files', el.raw);
      });
      window.$api.projectChangeApi.saveChangeRequest(obj).then((res) => {
        if (res.success) {
          let newObj = {};
          newObj[Data.userInfo.username] = Data.userInfo.thirdPartUser;
          // Data.selectUserData = Object.assign({ 重新提交: newObj }, Data.selectUserData);
          let parmas = {
            oid: res.data,
            processTemplate: 'SDLG_ProjectModifyWF',
            processUsers: JSON.stringify(Data.selectUserData),
            actualUser: Data.userInfo.username,
          };
          window.$api.commonApi.startWfProcess(parmas).then((res1) => {
            if (res1.success) {
              Data.isLoading = false;
              window.$message.success('启动成功！');
              window.$navTagStore.removeTag(route, router);
              window.$navTagStore.removeCacheTag(route.name);
              router.push({ name: 'projectChange' });
            } else {
              Data.isLoading = false;
              window.$message.error(res1.message);
            }
          });
        } else {
          window.$message.error(res.message);
          Data.isLoading = false;
        }
      });
    } else {
      Data.isLoading = false;
      selectUserGrading.value.checkForm(valid, fields);
    }
  });
};
// 保存变更
const save = () => {
  for (let i in that.$refs.targetTable.Data.tableDataList) {
    that.$refs.targetTable.Data.tableDataList[i] = that.$refs.targetTable.Data.tableDataList[i].map((item) => {
      if (item.editFlag) {
        delete item.editFlag;
      }
      return item;
    });
  }
  const obj = new FormData();
  obj.append('projectOid', Data.parmasObj.oid);
  obj.append('description', Data.form.description ? Data.form.description : '');
  obj.append('changeType', Data.form.type.join(','));
  obj.append('stage', Data.form.valuePlan);
  obj.append('creator', Data.userInfo.username);
  obj.append('wcUser', Data.userInfo.thirdPartUser);
  obj.append('projectAttributeJson', JSON.stringify(that.$refs.attributeTable.Data.attributeTableData));
  obj.append('scheduleChangeJson', JSON.stringify(that.$refs.milessChangeTable.Data.planTableData));
  obj.append('primaryPackageJson', JSON.stringify(that.$refs.mainChangeTable.Data.mainMemberTableData));
  obj.append('secondaryPackageJson', Data.projectType === '产品开发类项目' ? JSON.stringify(that.$refs.minorChangeTable.Data.minorMemberTableData) : []);
  obj.append('targetAndIndexChangeJson', JSON.stringify(that.$refs.targetTable.Data.tableDataList));
  obj.append('selectUserJson', JSON.stringify(Data.selectUserData));
  Data.fileList.forEach((el) => {
    obj.append('files', el.raw);
  });
  window.$api.projectChangeApi.saveChangeRequest(obj).then((res) => {
    if (res.success) {
      window.$message.success('保存成功');
      window.$navTagStore.removeTag(route, router);
      window.$navTagStore.removeCacheTag(route.name);
      router.push({ name: 'projectChange' });
      Data.isLoading = false;
    } else {
      window.$message.error(res.message);
      Data.isLoading = false;
    }
  });
};
// 保存接口前校验
const saveCheck = (type) => {
  Data.isLoading = true;
  if (!Data.form.valuePlan) {
    window.$message.error('请选择所属阶段');
    Data.isLoading = false;
    return false;
  }
  if (!Data.form.type || Data.form.type.length === 0) {
    window.$message.error('请选择变更类型');
    Data.isLoading = false;
    return false;
  }
  if (Data.form.type.includes('进度变更')) {
    if (!planCheck()) {
      window.$message.error('请检查变更后时间');
      Data.isLoading = false;
      return false;
    }
  }
  if (Data.form.type.includes('目标/指标变更')) {
    if (!checkTarget()) {
      window.$message.error('目标指标的指标名称以及变更后的目标值为必填且指标名称不能重复，请检查目标指标');
      Data.isLoading = false;
      return false;
    }
  }
  if (Data.form.type.includes('薪酬包成员变更')) {
    if (Data.projectType === '产品开发类项目') {
      if (that.$refs.mainChangeTable.Data.isCheckMain && that.$refs.minorChangeTable.Data.isCheckMinor) {
        if (type === 'save') {
          save();
        } else {
          submit();
        }
      } else {
        Data.isLoading = false;
        window.$message.error('请先校验薪酬包成员的变更');
      }
    } else if (Data.projectType === '制造技术类项目' || Data.projectType === '信息技术类项目') {
      if (that.$refs.mainChangeTable.Data.isCheckMain) {
        if (type === 'save') {
          save();
        } else {
          submit();
        }
      } else {
        Data.isLoading = false;
        window.$message.error('请先校验薪酬包成员的变更');
      }
    }
  } else {
    if (type === 'save') {
      save();
    } else {
      submit();
    }
  }
};
// 校验目标/指标
const checkTarget = () => {
  let isTargetCheck = true;
  for (let i in that.$refs.targetTable.Data.tableDataList) {
    if (that.$refs.targetTable.Data.tableDataList[i].length > 0) {
      let newList = that.$refs.targetTable.Data.tableDataList[i].filter((item) => item.isDelete !== true);
      let repetition = newList.some((item, index) => {
        return newList.slice(index + 1).some((item2) => item.indicatorName === item2.indicatorName);
      });
      if (repetition) {
        isTargetCheck = false;
        // return window.$message.warning('指标名称不能重复');
      }
      const newData = that.$refs.targetTable.Data.tableDataList[i].filter((item) => item.targetCanChange === '是');
      newData.forEach((item) => {
        if (!item.indicatorName || !item.projectTargetValueChange) {
          isTargetCheck = false;
        }
      });
    }
  }
  return isTargetCheck;
};
// 获取阶段
const getPhaseColumns = () => {
  window.$api.payPacketApi.getPhaseNames({ oid: Data.parmasObj.oid }).then((res) => {
    if (res.success) {
      Data.phaseList = res.data.map((item) => {
        const obj = {};
        obj.label = item.name;
        obj.dataIndex = item.label;
        return obj;
      });
    } else {
      that.$message.error(res.message);
    }
  });
};
// 上传附件
const handleExceed = (file) => {
  Data.fileList = [];
  let fileList = [];
  fileList = file;
  if (fileList[0].status) {
    delete fileList[0].status;
  }
  Data.fileList = fileList;
};
// 选择变更类型
const changeCheckBox = (val) => {
  if (val.includes('项目属性变更')) {
    Data.arrowList.arrow1 = true;
    Data.editList.isEdit1 = true;
  } else {
    Data.editList.isEdit1 = false;
  }
  if (val.includes('目标/指标变更')) {
    Data.arrowList.arrow3 = true;
    Data.editList.isEdit3 = true;
  } else {
    Data.editList.isEdit3 = false;
  }
  if (val.includes('进度变更')) {
    Data.arrowList.arrow2 = true;
    Data.editList.isEdit2 = true;
  } else {
    Data.editList.isEdit2 = false;
  }
  if (val.includes('薪酬包成员变更')) {
    window.$api.projectChangeApi.hasEvaluationProcess({ oid: Data.parmasObj.oid }).then((res) => {
      if (res.success) {
        Data.arrowList.arrow4 = true;
        Data.editList.isEdit4 = true;
      } else {
        Data.form.type = Data.form.type.filter((item) => item !== '薪酬包成员变更');
        Data.arrowList.arrow4 = true;
        Data.editList.isEdit4 = false;
        window.$message.error(res.message);
      }
    });
  } else {
    Data.editList.isEdit4 = false;
  }
};
// 获取项目阶段列表
const getPlanList = () => {
  window.$api.projectChangeApi.getCurrentStage({ oid: Data.parmasObj.oid }).then((res) => {
    if (res.success) {
      Data.optionsPlan = [];
      const obj = {};
      obj.displayName = res.data.displayName;
      obj.activityOid = res.data.activityOid;
      Data.optionsPlan.push(obj);
      Data.form.valuePlan = res.data.displayName;
    } else {
      window.$message.error(res.message);
    }
  });
};
const cancel = () => {
  window.$navTagStore.removeTag(route, router);
  window.$navTagStore.removeCacheTag(route.name);
  router.push({ name: 'projectChange' });
};
// 进度变更校验
const planCheck = () => {
  let isMistake = true;
  const newD = that.$refs.milessChangeTable.Data.planTableData.filter((item) => !item.afterChange);
  if (newD.length === 0) {
    that.$refs.milessChangeTable.Data.planTableData.forEach((item, index) => {
      if (that.$refs.milessChangeTable.Data.planTableData.length - index >= 2) {
        if (dayjs(item.afterChange) > dayjs(that.$refs.milessChangeTable.Data.planTableData[index + 1].afterChange)) {
          isMistake = false;
        }
      }
    });
  } else {
    window.$message.error('变更时间不能为空');
    return;
  }
  return isMistake;
};
</script>

<style scoped lang="less">
.createProjectChange {
  // padding: 16px;
  .top_area {
    margin: 0 16px;
    padding: 16px 0;
    background: hsl(0, 0%, 100%);
    max-height: 210px;
    .tab_box {
      padding: 0 16px;
    }
    :deep(.el-form-item) {
      margin-bottom: 0px;
    }
  }
  .depart {
    background: #fff;
    // margin-bottom: 10px;
    .title_box {
      display: flex;
      align-items: center;
      height: 40px;
      border-bottom: 1px solid #dddddd;
      // padding: 0 16px;
      .hand_icon {
        margin-left: 16px;
        width: 14px;
        height: 14px;
        display: flex;
        border: 1px solid rgba(0, 0, 0, 0.06);
        color: #333333;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-right: 10px;
        &:hover {
          border: 1px solid #2664f6;
        }
      }
      .title {
        font-size: 16px;
        font-family: 'PingFangSC, PingFang SC';
        font-weight: 500;
        color: #333333;
      }
      .title1 {
        margin-left: 16px;
      }
    }
    .section-container {
      padding: 10px 16px;
      .contentTitle {
        color: #333;
        font-size: 16px;
        margin: 10px 0;
      }
    }
    // :deep(.el-form-item) {
    //   margin-bottom: 0px;
    // }
  }
  .second_area {
    margin-top: 20px;
    padding: 16px 0;
    background: hsl(0, 0%, 100%);
    .iconEdit {
      color: #f68800;
      margin-left: 5px;
      top: 5px;
    }
  }
  .second_area1 {
    margin-top: 0px;
  }
  .bottom_area {
    // padding: 0 8px 0 16px;
    height: calc(100vh - 400px);
    overflow-y: scroll;
    margin-top: 20px;
    margin: 16px 10px 0 16px;
  }
  .bottomConfirm {
    width: 100%;
    height: 56px;
    background: #fff;
    box-shadow: 2px 0px 4px 0px rgba(0, 0, 0, 0.2);
    border-radius: 1px;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    overflow-x: hidden;
    bottom: 0px;
    .bottomBtn {
      margin-top: 12px;
      margin-right: 30px;
    }
    .bottomBtn1 {
      margin-right: 0px;
    }
  }
}
</style>

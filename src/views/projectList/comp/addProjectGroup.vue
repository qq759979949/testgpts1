<template>
  <div class="addProjectGroup">
    <div class="title">自定义名称</div>
    <div class="tabName">
      <span class="icon">*</span>
      页签名称：
      <el-input placeholder="请输入" style="width: 300px" v-model="tabName"></el-input>
    </div>
    <div class="projectTitle">
      <div class="title">项目筛选条件</div>
      <!-- <el-input placeholder="请输入搜索关键词" style="width: 200px" :suffix-icon="Search" /> -->
    </div>
    <div class="filterCriteria">
      <el-row class="topSelect">
        <el-col :span="8" class="optionsName">
          <div class="leftLabel">项目名称：</div>
          <el-input placeholder="请输入" class="inputProject" v-model="project.projectName" clearable></el-input>
        </el-col>
        <el-col :span="8" class="optionsName">
          <div class="leftLabel">项目编号：</div>
          <el-input placeholder="请输入" class="inputProject" v-model="project.projectCode" clearable></el-input>
        </el-col>
        <el-col :span="8" class="optionsName">
          <div class="leftLabel">项目经理：</div>
          <!-- <el-input placeholder="请输入" class="inputProject" v-model="project.projectManager" clearable></el-input> -->
          <el-select
            v-model="project.projectManager"
            multiple
            filterable
            placeholder="请输入"
            class="inputProject"
            remote
            reserve-keyword
            clearable
            collapse-tags
            collapse-tags-tooltip
            :loading="loading"
            :remote-method="remoteMethod"
          >
            <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="topSelect">
        <el-col :span="8" class="optionsName">
          <div class="leftLabel">项目助理：</div>
          <!-- <el-input placeholder="请输入" class="inputProject" v-model="project.projectAssisant" clearable></el-input> -->
          <el-select
            v-model="project.projectAssisant"
            multiple
            filterable
            placeholder="请输入"
            class="inputProject"
            reserve-keyword
            clearable
            collapse-tags
            collapse-tags-tooltip
            :loading="loading"
            :remote-method="remoteMethod"
          >
            <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :span="8" class="optionsName">
          <div class="leftLabel">项目状态：</div>
          <el-select class="inputProject" placeholder="请选择" v-model="project.projectStatus" clearable multiple collapse-tags collapse-tags-tooltip>
            <el-option v-for="item1 in options1" :key="item1.display" :label="item1.display" :value="item1.display" />
          </el-select>
        </el-col>
        <el-col :span="8" class="optionsName">
          <div class="leftLabel">项目类型：</div>
          <el-select class="inputProject" placeholder="请选择" v-model="project.projectType" clearable multiple collapse-tags collapse-tags-tooltip>
            <el-option v-for="item1 in options" :key="item1.label" :label="item1.label" :value="item1.label" />
          </el-select>
        </el-col>
        <!-- <el-col :span="6" class="optionsName">
          <div class="leftLabel">二级部门：</div>
          <el-select class="inputProject" placeholder="请选择" v-model="project.secondaryDepartment" clearable>
            <el-option v-for="item1 in secondaryDepartmenOptions" :key="item1.label" :label="item1.label" :value="item1.label" />
          </el-select>
        </el-col> -->
        <!-- <el-col :span="12" class="optionsName">
          当前关键节点计划完成时间：
          <el-date-picker
            v-model="startValue"
            type="dates"
            placeholder="请选择开始日期"
          /> - 
          <el-date-picker
            v-model="endValue"
            type="dates"
            placeholder="请选择结束日期"
          />
        </el-col> -->
      </el-row>
      <el-row class="topSelect">
        <el-col :span="8" class="optionsName">
          <div class="leftLabel">一级部门：</div>
          <el-select class="inputProject" placeholder="请选择" v-model="project.projectGroupReference" clearable @change="changeGroup">
            <el-option v-for="item1 in primaryDepartmentOptions" :key="item1.value" :label="item1.label" :value="item1.label" @click="changePrimaryDepart(item1)" />
          </el-select>
        </el-col>
        <el-col :span="8" class="optionsName">
          <div class="leftLabel">二级部门：</div>
          <el-select class="inputProject" placeholder="请选择" v-model="project.secondaryDepartment" clearable>
            <el-option v-for="item1 in secondaryDepartmenOptions" :key="item1.label" :label="item1.label" :value="item1.label" />
          </el-select>
        </el-col>
        <el-col :span="8" class="optionsName">
          <div class="leftLabel">综合等级：</div>
          <el-select class="inputProject" placeholder="请选择" v-model="project.comprehensiveGrade" clearable>
            <el-option v-for="item1 in levelList" :key="item1" :label="item1" :value="item1" />
          </el-select>
        </el-col>
      </el-row>
      <el-row class="topSelect">
        <el-col :span="8" class="optionsName">
          <div class="leftLabel">健康状态：</div>
          <el-select class="inputProject" placeholder="请选择" v-model="project.healthStatus" clearable>
            <el-option v-for="item1 in statusList" :key="item1.value" :label="item1.label" :value="item1.value" />
          </el-select>
        </el-col>
        <el-col :span="8" class="optionsName">
          <div class="leftLabel">是否薪酬包项目：</div>
          <el-select class="inputProject" placeholder="请选择" v-model="project.packageProject" clearable>
            <el-option v-for="item1 in packageList" :key="item1.label" :label="item1.label" :value="item1.label" />
          </el-select>
        </el-col>
        <el-col :span="8" class="optionsName">
          <div class="leftLabel">创建时间：</div>
          <el-date-picker
            v-model="value4"
            type="daterange"
            placeholder="请选择时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="changeCreateTime"
            class="inputProject"
          />
        </el-col>
      </el-row>
      <el-row class="topSelect">
        <el-col :span="8" class="optionsName">
          <div class="leftLabel">实际开始时间：</div>
          <el-date-picker
            v-model="value5"
            type="daterange"
            placeholder="请选择时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="changeActivedTime"
            class="inputProject"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
// import PiTable from '@/components/pdcCustom/PiTable.vue';
// import { getProjectList } from '@/api/project';
// import { getAllInstantiableSubTypes } from '@/api/common';
import { getSecondaryDepartments } from '@/api/project';
import { getAllUser } from '@/api/team';
export default {
  // components: { PiTable },
  props: {
    oldTabName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tableLoad: false,
      page: 1,
      range: 10,
      total: 0,
      options: [],
      options1: [],
      startValue: '',
      endValue: '',
      project: {},
      tabName: '',
      primaryDepartmentOptions: [],
      secondaryDepartmenOptions: [],
      levelList: [],
      packageList: [
        {
          label: '是',
        },
        {
          label: '否',
        },
      ],
      value4: [],
      value5: [],
      userInfo: JSON.parse(window.$Cookies.get('userInfo')),
      userList: [],
      loading: false,
      statusList: [
        {
          label: '灰',
          value: 'UNAVAILABLE',
        },
        {
          label: '绿',
          value: 'GREEN',
        },
        {
          label: '红',
          value: 'RED',
        },
        {
          label: '黄',
          value: 'YELLOW',
        },
      ],
    };
  },
  mounted() {
    // this.getProjectList();
    this.getProjectType();
    this._queryStatesByLifeCycleTemplate();
    this._searchPrimaryDepartment1();
    this.getGradingList();
  },
  methods: {
    changeSelect(value) {
      this.$emit('changeSelectTab', value);
    },
    updateTableData() {},
    // getProjectList() {
    //   const params = {
    //     projectCode: this.project.projectShortName,
    //     projectManager: this.project.projectManager,
    //     projectName: this.project.projectName,
    //     projectStatus: this.project.state,
    //     projectType: this.project.type,
    //   };
    //   getProjectList(params).then((res) => {
    //     if (res.success) {
    //       let arr = res.data.length > 0 ? res.data : [];
    //       this.tableData = arr;
    //       this.tableDataCopy = arr;
    //       // projectData.sessionId = res.data.sessionId
    //     } else {
    //       this.$message.warning(res.message + '失败！');
    //     }
    //     this.tableLoad = false;
    //   });
    // },
    // clearSectionTable() {
    //   this.$refs.addTableTab.clearSelection();
    // },
    // toggleSelection(row) {
    //   this.$refs.addTableTab.toggleSelection(row);
    // },
    // 获取项目类型
    getProjectType() {
      let typeParmas = {
        type: 'com.pisx.pmgt.project.PIProject',
        includeSelf: 'true',
      };
      window.$api.commonApi.getAllSubTypes(typeParmas).then((res) => {
        if (res.success) {
          for (let key in res.data.options) {
            let obj = {};
            obj.value = key;
            obj.label = res.data.options[key];
            this.options.push(obj);
          }
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 获取项目状态
    _queryStatesByLifeCycleTemplate() {
      let params = new FormData();
      params.append('lifeCycleTemplateName', 'PIProjectLC');
      window.$api.reportToolsApi.queryStatesByLifeCycleTemplate(params).then((res) => {
        if (res.success) {
          this.options1 = res.data ? res.data : [];
        } else {
          window.$message.error(res.message);
        }
      });
    },
    // 获取一级部门      查询联动的下拉用完整的oid,   查询表格用中文
    _searchPrimaryDepartment1() {
      window.$api.reportToolsApi.searchPrimaryDepartment1().then((res) => {
        if (res.success) {
          let obj = res.data.map((e) => {
            return {
              label: e.name,
              value: e.oid,
            };
          });
          this.primaryDepartmentOptions = obj;
        }
      });
    },
    // // 搜索条件
    // searchProject () {
    //   for (let key in this.project) {
    //     if (this.project[key]) {
    //       this.tableData = this.tableDataCopy.filter(item => {
    //         if (item[key] && item[key].includes(this.project[key])) {
    //           return item
    //         }
    //       })
    //     }
    //   }
    // }
    // 获取评级的列表
    getGradingList() {
      window.$api.reportToolsApi.getProjectLevelConfigJson().then((res) => {
        if (res.success) {
          let data = JSON.parse(res.data);
          this.levelList = [];
          for (let i in data) {
            this.levelList = [...this.levelList, ...data[i]];
          }
          this.levelList = Array.from(new Set(this.levelList));
        } else {
          this.$message.error(res.message);
        }
      });
    },
    changeCreateTime(val) {
      this.project.startCreateTime = val[0];
      this.project.endCreateTime = val[1];
    },
    changeActivedTime(val) {
      this.project.startActualProjectStartTime = val[0];
      this.project.endActualProjectStartTime = val[1];
    },
    // 获取项目经理/项目助理
    remoteMethod(user) {
      this.loading = true;
      getAllUser({ pageSize: 10000, pageNo: 1, id: null, thirdPartySystemId: 1, realname: user }).then((res) => {
        if (res.code === 200) {
          this.loading = false;
          this.userList = res.data.contents;
          this.userList.map((item) => {
            item.label = `${item.realname}(${item.username})`;
            item.value = `${item.realname}(${item.username})`;
          });
        } else {
          this.loading = false;
          window.$message.error(res.message);
        }
      });
    },
    // 获取二级部门
    changeGroup(val) {
      if (!val) {
        this.secondaryDepartmenOptions = [];
        this.project.secondaryDepartment = '';
      }
    },
    changePrimaryDepart(item) {
      this.project.secondaryDepartment = '';
      this.secondaryDepartmenOptions = [];
      getSecondaryDepartments({ oid: item.value }).then((res) => {
        if (res.success) {
          const projectGroupList = [];
          for (let key in res.data.options) {
            let obj1 = {};
            obj1.value = key;
            obj1.label = res.data.options[key];
            projectGroupList.push(obj1);
          }
          this.secondaryDepartmenOptions = projectGroupList;
        } else {
          this.$message.error(res.message);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.addProjectGroup {
  .title {
    font-size: 16px;
    font-weight: 550;
    color: #333333;
    line-height: 22px;
    margin-bottom: 10px;
  }
  .tabName {
    font-size: 14px;
    color: #666666;
    margin-bottom: 10px;
    .icon {
      color: red;
      margin-right: 5px;
    }
  }
  .projectTitle {
    display: flex;
    justify-content: space-between;
  }
  .optionsName {
    display: flex;
    justify-content: flex-start;
    line-height: 32px;
    // width: 200px;
    word-wrap: break-word;
    .leftLabel {
      width: 150px;
      word-wrap: break-word;
      text-align: right;
    }
    .leftLabel1 {
      margin-left: 20px;
    }
    .inputProject {
      width: 270px;
    }
  }
  .topSelect {
    margin: 10px 0;
  }
  :deep(.el-range-editor.el-input__wrapper) {
    width: 200px;
  }
}
</style>

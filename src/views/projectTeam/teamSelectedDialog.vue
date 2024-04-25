<template>
  <div class="selectedDialog">
    <el-dialog v-model="isShowDialog" :title="title" :width="diaglogWidth" @close="close" v-if="isShowDialog">
      <div>
        <slot name="top"></slot>
        <el-tabs v-model="activeTab" @tab-click="TabChange" v-if="!changeDisabled">
          <el-tab-pane label="&nbsp&nbsp成员&nbsp&nbsp" name="member">
            <el-row :gutter="10">
              <el-col :span="isright ? 15 : 24">
                <div class="searchRow">
                  <el-input v-model="searchValue" class="fr" @input="searchUser" style="width: 240px" clearable placeholder="请输入">
                    <template #suffix>
                      <el-icon class="el-input__icon"><Search /></el-icon>
                    </template>
                  </el-input>
                </div>
                <div class="userRow mb12">
                  <div class="allChecked pl12">
                    <el-checkbox v-if="!isSingle" v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"></el-checkbox>
                    <span class="allText">{{ userText }}</span>
                  </div>
                  <div class="checkbox-container" v-loading="isLoading">
                    <el-scrollbar>
                      <template v-if="!isSingle">
                        <el-checkbox-group v-model="checkList">
                          <el-checkbox v-for="item in searchList" :key="item[defaultProps.key]" :label="item[defaultProps.key]">
                            <slot name="checkItem">
                              <div class="item-box">
                                {{ item[defaultProps.label] }}
                                <span>{{ item[defaultProps.desc] }}</span>
                              </div>
                            </slot>
                          </el-checkbox>
                        </el-checkbox-group>
                      </template>
                      <el-radio-group v-model="selected" v-else>
                        <el-radio v-for="item in searchList" :key="item[defaultProps.key]" :label="item[defaultProps.key]">
                          <div class="item-box">
                            {{ item[defaultProps.label] }}
                            <span>{{ item[defaultProps.desc] }}</span>
                          </div>
                        </el-radio>
                      </el-radio-group>
                    </el-scrollbar>
                  </div>
                </div>
              </el-col>
              <el-col :span="9" v-if="isright" class="right-role">
                <div class="label">
                  <span style="color: red">*</span>
                  <div>主/配包：</div>
                  <el-select style="width: 176px" v-model="userInfoForm.packageType">
                    <el-option v-for="item in mainOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </div>
                <div class="label">
                  <span style="color: red">*</span>
                  <div>成员类型：</div>
                  <el-select style="width: 176px" v-model="userInfoForm.memberType">
                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </div>
                <div class="label">
                  <div :class="{ 'pi-is-required': userInfoForm.packageType === 1 || userInfoForm.packageType === 2 }">项目分工：</div>
                  <el-input style="width: 176px" v-model="userInfoForm.projectDuty" :rows="2" type="textarea" />
                </div>
              </el-col>
              <div class="selectedRow">
                <el-scrollbar height="32px" v-if="!isSingle">
                  <el-tag v-for="item in selectedList" :key="item[defaultProps.key]" class="mr12 mb8" closable @close="removeTag(item)">
                    <span class="tag-name">{{ item[defaultProps.label] }}</span>
                    {{ item[defaultProps.desc] }}
                  </el-tag>
                </el-scrollbar>
              </div>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="&nbsp&nbsp&nbsp组&nbsp&nbsp&nbsp" name="group">
            <div class="searchRow">
              <el-input v-model="searchGroupValue" class="fr" style="width: 240px" @input="searchGroup" clearable placeholder="请输入">
                <template #suffix>
                  <el-icon class="el-input__icon"><Search /></el-icon>
                </template>
              </el-input>
            </div>
            <div class="userRow mb12">
              <div class="allChecked pl12">
                <el-checkbox v-model="checkGroupAll" :indeterminate="isGroupIndeterminate" v-if="!isSingle" @change="handleGroupCheckAll"></el-checkbox>
                <span class="allText">{{ groupText }}</span>
              </div>
              <div class="checkbox-container group" v-loading="isLoading">
                <el-scrollbar height="230px">
                  <el-checkbox-group v-model="groupCheckList" v-if="!isSingle">
                    <el-checkbox v-for="item in groupList" :key="item[this.defaultProps.key]" :label="item[this.defaultProps.key]">
                      <slot name="checkItem">
                        <div class="item-box">
                          {{ item[this.defaultProps.label] }}
                        </div>
                      </slot>
                    </el-checkbox>
                  </el-checkbox-group>
                  <el-radio-group v-model="groupRadioData" v-else>
                    <el-radio :label="item[this.defaultProps.key]" v-for="item in groupList">
                      <slot name="checkItem">
                        <div class="item-box">
                          {{ item[this.defaultProps.label] }}
                        </div>
                      </slot>
                    </el-radio>
                  </el-radio-group>
                </el-scrollbar>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="edit-container" v-else>
          <div class="form-row">
            <span style="color: red">*</span>
            <div class="form-label">主/配包：</div>
            <el-select style="width: 272px" v-model="userInfoForm.packageType">
              <el-option v-for="item in mainOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div class="form-row">
            <span style="color: red">*</span>
            <div class="form-label">成员类型：</div>
            <el-select style="width: 272px" v-model="userInfoForm.memberType">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div class="form-row">
            <div class="form-label" :class="{ 'pi-is-required': userInfoForm.packageType === 1 || userInfoForm.packageType === 2 }">项目分工：</div>
            <el-input style="width: 272px" v-model="userInfoForm.projectDuty" :rows="2" type="textarea" />
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer" v-if="!showApply">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submit" :loading="btnLoading">确认</el-button>
        </span>
        <span class="dialog-footer" v-else>
          <el-button @click="submit" :loading="btnLoading">确认</el-button>
          <el-button type="primary" @click="apply" :loading="btnLoading">应用</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import * as _ from 'lodash';
import { getAllUser, lastUser, lastUserGroup } from '@/api/team';
export default {
  name: 'teamSelectedDialog',
  props: {
    isShow: {
      type: Boolean,
    },
    isSingle: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
    },
    departmentList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    defaultValue: {
      type: Array,
      default: () => {
        return [];
      },
    },
    showApply: {
      type: Boolean,
      default: false,
    },
    changeDisabled: {
      type: Boolean,
      default: false,
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          key: 'id',
          label: 'name',
          desc: 'desc',
        };
      },
    },
    isright: {
      type: Boolean,
      default: false,
    },
    diaglogWidth: {
      type: Number,
      default: 600,
    },
    userInfo: {
      type: Object,
      default: () => {
        return {
          memberType: null,
          packageType: null,
          projectDuty: '',
        };
      },
    },
    btnLoading: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
      isShowDialog: false,
      searchValue: '',
      searchGroupValue: '',
      checkAll: false,
      checkGroupAll: false,
      checkList: [],
      groupCheckList: [],
      groupRadioData: null,
      isLoading: false,
      selected: null,
      activeTab: 'member',
      mainOptions: [],
      typeOptions: [
        {
          label: '核心成员',
          value: 1,
        },
        {
          label: '一般成员',
          value: 2,
        },
        {
          label: '支持成员',
          value: 3,
        },
        {
          label: '其他',
          value: 4,
        },
      ],
      userInfoForm: {
        packageType: '',
        memberType: '',
        projectDuty: '',
      },
      searchList: [],
      groupList: [],
      userListAll: [],
    };
  },
  watch: {
    async isShow(val) {
      this.isShowDialog = val;
      this.checkList = [];
      this.groupCheckList = [];
      this.groupRadioData = null;
      this.searchGroupValue = '';
      this.selected = null;
      this.searchValue = '';
      this.activeTab = 'member';
      if (!this.changeDisabled) {
        this.getUserList();
        this.getGroupList();
      }
      if (val) {
        // 回显
        if (this.userInfo.packageType) {
          this.userInfoForm.packageType = this.userInfo.packageType;
        } else {
          this.userInfoForm.packageType = null;
        }
        if (this.userInfo.memberType) {
          this.userInfoForm.memberType = this.userInfo.memberType;
        } else {
          this.userInfoForm.memberType = null;
        }
        if (this.userInfo.projectDuty) {
          this.userInfoForm.projectDuty = this.userInfo.projectDuty;
        } else {
          this.userInfoForm.projectDuty = '';
        }
      }
    },
  },
  computed: {
    selectedList() {
      if (this.isSingle) {
        return this.selected;
      } else {
        return this.searchList.filter((el) => this.checkList.indexOf(el[this.defaultProps.key]) > -1);
      }
    },
    selectedGroup() {
      if (this.isSingle) {
        return this.groupRadioData;
      } else {
        return this.groupList.filter((el) => this.groupCheckList.indexOf(el[this.defaultProps.key]) > -1);
      }
    },
    isIndeterminate() {
      let l = this.searchList.filter((el) => this.checkList.indexOf(el[this.defaultProps.key]) > -1).length;
      this.checkAll = l > 0 && l === this.searchList.length;
      return l > 0 && l < this.searchList.length;
    },
    isGroupIndeterminate() {
      let l = this.groupList.filter((el) => this.groupCheckList.indexOf(el[this.defaultProps.key]) > -1).length;
      this.checkGroupAll = l > 0 && l === this.groupList.length;
      return l > 0 && l < this.groupList.length;
    },
    userText() {
      return this.searchValue ? '搜索结果' : '近期使用';
    },
    groupText() {
      return this.searchGroupValue ? '搜索结果' : '近期使用';
    },
  },
  created() {
    let projecTyp = JSON.parse(sessionStorage.getItem('currentProject')) || JSON.parse(sessionStorage.getItem('taskProject'));
    if (projecTyp.type === '产品开发类项目') {
      this.mainOptions.push(
        {
          label: '主包成员',
          value: 1,
        },
        {
          label: '配包成员',
          value: 2,
        },
        {
          label: '其他',
          value: 3,
        },
      );
    } else {
      this.mainOptions.push(
        {
          label: '主包成员',
          value: 1,
        },
        {
          label: '其他',
          value: 3,
        },
      );
    }
  },
  mounted() {
    const params = {
      pageNo: 1,
      pageSize: 9999,
    };
    const getDeptVal = (val) => {
      const obj = this.departmentList.find((item) => item.id === val);
      if (obj) {
        return obj.name;
      } else {
        return '-';
      }
    };
    this.isLoading = true;
    getAllUser(params).then((res) => {
      this.isLoading = false;
      if (res.success) {
        const userList = res.data.contents;
        this.userListAll = [];
        userList.forEach((item) => {
          item.name = `${item.realname}(${item.username})`;
          item.desc = getDeptVal(item.mainDepartmentId);
          this.userListAll.push(item);
        });
      } else {
        this.$message.warning(res.message);
      }
    });
    this.searchUser = _.debounce(() => {
      // 人为防抖 如果是change事件 输入完要blur或者回车就可以直接调用里面的方法，看客户需求
      this.getUserList();
    }, 800);
    this.searchGroup = _.debounce(() => {
      this.getGroupList();
    }, 800);
  },
  methods: {
    TabChange() {},
    close() {
      this.checkList = [];
      this.groupCheckList = [];
      this.$emit('update:isShow', false);
      this.$emit('close');
    },
    submit() {
      if (this.activeTab === 'member') {
        this.$emit('submit', this.selectedList, this.userInfoForm);
      } else {
        // group
        this.$emit('submit', this.selectedGroup, null);
      }
    },
    apply() {
      if (this.activeTab === 'member') {
        this.$emit('submit', this.selectedList, this.userInfoForm, true);
      } else {
        // group
        this.$emit('submit', this.selectedGroup, null, true);
      }
    },
    handleCheckAllChange(val) {
      this.searchList_filter.forEach((el) => {
        if (val) {
          this.checkList.indexOf(el[this.defaultProps.key]) === -1 && this.checkList.push(el[this.defaultProps.key]);
        } else {
          let i = this.checkList.indexOf(el[this.defaultProps.key]);
          i > -1 && this.checkList.splice(i, 1);
        }
      });
    },
    handleGroupCheckAll(val) {
      this.groupList_filter.forEach((el) => {
        if (val) {
          this.groupCheckList.indexOf(el[this.defaultProps.key]) === -1 && this.groupCheckList.push(el[this.defaultProps.key]);
        } else {
          let i = this.groupCheckList.indexOf(el[this.defaultProps.key]);
          i > -1 && this.groupCheckList.splice(i, 1);
        }
      });
    },
    removeTag(user) {
      let i = this.checkList.indexOf(user[this.defaultProps.key]);
      i > -1 && this.checkList.splice(i, 1);
    },
    resetForm() {
      this.userInfoForm.packageType = '';
      this.userInfoForm.memberType = '';
      this.userInfoForm.projectDuty = '';
      this.checkList = [];
      this.groupCheckList = [];
      this.groupRadioData = null;
      this.selected = null;
      this.searchValue = '';
      this.searchGroupValue = '';
    },
    getUserList() {
      const params = {
        username: this.searchValue,
        pageNo: 1,
        pageSize: 9999,
      };
      const getDeptVal = (val) => {
        const obj = this.departmentList.find((item) => item.id === val);
        if (obj) {
          return obj.name;
        } else {
          return '-';
        }
      };
      this.isLoading = true;
      lastUser(params).then((res) => {
        this.isLoading = false;
        if (res.success) {
          const userList = res.data;
          this.searchList = [];
          userList.forEach((item) => {
            item.name = `${item.realname}(${item.username})`;
            item.desc = getDeptVal(item.mainDepartmentId);
            this.searchList.push(item);
          });
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    getGroupList() {
      const params = {
        userGroupName: this.searchGroupValue,
        pageNo: 1,
        pageSize: 9999,
      };
      this.isLoading = true;
      lastUserGroup(params).then((res) => {
        this.isLoading = false;
        if (res.success) {
          this.groupList = res.data.map((item) => {
            return {
              id: item.id,
              name: item.groupName,
            };
          });
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    setProjectDuty(val) {
      this.userInfoForm.projectDuty = val;
    },
    emptySelect() {
      this.userInfoForm.packageType = '';
      this.userInfoForm.memberType = '';
      this.checkList = [];
      this.groupCheckList = [];
      this.groupRadioData = null;
      this.selected = null;
      this.searchValue = '';
      this.searchGroupValue = '';
    },
  },
};
</script>

<style scoped lang="scss">
.selectedDialog {
  :deep(.el-dialog__header) {
    border-bottom: 1px solid var(--el-border-color);
    margin-right: 0;
  }
  :deep(.el-dialog__body) {
    padding-top: 20px;
    padding-bottom: 20px;
    .searchRow {
      display: inline-block;
      width: 100%;
      margin-bottom: 4px;
    }
    .el-tabs__header {
      margin-bottom: 12px;
    }
    .edit-container {
      .form-row {
        margin-bottom: 10px;
        padding-left: 10px;
        .form-label {
          display: inline-block;
          width: 100px;
          vertical-align: top;
        }
      }
    }
  }
  :deep(.el-dialog__footer) {
    border-top: 1px solid var(--el-border-color);
  }
  :deep(.el-tabs__content) {
    height: 316px;
  }
  :deep(.el-checkbox__label) {
    width: calc(100% - 12px);
    .item-box {
      width: 100%;
      span {
        float: right;
        font-size: 12px;
        color: #999;
        vertical-align: bottom;
      }
    }
  }
  .allText {
    position: relative;
    left: 8px;
    top: -2px;
  }
  .right-role {
    margin-top: 48px;
    .label {
      margin-left: 20px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
  }
  .userRow {
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    .allChecked {
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid var(--el-border-color-light);
    }
    .checkbox-container {
      height: 190px;
      .user {
        padding: 0 12px;
        &:hover {
          background: var(--el-color-primary-light-9);
        }
        .position {
          float: right;
          margin-top: -1px;
          color: var(--el-text-color-secondary);
          font-size: 12px;
          line-height: 32px;
        }
      }
      :deep(.el-radio) {
        width: calc(100% - 12px);
        padding-left: 16px;
        margin-right: 0;
      }
      .el-radio-group {
        width: 460px;
        :deep(.el-radio__label) {
          width: 100%;
          .item-box {
            width: 100%;
            span {
              float: right;
              font-size: 12px;
              color: #999;
              vertical-align: bottom;
            }
          }
        }
      }
      :deep(.el-checkbox-group .el-checkbox) {
        width: 100%;
        padding: 0 16px 0 12px;
        margin-right: 0;
      }
    }
    .group {
      height: 230px;
    }
  }
  .selectedRow {
    padding: 0 5px;
    .el-tag__content {
      .tag-name {
        padding: 0 8px 0 4px;
      }
    }
  }
}
</style>

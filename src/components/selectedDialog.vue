<template>
  <div class="selectedDialog">
    <el-dialog v-model="isShowDialog" :title="title" :width="diaglogWidth" @close="close">
      <div>
        <slot name="top"></slot>
        <el-row>
          <el-col :span="isright ? 14 : 24">
            <div class="searchRow mb16">
              <el-input v-model="searchValue" style="width: 240px" placeholder="请输入搜索关键词">
                <template #suffix>
                  <el-icon class="el-input__icon"><Search /></el-icon>
                </template>
              </el-input>
            </div>
            <div class="userRow mb12" v-loading="isContentLoading">
              <div class="allChecked pl12">
                <el-checkbox v-if="!isSingle" v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"></el-checkbox>
                <span class="allText">{{ allText }}</span>
              </div>
              <div class="userList">
                <el-scrollbar>
                  <template v-if="!isSingle">
                    <el-checkbox-group v-model="checkList">
                      <el-checkbox v-for="item in searchList_filter" :key="item[defaultProps.key]" :label="item[defaultProps.key]">
                        <slot name="checkItem">
                          <div>
                            {{ item[defaultProps.label] }}
                          </div>
                        </slot>
                      </el-checkbox>
                    </el-checkbox-group>
                  </template>
                  <el-radio-group v-model="selected" v-else>
                    <el-radio v-for="item in searchList_filter" @change="handleSelectChange_Single($event, item)" :key="item[defaultProps.key]" :label="item[defaultProps.key]">
                      {{ item[defaultProps.label] }} ({{ item.pdcUser }})
                    </el-radio>
                  </el-radio-group>
                </el-scrollbar>
              </div>
            </div>
            <div class="selectedRow" v-if="!isSingle">
              <el-tag v-for="item in selectedList" :key="item[defaultProps.key]" class="mr12 mb8" closable @close="removeTag(item)">
                {{ item[defaultProps.label] }}
              </el-tag>
            </div>
          </el-col>
          <el-col :span="10" v-if="isright" class="right-role">
            <div class="label">
              <div>主配包：</div>
              <el-select style="width: 200px"></el-select>
            </div>
            <div class="label">
              <div>成员类型：</div>
              <el-select style="width: 200px"></el-select>
            </div>
            <div class="label">
              <div>项目分工：</div>
              <el-input style="width: 200px" :rows="2" type="textarea" />
            </div>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submit" :loading="loading">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'selectedDialog',
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
    allText: {
      type: String,
    },
    searchList: {
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
    defaultProps: {
      type: Object,
      default: () => {
        return {
          key: 'id',
          label: 'name',
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
    loading: {
      type: Boolean,
      default: false,
    },
    isContentLoading: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
      isShowDialog: false,
      searchValue: '',
      checkAll: false,
      checkList: [],
      selected: null,
      selectedRadioData: null,
    };
  },
  watch: {
    isShow(val) {
      this.isShowDialog = val;
      this.checkList = [];
      if (this.defaultValue.length > 0 && !this.isSingle) {
        this.defaultValue.forEach((item) => {
          let info = this.searchList.find((user) => user[this.defaultProps.label] === item);
          this.checkList.push(info.id);
        });
      } else if (this.defaultValue.length > 0 && this.isSingle) {
        this.selected = this.searchList.find((user) => user[this.defaultProps.label] === this.defaultValue[0])[this.defaultProps.key];
        this.selectedRadioData = [this.searchList.find((user) => user[this.defaultProps.label] === this.defaultValue[0])];
      }
    },
  },
  computed: {
    searchList_filter() {
      return this.searchList.filter((el) => el[this.defaultProps.label].indexOf(this.searchValue) > -1 || el.pdcUser.indexOf(this.searchValue) > -1);
    },
    selectedList() {
      if (this.isSingle) {
        return this.selectedRadioData;
      } else {
        return this.searchList.filter((el) => this.checkList.indexOf(el[this.defaultProps.key]) > -1);
      }
    },
    isIndeterminate() {
      let l = this.searchList_filter.filter((el) => this.checkList.indexOf(el[this.defaultProps.key]) > -1).length;
      this.checkAll = l > 0 && l === this.searchList_filter.length;
      return l > 0 && l < this.searchList_filter.length;
    },
  },
  created() {},
  mounted() {},
  methods: {
    close() {
      this.checkList = [];
      this.$emit('update:isShow', false);
    },
    submit() {
      this.$emit('submit', this.selectedList);
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
    removeTag(user) {
      let i = this.checkList.indexOf(user[this.defaultProps.key]);
      i > -1 && this.checkList.splice(i, 1);
    },
    handleSelectChange_Single(val, user) {
      this.selectedRadioData = [user];
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
  }
  :deep(.el-dialog__footer) {
    border-top: 1px solid var(--el-border-color);
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
    .userList {
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
        width: calc(100% - 32px);
        padding-left: 16px;
      }
      :deep(.el-checkbox-group .el-checkbox) {
        width: calc(100% - 32px);
        padding-left: 12px;
      }
    }
  }
}
</style>

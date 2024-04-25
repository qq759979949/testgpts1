<!--选人组件-->
<template>
  <div class="selectedDialog">
    <el-dialog draggable v-model="isShowDialog" :title="title" :width="width" @close="close" :close-on-click-modal="false">
      <div v-loading="contentLoading">
        <slot name="top"></slot>
        <div class="searchRow mb20">
          <el-input v-model="searchValue" style="width: 240px" placeholder="请输入搜索关键词">
            <template #suffix>
              <el-icon class="el-input__icon"><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="userRow mb10">
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
                      <div style="display: flex; justify-content: space-between">
                        <div>{{ item[defaultProps.label] }}</div>
                        <div style="color: #999">{{ item[defaultProps.depart] }}</div>
                      </div>
                    </slot>
                  </el-checkbox>
                </el-checkbox-group>
              </template>
              <el-radio-group v-model="selected" v-else>
                <el-radio v-for="item in searchList_filter" @change="handleSelectChange_Single($event, item)" :key="item[defaultProps.key]" :label="item[defaultProps.key]">
                  {{ item[defaultProps.label] }}
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
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <div v-loading="loading" style="margin-left: 10px">
            <el-button type="primary" @click="submit">确认</el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'selectedDialog',
  props: {
    // 控制显示
    isShow: {
      type: Boolean,
    },
    // 是否单选
    isSingle: {
      type: Boolean,
      default: false,
    },
    // 标题
    title: {
      type: String,
    },
    // 全选框右边的label
    allText: {
      type: String,
    },
    // 数据列表
    searchList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 默认勾选的列表
    defaultValue: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 默认属性的数据格式
    defaultProps: {
      type: Object,
      default: () => {
        return {
          key: 'id',
          label: 'name',
        };
      },
    },
    width: {
      type: Number,
      default: 600,
    },
    // 确定按钮是否
    loading: {
      type: Boolean,
      default: false,
    },
    // 内容加载状态
    contentLoading: {
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
    searchValue: {
      handler(newVal) {
        this.searchList.filter((el) => el[this.defaultProps.label].indexOf(newVal) > -1); // 原始数据过滤
        this.$emit('searchUserList', newVal);
      },
      deep: true,
    },
  },
  computed: {
    searchList_filter() {
      // return this.searchList; // 返回搜索
      return this.searchList.filter((el) => el[this.defaultProps.label].indexOf(this.searchValue) > -1); // 原始数据过滤
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
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
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

<style scoped lang="less">
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
        width: calc(100% - 1px);
        padding-left: 12px;
      }
      :deep(.is-checked) {
        background-color: #e8f0fd;
      }
      :deep(.el-checkbox__label) {
        width: 100%;
        padding-right: 10px;
      }
    }
  }
}
:deep(.el-loading-spinner .circular) {
  width: 30px;
}
.dialog-footer {
  display: flex;
  justify-content: end;
}
</style>

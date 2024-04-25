<template>
  <div class="selectedDialog">
    <el-dialog v-model="isShowDialog" :title="title" width="600" @close="close">
      <div>
        <slot name="top"></slot>
        <div class="searchRow mb16">
          <el-input v-model="searchValue" style="width: 240px" placeholder="请输入搜索关键词">
            <template #suffix>
              <el-icon class="el-input__icon"><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="userRow mb12">
          <div class="allChecked pl12">
            <!-- <el-checkbox
              v-if="!isSingle"
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange">
            </el-checkbox> -->
            <span class="allText">{{ allText }}</span>
          </div>
          <div class="userList">
            <el-scrollbar>
              <template v-if="!isSingle">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox v-for="item in searchList_filter" :key="item[defaultProps.value]" :label="item[defaultProps.value]">
                    <slot name="checkItem">
                      <div>{{ item[defaultProps.label] }}({{ item[defaultProps.value] }})</div>
                    </slot>
                  </el-checkbox>
                </el-checkbox-group>
              </template>
              <el-radio-group v-model="selected" v-else>
                <el-radio v-for="item in searchList_filter" @change="handleSelectChange_Single($event, item)" :key="item[defaultProps.value]" :label="item[defaultProps.value]">
                  {{ item[defaultProps.label] }}
                </el-radio>
              </el-radio-group>
            </el-scrollbar>
          </div>
        </div>
        <div class="selectedRow" v-if="!isSingle">
          <el-tag v-for="item in selectedList" :key="item[defaultProps.value]" class="mr12 mb8" closable @close="removeTag(item)">
            {{ item[defaultProps.label] }}({{ item[defaultProps.value] }})
          </el-tag>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { findUser } from '@/api/project';
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
      // 列表标题
      type: String,
      default: '用户列表',
    },
    searchList: {
      // 数据源
      type: Array,
      default: () => {
        return [];
      },
    },
    defaultValue: {
      type: [Array, String],
      default: null,
    },
    defaultProps: {
      // 默认数据配置
      type: Object,
      default: () => {
        return {
          value: 'value',
          label: 'label',
        };
      },
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
      sourceList: [],
    };
  },
  watch: {
    isShow(val) {
      this.isShowDialog = val;
      this.checkList = [];
      if (Array.isArray(this.defaultValue) && this.defaultValue.length > 0 && !this.isSingle) {
        this.defaultValue.forEach((item) => {
          let info = this.sourceList.find((user) => user[this.defaultProps.label] === item);
          if (info) {
            this.checkList.push(info[this.defaultProps.value]);
          }
        });
      } else if (typeof this.defaultValue === 'string' && this.defaultValue.length > 0 && this.isSingle) {
        this.selected = this.sourceList.find((user) => user[this.defaultProps.label] === this.defaultValue[0])[this.defaultProps.value];
        this.selectedRadioData = this.source.find((user) => user[this.defaultProps.label] === this.defaultValue);
      }
    },
  },
  computed: {
    searchList_filter() {
      if (this.searchValue) {
        return this.sourceList.filter((el) => el[this.defaultProps.label].indexOf(this.searchValue) > -1);
      } else {
        return this.sourceList;
      }
    },
    selectedList() {
      if (this.isSingle) {
        return this.selectedRadioData;
      } else {
        return this.sourceList.filter((el) => this.checkList.indexOf(el[this.defaultProps.value]) > -1);
      }
    },
    // isIndeterminate () {
    //   let l = this.searchList_filter.filter(el => this.checkList.indexOf(el[this.defaultProps.value]) > -1).length
    //   this.checkAll = l > 0 && l === this.searchList_filter.length
    //   return l > 0 && l < this.searchList_filter.length
    // }
  },
  created() {},
  mounted() {
    if (this.searchList.length > 0) {
      this.sourceList = this.searchList;
    } else {
      findUser({}).then((res) => {
        this.sourceList = res.data;
      });
    }
  },
  methods: {
    close() {
      this.checkList = [];
      this.$emit('update:isShow', false);
    },
    submit() {
      this.$emit('submit', this.selectedList);
    },
    // handleCheckAllChange (val) {
    //   this.searchList_filter.forEach(el => {
    //     if (val) {
    //       this.checkList.indexOf(el[this.defaultProps.value]) === -1 && this.checkList.push(el[this.defaultProps.value])
    //     } else {
    //       let i = this.checkList.indexOf(el[this.defaultProps.value])
    //       i > -1 && this.checkList.splice(i, 1)
    //     }
    //   })
    // },
    removeTag(user) {
      let i = this.checkList.indexOf(user[this.defaultProps.value]);
      i > -1 && this.checkList.splice(i, 1);
    },
    handleSelectChange_Single(val, user) {
      this.selectedRadioData = user;
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
  .selectedRow {
    min-height: 32px;
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
        width: calc(100% - 32px);
        padding-left: 12px;
      }
    }
  }
}
</style>

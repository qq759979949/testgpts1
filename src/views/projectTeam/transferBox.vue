<template>
  <div>
    <el-dialog v-model="isShowDialog" :title="title" width="800" @close="close">
      <div class="main-section">
        <div class="section-left">
          <div class="section-title">可选角色（共{{ leftList.length }}个）</div>
          <div class="section-box">
            <div class="section-top">
              <el-checkbox v-model.trim="isCheckedAll_left" :indeterminate="indeterminate_left" @change="checkAll_left">
                {{ leftCheckedList.length }}/{{ leftList.length }}条
              </el-checkbox>
            </div>
            <div class="section-bottom">
              <el-input placeholder="请输入搜索内容" style="marginbottom: 4px" v-model="leftSearchValue">
                <template #suffix>
                  <el-icon class="el-input__icon"><Search /></el-icon>
                </template>
              </el-input>
              <el-scrollbar height="260px">
                <el-checkbox-group v-model="leftCheckedList" @change="leftCheckedChange">
                  <el-row>
                    <el-col :span="8" v-for="item in leftList_search">
                      <el-checkbox :label="item[dataKey]">
                        <div class="row-text" v-show-tip>
                          <el-tooltip placement="top" :content="item[dataLabel]">{{ item[dataLabel] }}</el-tooltip>
                        </div>
                      </el-checkbox>
                    </el-col>
                  </el-row>
                </el-checkbox-group>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <div class="section-middle">
          <el-button size="small" @click="toRight">
            <el-icon><ArrowRight /></el-icon>
          </el-button>
          <el-button size="small" @click="toLeft">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
        </div>
        <div class="section-right">
          <div class="section-title">已选角色（共{{ rightList.length }}个）</div>
          <div class="section-box">
            <div class="section-top">
              <el-checkbox v-model="isCheckedAll_right" :indeterminate="indeterminate_right" @change="checkAll_right">{{ rightCheckedList.length }}条</el-checkbox>
            </div>
            <div class="section-bottom">
              <el-input placeholder="请输入搜索内容" style="marginbottom: 10px" v-model="rightSearchValue">
                <template #suffix>
                  <el-icon class="el-input__icon"><Search /></el-icon>
                </template>
              </el-input>
              <el-scrollbar height="260px">
                <el-checkbox-group v-model="rightCheckedList" @change="rightCheckedChange">
                  <draggable v-model="rightList_search" animation="200" itemKey="title" handle=".row-mover">
                    <template #item="{ element, index }">
                      <el-checkbox :label="element[dataKey]">
                        <div class="check-row row-mover">
                          <!-- <i class="row-mover iconfont icon-tuozhuai" v-if="!rightSearchValue"></i> -->
                          <div class="row-text" v-show-tip>
                            <el-tooltip placement="top" :content="element[dataLabel]">{{ element[dataLabel] }}</el-tooltip>
                          </div>
                          <!-- <el-link
                            class="row-btn"
                            :underline="false"
                            @click.prevent="goTop(index)">
                            <el-icon><Top /></el-icon>
                          </el-link> -->
                        </div>
                      </el-checkbox>
                    </template>
                  </draggable>
                </el-checkbox-group>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isShowDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmSetting">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
export default {
  name: 'transferBox',
  props: {
    isShow: {
      type: Boolean,
    },
    title: {
      type: String,
      default: '角色编辑',
    },
    // 数据的属性
    dataProps: {
      type: Object,
      default: () => {
        return {
          key: 'id',
          label: 'name',
        };
      },
    },
    // 全量数据
    allList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 初始被选中的数据
    checkedList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: {
    draggable,
  },
  data() {
    return {
      isShowDialog: false,
      leftSearchValue: '',
      rightSearchValue: '',
      isCheckedAll_left: false,
      indeterminate_left: false,
      isCheckedAll_right: false,
      indeterminate_right: false,
      // 右侧列表
      rightList: [],

      leftCheckedList: [],
      rightCheckedList: [],
    };
  },
  computed: {
    dataKey() {
      return this.dataProps.key;
    },
    dataLabel() {
      return this.dataProps.label;
    },
    // 左侧数据列表
    leftList() {
      let list = this.allList.filter((el) => {
        return !this.rightList.some((check) => check[this.dataKey] === el[this.dataKey]);
      });
      return list;
    },
    leftList_search() {
      return this.leftList.filter((el) => el[this.dataLabel].indexOf(this.leftSearchValue) > -1);
    },
    rightList_search: {
      get() {
        return this.rightList.filter((el) => el[this.dataLabel].indexOf(this.rightSearchValue) > -1);
      },
      set(val) {
        this.rightList = val;
      },
    },
  },
  watch: {
    isShow(val) {
      this.isShowDialog = val;
    },
    checkedList(val) {
      this.rightList = val;
    },
  },
  created() {
    this.rightList = this.checkedList;
  },
  mounted() {},
  methods: {
    close() {
      this.$emit('update:isShow', false);
    },
    // 左侧全选事件
    checkAll_left(value) {
      if (value) {
        this.leftCheckedList = this.leftList.map((el) => el[this.dataKey]);
      } else {
        this.leftCheckedList = [];
      }
      this.indeterminate_left = false;
    },
    // 右侧全选事件
    checkAll_right(value) {
      if (value) {
        this.rightCheckedList = this.rightList.map((el) => el[this.dataKey]);
      } else {
        this.rightCheckedList = [];
      }
      this.indeterminate_right = false;
    },
    leftCheckedChange(value) {
      let length = value.length;
      this.indeterminate_left = length > 0 && length < this.leftList.length;
      this.isCheckedAll_left = length === this.leftList.length;
    },
    rightCheckedChange(value) {
      let length = value.length;
      this.indeterminate_right = length > 0 && length < this.rightList.length;
      this.isCheckedAll_right = length === this.rightList.length;
    },
    // 右移按钮
    toRight() {
      let list = this.allList.filter((el) => this.leftCheckedList.some((check) => check === el[this.dataKey]));
      this.rightList = [...this.rightList, ...list];
      this.leftCheckedList = [];
      this.indeterminate_left = false;
    },
    // 左移按钮
    toLeft() {
      this.rightCheckedList.forEach((el) => {
        let i = this.rightList.findIndex((cel) => cel[this.dataKey] === el);
        if (i > -1) {
          this.rightList.splice(i, 1);
        }
      });
      this.rightCheckedList = [];
      this.indeterminate_right = false;
    },
    // 确认事件
    confirmSetting() {
      // let arr = this.rightList.map(item => item[this.dataProps.key])
      let arr = this.rightList;
      this.$emit('confirm', arr);
    },
  },
};
</script>

<style scoped lang="scss">
.main-section {
  display: flex;
  width: 760px;
  height: 400px;
  .section-left {
    width: 460px;
    height: 100%;
    flex-shrink: 0;
    .section-title {
      height: 40px;
      width: 100%;
      line-height: 40px;
    }
    .section-box {
      height: calc(100% - 40px);
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      .section-top {
        padding: 4px 10px 2px 10px;
        border-bottom: 1px solid #eee;
      }
      .section-bottom {
        padding: 8px 10px;
        .row-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-block;
          width: 126px;
        }
      }
    }
  }
  .section-middle {
    height: 100%;
    width: 100%;
    flex-shrink: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .el-button {
      margin: 0 0 8px 0;
      padding: 10px 6px;
    }
  }
  .section-right {
    width: 248px;
    height: 100%;
    flex-shrink: 0;
    .section-title {
      height: 40px;
      width: 100%;
      line-height: 40px;
    }
    .section-box {
      height: calc(100% - 40px);
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      .section-top {
        padding: 4px 10px 2px 10px;
        border-bottom: 1px solid #eee;
      }
      .section-bottom {
        padding: 8px 4px 8px 10px;
        .el-checkbox {
          width: 100%;
          margin-right: 0;
          :deep(.el-checkbox__label) {
            width: calc(100% - 30px);
            padding-right: 6px;
          }
        }
        .check-row {
          width: 100%;
          background: #fff;
          .row-mover {
            margin-right: 6px;
          }
          .row-text {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block;
            width: 154px;
          }
          .row-btn {
            float: right;
          }
        }
      }
    }
  }
}

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
:deep(.is-horizontal) {
  display: none;
}
</style>

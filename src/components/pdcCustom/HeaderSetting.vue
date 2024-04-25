<template>
  <el-dialog v-model="isShowDialog" title="表头设置" width="800" @close="close">
    <div class="main-section" v-loading="isLoading">
      <div class="section-left">
        <div class="section-title">可选字段（共{{ leftList.length }}个）</div>
        <div class="section-box">
          <div class="section-top">
            <el-checkbox v-model.trim="isCheckedAll_left" :indeterminate="indeterminate_left" @change="checkAll_left">
              {{ leftCheckedList.length }}/{{ leftList.length }}条
            </el-checkbox>
          </div>
          <div class="section-bottom">
            <el-input placeholder="请输入搜索内容" style="marginbottom: 4px" v-model="leftSearchValue" :suffix-icon="Search"></el-input>
            <el-scrollbar height="260px">
              <el-checkbox-group v-model="leftCheckedList" style="width: 96%" @change="leftCheckedChange">
                <el-row>
                  <el-col :span="8" v-for="item in leftList_search" :key="item.dataIndex">
                    <el-checkbox :label="item.dataIndex">
                      <div class="row-text" v-show-tip>
                        <el-tooltip placement="top" :content="item.title">{{ item.title }}</el-tooltip>
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
        <div class="section-title">已选字段（共{{ rightList.length }}个）</div>
        <div class="section-box">
          <div class="section-top">
            <el-checkbox v-model="isCheckedAll_right" :indeterminate="indeterminate_right" @change="checkAll_right">{{ rightCheckedList.length }}条</el-checkbox>
          </div>
          <div class="section-bottom">
            <el-input placeholder="请输入搜索内容" style="marginbottom: 10px" v-model="rightSearchValue" :suffix-icon="Search"></el-input>
            <el-scrollbar height="260px">
              <el-checkbox-group v-model="rightCheckedList" @change="rightCheckedChange">
                <draggable v-model="rightList_search" animation="200" itemKey="title" handle=".row-mover">
                  <template #item="{ element, index }">
                    <el-checkbox :label="element.dataIndex">
                      <div class="check-row">
                        <el-icon class="row-mover" v-if="!rightSearchValue"><MoreFilled /></el-icon>
                        <div class="row-text" v-show-tip>
                          <el-tooltip placement="top" :content="element.title">{{ element.title }}</el-tooltip>
                        </div>
                        <el-link class="row-btn" :underline="false" @click.prevent="goTop(index)">
                          <el-icon><Top /></el-icon>
                        </el-link>
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
        <el-button v-if="tableName" link class="btn-left" @click="reset">
          <el-icon><Refresh /></el-icon>
          恢复默认
        </el-button>
        <el-button @click="isShowDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmSetting">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { Search } from '@element-plus/icons-vue';
import { shallowRef } from 'vue';
import draggable from 'vuedraggable';
import * as _ from 'lodash';
export default {
  props: {
    isShow: {
      type: Boolean,
    },
    // allColumns: Array,
    // columns: {
    //   type: Array
    // },
    // selectedList: {
    //   type: Array
    // },
    tableName: String,
    pageLabelName: String,
  },
  components: {
    draggable,
  },
  data() {
    return {
      Search: shallowRef(Search),
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
      userInfo: JSON.parse(window.$Cookies.get('userInfo')),
      isLoading: false,
      allColumns: [],
      selectedList: [],
    };
  },
  watch: {
    isShow(val) {
      this.isShowDialog = val;
      if (this.tableName === 'plm_project') {
        this.getAllColumns();
      }
      this.getSelectedColumn();
    },
    selectedList(val) {
      this.rightList = val;
    },
  },
  computed: {
    leftList() {
      let list = this.allColumns.filter((el) => {
        return !this.rightList.some((check) => check.dataIndex === el.dataIndex);
      });
      return list;
    },
    leftList_search() {
      return this.leftList.filter((el) => el?.title?.indexOf(this.leftSearchValue) > -1);
    },
    rightList_search: {
      get() {
        return this.rightList.filter((el) => el?.title?.indexOf(this.rightSearchValue) > -1);
      },
      set(val) {
        this.rightList = val;
      },
    },
  },
  methods: {
    goTop(flag) {
      this.rightList.forEach((item, index) => {
        if (index === flag) {
          this.rightList.unshift(this.rightList.splice(index, 1)[0]);
        }
      });
    },
    confirmSetting() {
      let obj = {};
      this.rightList.forEach((item) => {
        obj[item.dataIndex] = item.title;
      });
      const params = {
        setupTable: this.tableName,
        // userName: this.userInfo.username,
        column: obj,
        pageLabelName: this.pageLabelName,
        // language: 'zh'
      };
      this.isLoading = true;
      window.$api.commonApi.setupTableHead(params).then((res) => {
        this.isLoading = false;
        if (res.success) {
          this.$emit('confirm', this.rightList);
        } else {
          this.$message.error(res);
        }
      });
    },
    close() {
      this.$emit('update:isShow', false);
    },
    // 左侧全选事件
    checkAll_left(value) {
      if (value) {
        this.leftCheckedList = this.leftList.map((el) => el.dataIndex);
      } else {
        this.leftCheckedList = [];
      }
      this.indeterminate_left = false;
    },
    // 右侧全选事件
    checkAll_right(value) {
      if (value) {
        this.rightCheckedList = this.rightList.map((el) => el.dataIndex);
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
      let list = this.allColumns.filter((el) => this.leftCheckedList.some((check) => check === el.dataIndex));
      this.rightList = [...this.rightList, ...list];
      this.leftCheckedList = [];
      this.indeterminate_left = false;
    },
    // 左移按钮
    toLeft() {
      this.rightCheckedList.forEach((el) => {
        let i = this.rightList.findIndex((cel) => cel.dataIndex === el);
        if (i > -1) {
          this.rightList.splice(i, 1);
        }
      });
      this.rightCheckedList = [];
      this.indeterminate_right = false;
    },
    reset() {
      this.isLoading = true;
      window.$api.commonApi
        .getSelectedColumn({
          tableName: this.tableName,
          pageLabelName: this.pageLabelName,
          // userName: this.userInfo.username,
          // language: 'zh'
        })
        .then((res) => {
          this.isLoading = false;
          if (res.success) {
            const columsArr = res.data.column;
            let newArr = [];
            for (let key in columsArr) {
              let obj = {
                title: columsArr[key],
                dataIndex: key,
                ellipsis: true,
                width: 130,
              };
              newArr.push(obj);
            }
            this.rightList = newArr.map((v) => {
              return {
                title: this.allColumns.find((item) => item.dataIndex === v.dataIndex).title,
                dataIndex: v.dataIndex,
                ellipsis: true,
                width: 130,
              };
            });
          } else {
            this.$message.error(res);
          }
        });
    },
    getAllColumns() {
      let obj = {
        tableName: this.tableName,
      };
      // 获取表头所有数据
      window.$api.commonApi.getAllColumns(obj).then((res) => {
        let temp = res.data;
        this.allColumns = temp.map((item) => {
          return {
            title: item[3],
            dataIndex: item[1],
            ellipsis: true,
            width: 130,
          };
        });
      });
    },
    getSelectedColumn() {
      window.$api.commonApi
        .getSelectedColumn({
          tableName: this.tableName,
          pageLabelName: this.pageLabelName,
          // userName: this.userInfo.username,
          // language: 'zh'
        })
        .then((res) => {
          this.isLoading = false;
          if (res.success) {
            const columsArr = res.data.column;
            this.selectedList = [];
            for (let key in columsArr) {
              let obj = {
                title: columsArr[key],
                dataIndex: key,
                ellipsis: true,
                width: 130,
              };
              this.selectedList.push(obj);
            }
            this.rightList = _.cloneDeep(this.selectedList);
          } else {
            this.$message.error(res);
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
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
.dialog-footer {
  .btn-left {
    float: left;
  }
}
</style>

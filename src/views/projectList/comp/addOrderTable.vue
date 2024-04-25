<template>
  <div class="main-container">
    <div class="header-section">
      <el-row class="form-row">
        <el-col :span="2">
          <span class="row-label">编号：</span>
        </el-col>
        <el-col :span="9">
          <el-input v-model="nameVal" placeholder="请输入" @change="onSearch" style="width: 100%" clearable></el-input>
        </el-col>
        <el-col :span="2" :offset="2">
          <span class="row-label">名称：</span>
        </el-col>
        <el-col :span="9">
          <el-input v-model="numberVal" placeholder="请输入" @change="onSearch" style="width: 100%" clearable></el-input>
        </el-col>
      </el-row>
      <div class="btn-box">
        <el-button @click="onReset">清除</el-button>
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </div>
    </div>
    <div class="main-section">
      <new-pi-table
        :columns="columnList"
        :data="source"
        :isShowSetting="false"
        :selectable="true"
        :stripe="false"
        :pagination="true"
        :page-size="10"
        :isWebPagination="true"
        :tableHeight="500"
        :total="total"
        :tableLoad="loading"
        @selectionChange="handleSelectionChange"
      >
        <template #endItem="scope">
          <div>{{ scope.row.endItem ? '是' : '否' }}</div>
        </template>
      </new-pi-table>
      <!-- <el-table @selection-change="handleSelectionChange" :data="source" ref="selectTable" :height="400" v-loading="loading">
        <el-table-column type="selection" width="55" />
        <el-table-column v-for="column in columnList" :label="column.label" :min-width="column.width" :property="column.dataIndex" :key="column.dataIndex">
          <template #default="scope" v-if="column.dataIndex === 'endItem'">
            <div>{{ scope.row.endItem ? '是' : '否' }}</div>
          </template>
        </el-table-column>
      </el-table> -->
      <!-- <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        v-model:current-page="page"
        v-model:page-size="size"
        @current-change="handleCurrentChange"
        class="orderPagination"
      /> -->
    </div>
  </div>
</template>

<script>
import { findPartItems } from '@/api/project';
export default {
  name: 'addOrderTable',
  props: {
    update: {
      type: Boolean,
    },
  },
  data() {
    return {
      numberVal: '',
      nameVal: '',
      columnList: [
        {
          title: '编号',
          dataIndex: 'partNumber',
          width: 160,
        },
        {
          title: '名称',
          dataIndex: 'partName',
        },
        {
          title: '所属项目',
          dataIndex: 'projectNumber',
          // width: 80,
        },
        {
          title: '成品',
          dataIndex: 'endItem',
          width: 80,
        },
        {
          title: '视图',
          dataIndex: 'partView',
          width: 80,
        },
        {
          title: '创建者',
          dataIndex: 'creator',
          width: 80,
        },
        {
          title: '最近修改时间',
          dataIndex: 'updateTime',
          width: 160,
        },
      ],
      source: [],
      page: 1,
      size: 10,
      total: 0,
      loading: false,
    };
  },
  watch: {
    update(val) {
      if (val) {
        this.onReset();
      }
    },
  },
  mounted() {},
  methods: {
    handleSelectionChange(arr) {
      let res = [];
      arr.forEach((item) => {
        res.push(item.partNumber);
      });
      this.$emit('select', res);
    },
    onReset() {
      this.nameVal = '';
      this.numberVal = '';
      // this.$refs.selectTable.clearSelection();
      this.source = [];
    },
    onSearch() {
      if (this.numberVal || this.nameVal) {
        this.getOlderNoAll();
      }
    },
    // 获取订单号列表
    getOlderNoAll() {
      this.loading = true;
      const params = {
        page: this.page,
        count: this.size,
        partNumber: this.nameVal ? `*${this.nameVal}*` : '',
        partName: this.numberVal ? `*${this.numberVal}*` : '',
      };
      findPartItems(params).then((res) => {
        this.loading = false;
        if (res.success) {
          this.source = res.data.responseList;
          this.total = res.data.totalCount;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleCurrentChange(val) {
      (this.page = val), this.getOlderNoAll();
    },
  },
};
</script>

<style lang="scss" scoped>
.header-section {
  margin-bottom: 20px;
  .form-row {
    margin: 12px 0;
    .row-label {
      display: inline-block;
      transform: translateY(4px);
    }
  }
  .btn-box {
    text-align: right;
  }
}
.orderPagination {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
</style>

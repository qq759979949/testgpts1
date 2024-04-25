<template>
  <div class="batchSetMultiple">
    <el-dialog v-model="Data.isShowDialog" :title="'批量设置多人'" :width="1000" @close="close" destroy-on-close :close-on-click-modal="false" lock-scroll>
      <div class="content">
        <div v-for="(item, index) of Data.tableColumnList" :key="index" class="module">
          <div class="title">{{ item.title }}</div>
          <div class="btnGroup">
            <el-button type="primary">添加</el-button>
            <el-button>移除</el-button>
          </div>
          <levelTable :columns="item.tableColumn" :tableData="item.tableData" isCheckBox></levelTable>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submit" :loading="Data.loading">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import levelTable from '../../projectInitiation/components/levelTable.vue';
const props = defineProps({
  // 控制显示隐藏
  isShow: {
    type: Boolean,
    default: false,
  },
});
const Data = reactive({
  tableColumnList: [
    {
      title: '【2023立项】【应用工程】 小装轻工况高卸装载机 (PM23006A3)',
      tableColumn: [
        {
          label: '被替换人员',
          dataIndex: '',
          children: [
            {
              label: '人员',
              dataIndex: 'byReplaceMember',
              width: 120,
            },
            {
              label: '样机建造权重（%）',
              dataIndex: 'phase1Wegith',
            },
            {
              label: '小批应用权重（%）',
              dataIndex: 'phase2Wegith',
            },
            {
              label: '批量验证权重（%）',
              dataIndex: 'phase3Wegith',
            },
          ],
        },
        {
          label: '替换人员',
          dataIndex: '',
          children: [
            {
              label: '人员',
              dataIndex: 'replaceMember',
              width: 120,
            },
            {
              label: '样机建造权重（%）',
              dataIndex: 'phase1Wegith',
            },
            {
              label: '小批应用权重（%）',
              dataIndex: 'phase2Wegith',
            },
            {
              label: '批量验证权重（%）',
              dataIndex: 'phase3Wegith',
            },
          ],
        },
      ],
      tableData: [],
    },
    {
      title: '【2023立项】【应用工程】 小装轻工况高卸装载机 (PM23006A3)',
      tableColumn: [
        {
          label: '被替换人员',
          dataIndex: '',
          children: [
            {
              label: '人员',
              dataIndex: 'byReplaceMember',
              align: 'left',
              width: 120,
            },
            {
              label: '样机建造权重（%）',
              dataIndex: 'phase1Wegith',
            },
            {
              label: '小批应用权重（%）',
              dataIndex: 'phase2Wegith',
            },
            {
              label: '批量验证权重（%）',
              dataIndex: 'phase3Wegith',
            },
          ],
        },
        {
          label: '替换人员',
          dataIndex: '',
          children: [
            {
              label: '人员',
              dataIndex: 'replaceMember',
              width: 120,
            },
            {
              label: '样机建造权重（%）',
              dataIndex: 'phase1Wegith',
            },
            {
              label: '小批应用权重（%）',
              dataIndex: 'phase2Wegith',
            },
            {
              label: '批量验证权重（%）',
              dataIndex: 'phase3Wegith',
            },
          ],
        },
      ],
      tableData: [],
    },
    {
      title: '【2023立项】【应用工程】 小装轻工况高卸装载机 (PM23006A3)',
      tableColumn: [
        {
          label: '被替换人员',
          dataIndex: '',
          children: [
            {
              label: '人员',
              dataIndex: 'byReplaceMember',
              align: 'left',
              width: 120,
            },
            {
              label: '样机建造权重（%）',
              dataIndex: 'phase1Wegith',
            },
            {
              label: '小批应用权重（%）',
              dataIndex: 'phase2Wegith',
            },
            {
              label: '批量验证权重（%）',
              dataIndex: 'phase3Wegith',
            },
          ],
        },
        {
          label: '替换人员',
          dataIndex: '',
          children: [
            {
              label: '人员',
              dataIndex: 'replaceMember',
              width: 120,
            },
            {
              label: '样机建造权重（%）',
              dataIndex: 'phase1Wegith',
            },
            {
              label: '小批应用权重（%）',
              dataIndex: 'phase2Wegith',
            },
            {
              label: '批量验证权重（%）',
              dataIndex: 'phase3Wegith',
            },
          ],
        },
      ],
      tableData: [],
    },
  ],
  tableData: [],
  isShowDialog: false,
  loading: false,
});

watch(
  () => props.isShow,
  (val) => {
    Data.isShowDialog = val;
  },
);

//关闭方法
const close = () => {
  emit('update:isShow', false);
  emit('close');
};

// 提交方法
const submit = () => {};

//传出方法
const emit = defineEmits(['update:isShow', 'close']);
</script>

<style scoped lang="scss">
.batchSetMultiple {
  .content {
    .module {
      // overflow-y: scroll;
      margin-bottom: 20px;
      .title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      .btnGroup {
        display: flex;
        justify-items: self-start;
        margin-bottom: 5px;
      }
    }
  }
  :deep(.el-dialog__body) {
    height: 65vh;
    overflow: scroll;
  }
}
</style>

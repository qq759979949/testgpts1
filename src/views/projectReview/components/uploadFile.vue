<!--
    从上传文件
-->
<template>
  <div class="uploadFileFrom">
    <div class="leftContent">
      <div class="title">文件结构树</div>
      <div class="treeContent">
        <el-tree :data="treeData" show-checkbox node-key="id" :default-expanded-keys="[2, 3]" :default-checked-keys="[5]" :props="defaultProps" />
      </div>
    </div>
    <div class="rightContent">
      <div class="topTitle">
        <div class="title">总体方案设计</div>
        <el-input style="width: 200px" placeholder="请输入" :suffix-icon="Search" />
      </div>
      <PiTable
        :columns="colunms"
        :data="tableData"
        :selectable="true"
        :isShowSetting="false"
        @selectionChange="selectionChange"
        rowKey="projectIssueOid"
        :pagination="false"
        class="uploadFlieTable"
      >
        <el-table-column prop="nameNumber" label="交付物">
          <template #default="scope">
            <a style="color: #409eff; cursor: pointer">{{ scope.row.nameNumber }}</a>
          </template>
        </el-table-column>
      </PiTable>
    </div>
  </div>
</template>
<script>
import PiTable from '@/components/pdcCustom/PiTable.vue';
const defaultProps = {
  children: 'children',
  label: 'label',
};
export default {
  name: 'uploadFileFrom',
  components: {
    PiTable,
  },
  data() {
    return {
      colunms: [
        {
          title: '编号',
          dataIndex: 'issueType',
        },
        {
          title: '状态',
          dataIndex: 'priorityType',
        },
        {
          title: '修改者',
          dataIndex: 'description',
        },
        {
          title: '上次修改时间',
          dataIndex: 'modifyTime',
          width: 130,
        },
      ],
      tableData: [
        {
          nameNumber: '立项评审',
          name: '123',
          issueType: '是',
          priorityType: '是',
          description: 'wyq',
          modifyTime: '2023/05/20',
          people: 'wyq',
          time: '2023/05/21',
        },
      ],
      treeData: [
        {
          id: 1,
          label: 'Level one 1',
          children: [
            {
              id: 4,
              label: 'Level two 1-1',
              children: [
                {
                  id: 9,
                  label: 'Level three 1-1-1',
                },
                {
                  id: 10,
                  label: 'Level three 1-1-2',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: 'Level one 2',
          children: [
            {
              id: 5,
              label: 'Level two 2-1',
            },
            {
              id: 6,
              label: 'Level two 2-2',
            },
          ],
        },
        {
          id: 3,
          label: 'Level one 3',
          children: [
            {
              id: 7,
              label: 'Level two 3-1',
            },
            {
              id: 8,
              label: 'Level two 3-2',
            },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.uploadFileFrom {
  display: flex;
  justify-content: space-between;
  .leftContent {
    width: 33%;
    .title {
      font-size: 14px;
      color: #333;
      margin-bottom: 10px;
      line-height: 32px;
    }
    .treeContent {
      border: 1px solid #ccc;
      height: 300px;
      overflow-y: scroll;
    }
  }
  .rightContent {
    width: 65%;
    .topTitle {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .title {
      font-size: 14px;
      line-height: 32px;
      color: #333;
    }
  }
}
</style>

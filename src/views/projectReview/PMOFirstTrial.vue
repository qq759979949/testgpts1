<template>
 <div class="PMOFirstTrail">
    <div class="upContent">
      <div class="title">【PMO检查】决策-立项评审</div>
      <div class="description">
        <baseInfo ref="baseInfo" :list="list[0].rows"></baseInfo>
      </div>
      <div class="menu">
        <affixTab
          :tabList="tabList"
          :actived="tabActived"
          :offset="142"
        ></affixTab>
      </div>
    </div>
    <div class="divider"></div>
    <div class="downContent">
      <div class="title" id="jfw">交付物</div>
      <el-divider />
      <PiTable
        :columns="colunms"
        :data="tableData"
        :selectable="false"
        rowKey="projectIssueOid"
        :pagination="false"
        :isShowSetting="false"
      >
      </PiTable>
      <div class="title" id="zjb">自检表</div>
      <el-divider />
      <!-- <selfTestTable></selfTestTable> -->
      <PiTable
        :columns="colunms"
        :data="tableData"
        :selectable="false"
        rowKey="projectIssueOid"
        :pagination="false"
        :isShowSetting="false"
      >
      </PiTable>
      <div class="title" id="lccl">流程处理</div>
      <el-divider />
      <ProcessRecord
        :oid="oid"
      >
      </ProcessRecord>
      <ProcessSubmit :oid="oid" @submit="submit"></ProcessSubmit>
    </div>
 </div>
</template>
<script>
import { list } from '../porojectTaskBook/projectTaskBook'
import ProcessRecord from '@/components/processRecord.vue'
import affixTab from '@/components/affixTab.vue'
import ProcessSubmit from '@/components/process/processSubmit.vue'
import PiTable from '@/components/pdcCustom/PiTable.vue'
import selfTestTable from './components/slefTestTable.vue'
import baseInfo from '../toDoPage/components/baseInfo.vue'
export default {
  name: 'PMOFirstTrail',
  components: { ProcessRecord, affixTab, ProcessSubmit, PiTable, selfTestTable, baseInfo },
  data () {
    return {
      list: list,
      // activeIndex: '1',
      tabList: [
        {label: '交付物', id: 'jfw'},
        {label: '自检表', id: 'zjb'},
        {label: '流程处理', id: 'lccl'},
      ],
      tabActived: 'jfw',
      oid: 'OR:com.pisx.pmgt.risk.PIProjectRisk:339884',
      colunms:[
          {
            width:140,
            title:'评审编号',
            dataIndex:'issueNumber',
          },
          {
            title:'评审名称',
            width:120,
            dataIndex: 'name',
          },
          {
            title: "评审点",
            dataIndex: 'issueType',
          },
          {
            title: "修改者",
            dataIndex: 'priorityType',
          },
          {
            title: "创建时间",
            dataIndex: 'description',
          },
          {
            title: "计划评审时间",
            dataIndex: 'responsibleUserReference',
          },
          {
            title: "评审完成时间",
            dataIndex: "expectedSolutionDate",
          },
          {
            title: "状态",
            dataIndex: 'state',
          }
        ],
        tableData:[], 
    }
  },
  methods: {
    submit () {

    }
  }
}
</script>

<style scoped lang='scss'>
.PMOFirstTrail {
  .upContent {
    .title {
      font-size: 16px;
      font-weight: 550;
    }
  }
  .divider {
    height: 20px;
    background: #f5f7fa;
    margin: 0 -16px;
  }
  .downContent {
    .title {
      font-size: 16px;
      padding-top: 10px;
    }
  }
  :deep .el-tabs__header {
    margin: 0 !important;
  }
  :deep .el-divider--horizontal {
    margin: 0 0  10px 0 !important;
  }
}
</style>
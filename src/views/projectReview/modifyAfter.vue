<template>
  <div class="PMOFirstTrail">
     <div class="upContent">
       <div class="title">【PMO复查】决策-立项评审</div>
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
      <div class="title" id="pshyjy">评审会议纪要</div>
       <el-divider />
       <baseInfo ref="baseInfo" :list="list[0].rows"></baseInfo>
        <div class="secondTitle secondTitle1">
          <el-icon class='iconUp' v-if="isUpQ" @click="changeIsUp('question')"><CirclePlusFilled /></el-icon>
          <el-icon class='iconUp' v-else @click="changeIsUp('question')"><RemoveFilled /></el-icon>
          项目问题（0）
        </div>
        <PiTable
          v-if="isUpQ"
          :columns="colunms"
          :data="tableData"
          :selectable="false"
          rowKey="projectIssueOid"
          :pagination="false"
          :isShowSetting="false"
       >
       </PiTable>
        <div class="secondTitle">
          <el-icon class='iconUp' v-if="isUpR" @click="changeIsUp('risk')"><CirclePlusFilled /></el-icon>
          <el-icon class='iconUp' v-else @click="changeIsUp('risk')"><RemoveFilled /></el-icon>
          项目风险（0）
        </div>
       <PiTable
          v-if="isUpR"
          :columns="colunms"
          :data="tableData"
          :selectable="false"
          rowKey="projectIssueOid"
          :pagination="false"
          :isShowSetting="false"
       >
       </PiTable>
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
import baseInfo from '../toDoPage/components/baseInfo.vue'
 import ProcessRecord from '@/components/processRecord.vue'
 import affixTab from '@/components/affixTab.vue'
 import ProcessSubmit from '@/components/process/processSubmit.vue'
 import PiTable from '@/components/pdcCustom/PiTable.vue'
 export default {
   name: 'PMOFirstTrail',
   components: { ProcessRecord, baseInfo, affixTab, ProcessSubmit, PiTable },
   data () {
     return {
      list: list,
       isUpQ: true, // 项目问题收缩
       isUpR: true, // 项目风险收缩
       tabList: [
        {label: '评审会议纪要', id: 'pshyjy'},
        {label: '交付物', id: 'jfw'},
        {label: '自检表', id: 'zjb'},
        {label: '流程处理', id: 'lccl'},
       ],
       tabActived: 'pshyjy',
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
 
     },
     changeIsUp (type) {
      if (type === 'risk') {
        this.isUpR = !this.isUpR
      } else {
        this.isUpQ = !this.isUpQ
      }
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
     .secondTitle {
      font-size: 16px;
      font-weight: 550;
      padding: 10px 0;
      .iconUp {
        cursor: pointer;
      }
     }
     .secondTitle1 {
      padding-top: 0px;
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
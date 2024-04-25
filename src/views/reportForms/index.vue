<!--
 * @Author
  components: { gantt },: wyq ywen@pisx.com
 * @Date: 2024-01-04 14:18:32
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-18 11:24:08
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\reportForms\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--报表-->
<template>
  <div class="report_forms">
    <div class="first_area">
      <div class="title_main">
        <div class="left_line"></div>
        阶段甘特图
      </div>
      <gantt></gantt>
    </div>
    <div class="second_area">
      <div class="title_main title_main1">
        <div class="left_line"></div>
        任务状态统计表
      </div>
      <div class="pie_container">
        <div class="pie_style">
          <myPie pie-id="pieId1" :echartsData="Data.taskStatus.status" pieName="任务状态透视图" :number="Data.taskStatus.statusNumber" left="25%"></myPie>
        </div>
        <div class="pie_style">
          <pieStatus
            pie-id="pieId2"
            :echartsData="Data.taskStatus.offset"
            pieName="任务偏差透视图"
            :number="Data.taskStatus.offsetNumber"
            :baseColor="Data.baseColor"
            left="25%"
          ></pieStatus>
        </div>
        <div class="pie_style pie_style1">
          <myPie
            pie-id="pieId3"
            :echartsData="Data.taskStatus.people"
            pieName="任务责任主体透视图"
            :left="Data.taskStatus.peopleNumber.toString().length > 2 ? '29%' : '25%'"
            :number="Data.taskStatus.peopleNumber"
          ></myPie>
        </div>
      </div>
    </div>
    <div class="third_area">
      <div class="title_main title_main1">
        <div class="left_line"></div>
        工作量统计
      </div>
      <div class="pie_container">
        <div class="pie_style2">
          <myPie
            pie-id="pieId4"
            :echartsData="Data.workLoad.member"
            pieName="人员投入工作量透视图"
            :left="Data.workLoad.memberNumber.toString().length > 2 ? '29%' : '25%'"
            :number="Data.workLoad.memberNumber"
            unit="h"
          ></myPie>
        </div>
        <div class="pie_style2">
          <myPie pie-id="pieId5" :echartsData="Data.workLoad.role" pieName="角色投入工作量透视图" left="25%" :number="Data.workLoad.roleNumber" unit="h"></myPie>
        </div>
      </div>
    </div>
    <div class="forth_area">
      <div class="title_main title_main1">
        <div class="left_line"></div>
        项目质量看板
      </div>
      <div class="pie_container">
        <div class="pie_style2">
          <myPie pie-id="pieId7" :echartsData="Data.qualityBoard.issue" pieName="问题" :number="Data.qualityBoard.issueNumber" left="25%"></myPie>
        </div>
        <div class="pie_style2">
          <myPie pie-id="pieId8" :echartsData="Data.qualityBoard.risk" pieName="风险" :number="Data.qualityBoard.riskNumber" left="25%"></myPie>
        </div>
        <div class="pie_style2">
          <myPie pie-id="pieId9" :echartsData="Data.qualityBoard.change" pieName="变更" :number="Data.qualityBoard.changeNumber" left="25%"></myPie>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import gantt from './module/gantt.vue';
import myPie from './module/pie.vue';
import pieStatus from './module/pieStatus.vue';
const Data = reactive({
  pieDataState: [
    { value: 1048, name: '已完成' },
    { value: 735, name: '已排程' },
    { value: 580, name: '未开启' },
  ],
  qualityBoard: {
    issue: [],
    change: [],
    risk: [],
    issueNumber: 0,
    riskNumber: 0,
    changeNumber: 0,
  },
  taskStatus: {
    status: [],
    people: [],
    offset: [],
    statusNumber: 0,
    peopleNumber: 0,
    offsetNumber: 0,
  },
  workLoad: {
    member: [],
    role: [],
    memberNumber: 0,
    roleNumber: 0,
  },
  pieDataOffset: [{ value: 1048, name: '任务偏差' }],
  projectOid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
  baseColor: [],
  healthColor: [
    {
      key: 'gray',
      value: '#D9D9D9',
    },
    {
      key: 'green',
      value: '#72C040 ',
    },
    {
      key: 'red',
      value: '#E23C39',
    },
    {
      key: 'yellow',
      value: '#F0AE41',
    },
  ],
  // projectOid: 'OR:com.pisx.pmgt.project.PIProject:22101203',
});
// 质量看板
const getQualityBoard = () => {
  window.$api.instrumentReportApi.queryProjectQualityReport({ projectOid: Data.projectOid }).then((res) => {
    if (res.success) {
      Data.qualityBoard.issue = quchong(res.data.issue, 'status').map((item) => {
        item.value = item.num;
        item.name = item.status;
        Data.qualityBoard.issueNumber += item.value;
        return item;
      });
      Data.qualityBoard.change = quchong(res.data.change, 'status').map((item) => {
        item.value = item.num;
        item.name = item.status;
        Data.qualityBoard.changeNumber += item.value;
        return item;
      });
      Data.qualityBoard.risk = quchong(res.data.risk, 'status').map((item) => {
        item.value = item.num;
        item.name = item.status;
        Data.qualityBoard.riskNumber += item.value;
        return item;
      });
    } else {
      window.$message.error(res.message);
    }
  });
};
// 任务状态
const getTaskStatus = () => {
  window.$api.instrumentReportApi.getAllPlanActivityEndNodes({ projectOid: Data.projectOid }).then((res) => {
    if (res.success) {
      Data.taskStatus.status = quchong(JSON.parse(res.data).returnData, 'plannableStatus').map((item) => {
        item.value = item.num;
        item.name = item.plannableStatus;
        Data.taskStatus.statusNumber += item.value;
        return item;
      });
      let newData = [];
      Data.taskStatus.offset = quchong(JSON.parse(res.data).returnData, 'taskDeviation').map((item) => {
        item.value = item.num;
        item.name =
          item.taskDeviation === 'gray' ? '灰' : item.taskDeviation === 'green' ? '绿' : item.taskDeviation === 'yellow' ? '黄' : item.taskDeviation === 'red' ? '红' : '';
        Data.taskStatus.offsetNumber += item.value;
        // Data.healthColor.forEach((it) => {
        //   if (it.taskDeviation === item.key) {
        //     newData.push(it.color);
        //   }
        //   // it.taskDeviation === item.key
        // });
        return item;
      });
      newData = Data.taskStatus.offset.map((item) => {
        Data.healthColor.forEach((it) => {
          if (item.taskDeviation.includes(it.key)) {
            item.color = it.value;
          }
        });
        return item;
      });
      Data.baseColor = newData.map((it) => {
        return it.color;
      });
      Data.taskStatus.people = quchong(JSON.parse(res.data).returnData, 'responsibleSubject').map((item) => {
        item.value = item.num;
        item.name = item.responsibleSubject;
        Data.taskStatus.peopleNumber += item.value;

        return item;
      });
    } else {
      window.$message.error(res.message);
    }
  });
};
// 工作量统计
const getWorkLoad = () => {
  window.$api.instrumentReportApi.getWorkloadDataByProjectOid({ projectOid: Data.projectOid }).then((res) => {
    if (res.success) {
      Data.workLoad.member = quchong1(JSON.parse(res.data).returnData, 'resourceShortName').map((item) => {
        item.value = item.actualWorkload;
        item.name = item.resourceShortName;
        Data.workLoad.memberNumber += item.actualWorkload;
        return item;
      });
      Data.workLoad.role = quchong1(JSON.parse(res.data).returnData, 'roleShortName').map((item) => {
        item.value = item.actualWorkload;
        item.name = item.roleShortName;
        Data.workLoad.roleNumber += item.actualWorkload;
        return item;
      });
    } else {
      window.$message.error(res.message);
    }
  });
};
// 去重，统计数量
const quchong = (arr, type) => {
  //  第一步，去重
  var hash = [];
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i][type] === arr[j][type]) {
        ++i;
        j = i;
      }
    }
    arr[i].num = 0;
    hash.push(arr[i]);
  }
  // 第二步，统计重复个数
  hash.forEach((item) => {
    arr.forEach((dd) => {
      if (item[type] === dd[type]) {
        item.num++;
      }
    });
  });
  return hash;
};
// 去重，统计数量
const quchong1 = (arr, type) => {
  //  第一步，去重
  var hash = [];
  for (var i = 0; i < arr.length; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i][type] === arr[j][type]) {
        ++i;
        j = i;
      }
    }
    hash.push(arr[i]);
  }
  // // 第二步，统计重复个数
  hash = hash.map((item) => {
    let number = 0;
    arr.forEach((dd) => {
      if (item[type] === dd[type]) {
        number += dd.actualWorkload;
      }
    });
    item.actualWorkload = number;
    return item;
  });
  return hash;
};
onMounted(() => {
  getQualityBoard();
  getTaskStatus();
  getWorkLoad();
});
</script>

<style lang="less" scoped>
.report_forms {
  padding: 16px;
  .title_main {
    display: flex;
    justify-content: flex-start;
    font-size: 18px;
    font-weight: 500;
    color: #333333;
    line-height: 24px;
    .left_line {
      width: 3px;
      height: 20px;
      background: #386bd7;
      border-radius: 3px;
      margin-right: 6px;
    }
  }
  .title_main1 {
    margin-top: 10px;
  }
  .second_area {
    // margin: 10px 12px;
    .pie_container {
      margin-top: 10px;
      display: flex;
      justify-content: flex-start;
    }
    .pie_style {
      background: #fff;
      width: 30%;
      margin-right: 20px;
      height: 400px;
    }
    .pie_style1 {
      width: 40%;
      margin-right: 0px;
    }
  }
  .pie_container {
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
    .pie_style2 {
      background: #fff;
      width: 50%;
      margin-right: 20px;
      height: 400px;
    }
  }
}
</style>

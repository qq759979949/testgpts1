<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-03-18 16:15:52
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\projectChange\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEcreateProjectChange
-->
<template>
  <div class="numTotal">
    <el-row class="content_row">
      <el-col class="grid_content" :class="Data.cardList.length - 1 === index ? 'grid_content1' : ''" v-for="(item, index) in Data.cardList" :key="index" :span="4">
        <el-card class="card" shadow="never">
          <el-row>
            <el-col :span="20">
              <div><img :src="item.src" alt="" class="image" /></div>
              <div class="total-num">{{ item.name }}</div>
            </el-col>
            <el-col :span="4" class="right-num">{{ props.changeList[item.value] }}</el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import img_risked from '@/assets/img/risked.png';
import img_risking from '@/assets/img/risking.png';
import img_riskTotal from '@/assets/img/riskTotal.png';
import img_issueSum from '@/assets/img/issueSum.png';
import img_workIssue from '@/assets/img/workIssue.png';
import img_resolveIssue from '@/assets/img/resolveIssue.png';
const props = defineProps({
  changeList: {
    type: Object,
    default: () => {},
  },
  isRisk: {
    type: Boolean,
    default: false,
  },
});
const Data = reactive({
  questionList: [
    {
      src: img_issueSum,
      name: '问题总数量',
      num: 0,
      value: 'sumIssueNum',
    },
    {
      src: img_workIssue,
      name: '正在处理的问题数量',
      num: 0,
      value: 'workIssueNum',
    },
    {
      src: img_resolveIssue,
      name: '已解决的问题数量',
      value: 'resolvedNum',
      num: 0,
    },
  ],
  riskList: [
    {
      src: img_riskTotal,
      name: '风险总数量',
      num: 0,
      value: 'allRiskNum',
    },
    {
      src: img_risking,
      name: '正在处理的风险数量',
      num: 0,
      value: 'workRiskNum',
    },
    {
      src: img_risked,
      name: '已解决的风险数量',
      value: 'resolvedNum',
      num: 0,
    },
  ],
  cardList: [],
});
onMounted(() => {
  if (props.isRisk) {
    Data.cardList = Data.riskList;
  } else {
    Data.cardList = Data.questionList;
  }
});
</script>

<style scoped lang="scss">
.numTotal {
  .content_row {
    display: flex;
    justify-self: start;
  }
  .card {
    background-color: #fff;
    height: 110px;
    margin-right: 20px;
    border: 0px solid;
    border-radius: 0px;
    .image {
      display: inline-block;
      width: 40px;
      height: 40px;
    }
    .total-num {
      font-size: 12px;
      color: #999;
    }
    .right-num {
      font-size: 32px;
      color: #333;
      font-weight: 550;
      line-height: 80px;
    }
  }
}
</style>

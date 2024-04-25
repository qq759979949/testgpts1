<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-05 11:42:59
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-17 15:41:37
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\reportForms\module\pie.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="pie_chart">
    <div class="title">{{ pieName }}</div>
    <!-- <div class="explain">更新于 2023/01/05</div> -->
    <div :id="pieId" style="width: 100%; height: calc(100% - 50px)"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
const props = defineProps({
  echartsData: {
    type: Array,
    default: () => {
      return [];
    },
  },
  pieId: {
    type: String,
    default: '',
  },
  pieName: {
    type: String,
    default: '',
  },
  number: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
    default: '个',
  },
  left: {
    type: String,
    default: '21%',
  },
  // color: {
  //   type: Array,
  //   default: () => {
  //     return ['#ec6667', '#91cb78'];
  //   },
  // },
});
const Data = reactive({
  pieData: [],
  baseColor: ['#5B8FF9', '#56D0A0', '#A244F5', '#FFC53D', '#002766'],
  richColor: {},
});
const initPieData = () => {
  var myChart = echarts.init(document.getElementById(`${props.pieId}`));
  Data.baseColor.forEach((item, index) => {
    Data.richColor[`color${index}`] = {
      fontSize: 12,
      color: item,
    };
  });
  myChart.setOption({
    tooltip: {
      trigger: 'item',
    },
    title: {
      text: '共计', //文本
      subtext: `${props.number}${props.unit}`, //副标题文本
      left: `${props.left}`,
      // left: 'center',
      top: '40%',
      textAlign: 'center',
      width: '200px',
      textStyle: {
        fontSize: 16,
        color: '#6c7a89',
        align: 'center',
      },
      subtextStyle: {
        fontSize: 28,
        color: '#454c5c',
        align: 'center',
      },
    },
    legend: {
      type: 'scroll',
      right: 0,
      top: Data.pieData.length <= 7 ? '30%' : 20,
      bottom: 200,
      orient: 'vertical',
      icon: 'circle',
      textStyle: {
        rich: Data.richColor,
      },
      formatter: function (name) {
        var dataIndex = 0;
        let newData = Data.pieData;
        for (var i = 0; i < newData.length; i++) {
          if (newData[i].name === name) {
            dataIndex = i;
            break;
          }
        }
        const arr = [
          props.pieName === '角色投入工作量透视图' ? `{text|${name}}                              ` : `{text|${name}}      `,
          `{color${dataIndex % Data.baseColor.length}|${((newData[dataIndex].value / Data.pieData.reduce((acc, cur) => acc + cur.value, 0)) * 100).toFixed(2)}%（${
            newData[dataIndex].value
          }）}`,
        ];
        return arr.join('');
      },
    },
    color: Data.baseColor,
    textStyle: {
      rich: {
        text: {
          fontSize: 12,
          width: 100,
          marginRight: 20,
        },
      },
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['35%', '55%'],
        center: [Data.pieData.length <= 7 ? '25%' : '30%', '50%'],
        avoidLabelOverlap: false,
        percentPrecision: 2,
        // itemStyle: {
        //   color: ['#5B8FF9', '#56D0A0', '#A244F5', '#FFC53D', '#002766'],
        // },
        label: {
          show: true,
          position: Data.pieData.length <= 7 ? 'inside' : 'outside',
          formatter: '{d}%',
          color: Data.pieData.length <= 7 ? '#fff' : '#333',
          fontSize: 12,
          marginRight: 20,
        },
        labelLine: {
          show: true,
        },
        data: Data.pieData,
      },
    ],
  });
  window.addEventListener('resize', function () {
    myChart.resize();
  });
};
watch(
  () => props.echartsData,
  (val) => {
    if (val.length > 0) {
      Data.pieData = val;
      initPieData();
    }
  },
);

onMounted(() => {});
</script>

<style lang="less" scoped>
.pie_chart {
  width: 100%;
  height: 100%;
  .title {
    font-size: 16px;
    color: #333;
    line-height: 20px;
    padding: 10px 10px 0 10px;
  }
  .explain {
    font-size: 12px;
    color: #999;
    // line-height: 20px;
    padding: 0 10px;
  }
  #pieMyChart {
    width: calc(100% - 50px);
    height: calc(100% - 50px);
  }
}
</style>

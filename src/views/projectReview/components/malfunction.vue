<template>
  <div>
    <div class="malfunction">
      <div v-for="(item, index) in Data.malfunctionList" :key="index" class="malfunction-item">
        <div class="">
          <img :src="item.imageUrl" alt="" style="width: 40px; height: 40px" />
        </div>
        <div class="malfunction-content">
          <p class="name">{{ item.name }}</p>
          <p class="num">{{ item.number }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import failures from '../../../assets/img/failures.png';
import processing from '@/assets/img/processing.png';
import resolved from '@/assets/img/resolved.png';
import close from '@/assets/img/close.png';
const Data = reactive({
  malfunctionList: [
    { imageUrl: failures, name: '故障数量', number: '12' },
    { imageUrl: processing, name: '正在处理的故障量', number: '2' },
    { imageUrl: resolved, name: '已解决的故障数量', number: '10' },
    { imageUrl: close, name: '故障关闭率', number: '80.2%' },
  ],
});
</script>

<style lang="less" scoped>
.malfunction {
  display: flex;
  align-items: center;
  justify-content: center;
  .malfunction-item {
    width: 312px;
    height: 110px;
    border-radius: 1px;
    border: 1px solid #d3d3d3;
    padding: 10px;
    margin-right: 40px;
    .malfunction-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .name {
        font-size: 14px;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 400;
        color: #666666;
      }
      .num {
        font-size: 38px;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 500;
        color: #333333;
      }
    }
  }
  .malfunction-item:last-child {
    margin-right: 0;
  }
}
</style>

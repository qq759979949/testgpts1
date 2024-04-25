<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-03 10:47:23
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
import img_launch from '@/assets/img/launch.png';
import img_speed from '@/assets/img/speed.png';
import img_target from '@/assets/img/target.png';
import img_money from '@/assets/img/money.png';
import img_attribute from '@/assets/img/attribute.png';
const props = defineProps({
  changeList: {
    type: Object,
    default: () => {},
  },
});
const Data = reactive({
  cardList: [
    {
      src: img_launch,
      name: '本项目已发起的变更次数',
      num: 10,
      value: 'projectChangeNum',
    },
    {
      src: img_speed,
      name: '进度变更次数',
      num: 2,
      value: 'scheduleChangeNum',
    },
    {
      src: img_target,
      name: '目标/指标变更次数',
      value: 'targetAndIndexChangeNum',
      num: 3,
    },
    {
      src: img_money,
      name: '薪酬包成员变更次数',
      num: 4,
      value: 'compensationPackageChangeNum',
    },
    {
      src: img_attribute,
      name: '项目属性变更次数',
      num: 1,
      value: 'attributeChangeNum',
    },
  ],
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

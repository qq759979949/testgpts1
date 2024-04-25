<template>
  <div class="anthor">
    <div class="handle" @click="handDialog" v-if="isShow">
      <img src="@/assets/images/handle.png" />
      <span>操作指南</span>
    </div>
    <el-affix :offset="offset" :target="target">
      <div class="title">
        <slot name="title"></slot>
      </div>
      <div class="tabBox">
        <el-tabs v-model="Data.activeName" @tab-click="handleClick">
          <el-tab-pane v-for="item in tabList" :label="item.label" :name="item.id" :key="item.id"></el-tab-pane>
        </el-tabs>
      </div>
    </el-affix>
    <slot name="content"></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  tabList: {
    type: Array,
    default: () => {
      return [];
    },
  },
  actived: {
    type: String,
  },
  target: {
    type: String,
  },
  offset: {
    type: Number,
  },
});
const Data = reactive({
  activeName: props.actived,
});
// 监听
watch(
  () => props.actived,
  (newVal, oldVal) => {
    Data.activeName = newVal;
  },
  {
    immediate: true, // 立即执行
    deep: true, // 深度监听
  },
);
const handleClick = (tab, event) => {
  const id = tab.props.name;
  document.querySelector('#' + id).scrollIntoView({
    behavior: 'smooth', // 定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"
    // block: 'center',
  });
};
const handDialog = () => {
  emit('handDialog');
};
const emit = defineEmits(['handDialog']);
</script>

<style lang="less" scope>
.anthor {
  position: relative;
  .el-affix--fixed {
    background-color: #fff;
    // padding-top: 20px;
  }
  .tabBox {
    .el-tabs__header {
      background: #fff;
      // padding: 0 20px;
    }
  }
  .handle {
    position: absolute;
    right: 0;
    bottom: 18px;
    z-index: 10;
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      width: 17px;
      height: 24px;
      margin-right: 10px;
      display: inline-block;
    }
    span {
      font-weight: 400;
      color: #0062ff;
      font-size: 14px;
    }
  }
}
</style>

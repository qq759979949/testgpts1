<template>
  <div>
    <el-affix :offset="offset" :target="target">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabList" :label="item.label" :name="item.id" :key="item.id"></el-tab-pane>
      </el-tabs>
    </el-affix>
  </div>
</template>

<script>
export default {
  name: 'affixTab',
  components: {},
  props: {
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
  },
  data() {
    return {
      activeName: this.actived,
    };
  },
  watch: {
    actived(val) {
      this.activeName = val;
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleClick(tab, event) {
      const id = tab.props.name;
      document.querySelector('#' + id).scrollIntoView({
        behavior: 'smooth', // 定义动画过渡效果， "auto"或 "smooth" 之一。默认为 "auto"
        block: 'center',
      });
    },
  },
};
</script>

<style scoped lang="scss">
:deep(.el-affix--fixed) {
  background: #fff;
  &::before {
    content: '';
    position: absolute;
    top: -16px;
    width: 100%;
    height: 16px;
    background: #fff;
  }
}
</style>

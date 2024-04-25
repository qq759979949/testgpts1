<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-11-07 08:40:24
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-03-22 11:19:12
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\components\tabs\tabsBadge.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="tabs-badge">
    <el-tabs v-model="tabKey" class="todo-table-header" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabs" :key="item.type" :name="item.type" :label="item.title">
        <template #label>
          <div class="custom-tabs-label">
            <el-badge :value="item.value" class="badge-tab" v-if="Number(item.value) > 0">
              {{ item.title }}
            </el-badge>
            <div v-else>
              {{ item.title }}
            </div>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  props: {
    activeKey: {
      type: String,
      default: '',
    },
    tabs: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      tabKey: this.activeKey,
    };
  },
  methods: {
    handleClick(tab) {
      this.$emit('tabHandleClick', tab.props.name);
    },
  },
};
</script>

<style scoped lang="scss">
.tabs-badge {
  .todo-table-header {
    padding: 0;
    :deep(.el-badge__content.is-fixed) {
      right: calc(-10px + var(--el-badge-size) / 2) !important;
    }
  }
}
</style>

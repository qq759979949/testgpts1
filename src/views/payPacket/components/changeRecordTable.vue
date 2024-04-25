<!-- 查看变更记录

-->
<template>
  <div class="levelTable">
    <pisx-dialog :title="title" :width="width" :isShow="Data.isShowDisabled" @close="close('变更记录')" @submit="submit('变更记录')">
      <template #content>
        <div class="changeTop">
          <span>共3个对象</span>
          <div style="margin-left: 10px">
            <el-input v-model="Data.changeSearchVal" placeholder="请输入你需要搜索的内容" @focus="showSelectMember">
              <template #suffix>
                <el-icon class="el-input__icon"><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
        <PiTable
          :columns="Data.changeRecordColumn"
          :data="Data.changeRecordTableData"
          :selectable="false"
          :isShowSetting="false"
          rowKey="index"
          :tableLoad="Data.tableLoad"
          :pagination="true"
          :total="Data.tableData.length"
          ref="projectTable"
          @updateTableData="updateTableData"
        ></PiTable>
      </template>
    </pisx-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '变更记录',
  },
  width: {
    type: Number || String,
    default: '60vw',
  },
  isShow: {
    type: Boolean,
    default: false,
  },
});

const Data = reactive({
  isShowDisabled: false,
});

watch();
</script>

<style lang="less" scoped></style>

<template>
  <div class="selfTest">
    <div class="labelInput">
      <div class="label">自检人</div>
      <el-select v-model="value1" placeholder="请选择" style="width: 100%">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div class="labelInput">
      <div class="label">交付物说明</div>
      <el-select v-model="value1" placeholder="请选择" style="width: 100%">
        <el-option v-for="item in Data.descriptionList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input :rows="3" type="textarea" style="margin-top: 10px" placeholder="请输入交付物说明" />
    </div>
    <div class="labelInput">
      <div class="label">自检要素</div>
      <el-input :rows="3" type="textarea" placeholder="请输入自检要素" />
    </div>
    <div class="labelInput">
      <div class="label">来源</div>
      <el-input placeholder="请输入来源" />
    </div>
    <div class="labelInput">
      <div class="label">可裁剪</div>
      <el-select v-model="value1" placeholder="请选择" style="width: 100%">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
  </div>
</template>
<script setup>
const Data = reactive({
  descriptionList: [],
  oid: '',
});
onMounted(() => {
  Data.oid = sessionStorage.getItem('editOid');
});
</script>

<style scoped lang="scss">
.selfTest {
  .labelInput {
    margin-bottom: 10px;
    .label {
      font-size: 14px;
      color: #333;
      text-align: left;
      margin-bottom: 10px;
    }
  }
}
</style>

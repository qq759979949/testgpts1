<template>
 <div class="selfTestTable">
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="自检人" prop="people"/>
    <el-table-column label="自检结果" prop="result">
      <template #default="scope">
        <el-select v-model="scope.row.result"  placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="意见" width="180">
      <template #default="scope">
        <el-input style="width: 100px" v-model="scope.row.advice"/>
      </template>
    </el-table-column>
    <el-table-column label="来源" prop="source" />
  </el-table>
 </div>
</template>
<script>
const options = [
  {
    value: '通过',
    label: '通过',
  },
  {
    value: '不通过',
    label: '不通过',
  },
]
export default {
  name: 'SelfTestTable',
  data () {
    return {
      tableData: [
        {
          people: '文雅晴',
          advice: '11111',
          result: '通过',
          source: '来源'
        }
      ],
      options
    }
  }
}
</script>

<style scoped lang='scss'>
.selfTestTable {

}

</style>
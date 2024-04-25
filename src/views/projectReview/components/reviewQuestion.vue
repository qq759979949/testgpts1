<template>
  <div class="reviewQuestion">
    <div class="labelInput">
      <div class="label">{{ questionRisk }}名称</div>
      <el-input placeholder="请输入问题名称"/>
    </div>
    <div class="labelInput">
      <div class="label">{{ questionRisk }}类型</div>
      <el-select v-model="value1"  placeholder="请选择" style="width: 100%">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="labelInput">
      <div class="label">提出人</div>
      <el-input disabled/>
    </div>
    <div class="labelInput">
      <div class="label">提出时间</div>
      <el-date-picker
        type="date"
        style="width: 100%"
        placeholder="Pick a day"
      />
    </div>
    <div class="labelInput">
      <div class="label">责任人</div>
      <el-input disabled/>
    </div>
    <div class="labelInput">
      <div class="label">期望解决时间</div>
      <el-date-picker
        type="date"
        style="width: 100%"
        placeholder="Pick a day"
      />
    </div>
    <div class="labelInput">
      <div class="label">关联阶段</div>
      <el-select placeholder="请选择" style="width: 100%">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="labelInput">
      <div class="label">{{ questionRisk }}描述</div>
      <el-input :rows="3" type="textarea" placeholder="请输入自检要素"/>
    </div>
    <div class="labelInput">
      <div class="label">上传附件</div>
      <el-input placeholder="请输入来源"/>
    </div>
    <div class="processDealt">流程处理</div>
    <div class="label1">初审</div>
    <el-select v-model="value1"  placeholder="请选择" style="width: 100%">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div class="label1">审核</div>
    <el-select v-model="value1"  placeholder="请选择" style="width: 100%">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div class="label1">{{ questionRisk }}处理</div>
    <el-select v-model="value1"  placeholder="请选择" style="width: 100%">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div class="label1">{{ questionRisk }}确认</div>
    <el-select v-model="value1"  placeholder="请选择" style="width: 100%">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>
<script>
const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
export default {
  name: 'ReviewQuestion',
  props: {
    questionRisk: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      value1: '',
      options,
    }
  }
}
</script>

<style scoped lang='scss'>
.reviewQuestion {
  .labelInput {
    margin-bottom: 10px;
    .label{
      font-size: 14px;
      color: #333;
      text-align: left;
      margin-bottom: 10px;
    }
  }
  .processDealt {
    font-size: 16px;
    font-weight: 550;
    margin: 10px 0;
  }
  .label1{
      font-size: 14px;
      color: #333;
      text-align: left;
      margin: 10px 0;
    }

}

</style>
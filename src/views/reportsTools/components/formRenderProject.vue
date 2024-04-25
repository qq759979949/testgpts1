<template>
  <div class="formRenderProject">
    <!-- INPUT -->
    <el-input
      v-if="typeMap[option[prop.filedType]] === 'INPUT' && option.dataType !== 'java.lang.Long'"
      :disabled="!!option[prop.readOnly]"
      v-model="data[option[prop.name]]"
      placeholder="请输入内容"
      @input="inputChange"
    ></el-input>
    <!-- INPUT 数字 -->
    <el-input
      v-else-if="typeMap[option[prop.filedType]] === 'INPUT' && option.dataType !== 'java.lang.String'"
      class="numberInput"
      type="number"
      v-model="data[option[prop.name]]"
      placeholder="请输入数字"
      :disabled="!!option[prop.readOnly]"
    ></el-input>
    <!-- SELECT-->
    <el-select
      v-else-if="typeMap[option[prop.filedType]] === 'SELECT'"
      style="width: 100%"
      v-model="data[option[prop.name]]"
      :placeholder="'请选择内容'"
      :disabled="!!option[prop.readOnly]"
      @change="inputChange(option)"
      :multiple="option[prop.multiple] ? true : false"
      :multiple-limit="3"
      clearable
    >
      <el-option v-for="item in option[prop.options]" :key="item[prop.optionValue]" :label="item[prop.optionLabel]" :value="item[prop.optionValue]"></el-option>
    </el-select>
    <el-select
      v-else-if="typeMap[option[prop.filedType]] === 'SELECTFILTER'"
      style="width: 100%"
      v-model="data[option[prop.name]]"
      :placeholder="'请选择内容'"
      :disabled="!!option[prop.readOnly]"
      @change="inputChange(option)"
      :multiple="option[prop.multiple] ? true : false"
      filterable
      clearable
    >
      <el-option v-for="item in option[prop.options]" :key="item[prop.optionValue]" :label="item[prop.optionLabel]" :value="item[prop.optionValue]"></el-option>
    </el-select>

    <!-- DATE -->
    <el-date-picker
      v-else-if="typeMap[option[prop.filedType]] === 'DATE'"
      style="width: 100%"
      v-model="data[option[prop.name]]"
      type="date"
      placeholder="选择日期"
      value-format="YYYY/MM/DD"
      :disabled="!!option[prop.readOnly]"
      @change="inputChange"
    ></el-date-picker>
    <el-date-picker
      v-else-if="typeMap[option[prop.filedType]] === 'DATERANGE'"
      style="width: 100%"
      v-model="data[option[prop.name]]"
      type="daterange"
      start-placeholder="选择日期"
      end-placeholder="选择日期"
      value-format="YYYY/MM/DD"
      :disabled="!!option[prop.readOnly]"
    ></el-date-picker>
    <el-date-picker
      v-else-if="typeMap[option[prop.filedType]] === 'YEAR'"
      style="width: 100%"
      v-model="data[option[prop.name]]"
      type="year"
      value-format="YYYY"
      placeholder="选择年份"
      :disabled="!!option[prop.readOnly]"
      @change="inputChange"
    ></el-date-picker>
    <!-- TEXTAREA -->
    <el-input
      v-else-if="typeMap[option[prop.filedType]] === 'TEXTAREA'"
      type="textarea"
      :rows="4"
      placeholder="请输入内容"
      v-model="data[option[prop.name]]"
      @input="inputChange"
      :disabled="!!option[prop.readOnly]"
    ></el-input>
    <!-- RADIO -->
    <el-radio-group v-else-if="typeMap[option[prop.filedType]] === 'RADIO'" v-model="data[option[prop.name]]" :disabled="!!option[prop.readOnly]">
      <el-radio v-for="item in option[prop.options]" :key="item[prop.optionValue]" :label="item[prop.optionValue]">
        {{ item[prop.optionLabel] }}
      </el-radio>
    </el-radio-group>
    <!-- UPLOAD -->
    <el-upload v-else-if="typeMap[option[prop.filedType]] === 'UPLOAD'" :auto-upload="false" v-model:file-list="data[option[prop.name]]" action="/">
      <el-button type="primary">上传</el-button>
    </el-upload>
    <!-- BUTTON -->
    <div class="button" v-else-if="typeMap[option[prop.filedType]] === 'BUTTON'">
      <div @click="option.showDialog = true">
        <el-input readonly placeholder="请输入内容" v-model="option[prop.displayValue]">
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <slot :name="option[prop.name]" :option="option"></slot>
    </div>
  </div>
</template>

<script>
import { getSecondaryDepartments } from '@/api/project';
export default {
  name: 'formRenderProject',
  props: {
    option: {
      type: Object,
      default: () => {
        return {};
      },
    },
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    prop: {
      type: Object,
      default: () => {
        return {};
      },
    },
    projectTypeValue: {
      type: String,
      default: '',
    },
  },
  computed: {},
  data() {
    return {
      typeMap: {
        INPUT: 'INPUT',
        text: 'INPUT',
        SELECT: 'SELECT',
        select: 'SELECT',
        selectFilter: 'SELECTFILTER',
        SELECTFILTER: 'SELECTFILTER',
        REMOTESELECT: 'REMOTESELECT',
        DATE: 'DATE',
        Date: 'DATE',
        DATERANGE: 'DATERANGE',
        DateRange: 'DATERANGE',
        YEAR: 'YEAR',
        year: 'YEAR',
        TEXTAREA: 'TEXTAREA',
        textArea: 'TEXTAREA',
        RADIO: 'RADIO',
        BUTTON: 'BUTTON',
        DISPLAY: 'DISPLAY',
        UPLOAD: 'UPLOAD',
        TREESELECT: 'TREESELECT',
      },
      projectGroupList: [],
    };
  },
  mounted() {},
  methods: {
    changeData(option) {
      this.data[option[prop.name]] = (option.selected || []).map((el) => el[option.valueKey || 'key']);
      if (option.single) {
        this.data[option[prop.name]] = this.data[option[prop.name]].join(',');
      }
      option.displayValue = (option.selected || []).map((el) => el[option.labelKey || 'title']).join(',');
      option.showDialog = false;
    },
    inputChange(obj) {
      if (obj.name === 'primaryDepartment' && this.data.primaryDepartment !== '') {
        let departItem = obj.options.find((e) => e.label === this.data.primaryDepartment || e.value === this.data.primaryDepartment);
        // this.data.SecondaryDepartment = '';
        // getSecondaryDepartments({ oid: departItem.oid }).then((res) => {
        //   if (res.success) {
        //     this.projectGroupList = [];
        //     for (let key in res.data.options) {
        //       let obj1 = {};
        //       obj1.value = key;
        //       obj1.label = res.data.options[key];
        //       this.projectGroupList.push(obj1);
        //     }
        //     this.$emit('changeSecondGroup', 'secondGroup', this.projectGroupList);
        //   } else {
        //     this.$message.error(res.message);
        //   }
        // });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.formRenderProject {
  width: 100%;
}
.formRenderProject :deep(input[type='number']) {
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  -moz-appearance: textfield;
}
.inputBox {
  display: flex;
  .numberInput {
    flex: 1;
  }
  .unit {
    padding-left: 16px;
  }
}
.button {
  :deep(.el-dialog__body) {
    padding: 20px 20px 10px;
  }
}
.goPage {
  color: #5bb73b;
  &:hover {
    color: #64d83d;
  }
  &:avtive {
    color: #67d641;
  }
}
.dialog {
  :deep(.el-dialog__body) {
    padding: 12px 20px;
    max-height: 60vh;
    overflow-y: auto;
  }
}
</style>

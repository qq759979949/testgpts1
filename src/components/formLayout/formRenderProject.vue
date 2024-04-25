<template>
  <div class="formRenderProject">
    <!-- INPUT -->
    <el-input
      v-if="typeMap[option[prop.filedType]] === 'INPUT' && option.dataType !== 'java.lang.Long' && option[prop.name] !== 'ObjectivesAndDeliverables'"
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
    <div v-else-if="(typeMap[option[prop.filedType]] === 'INPUT' || typeMap[option[prop.filedType]] === 'TEXTAREA') && option[prop.name] === 'ObjectivesAndDeliverables'">
      <el-table :data="data[option[prop.name]]" style="width: 100%" max-height="250">
        <el-table-column prop="a" label="项目目标及可交付成果">
          <template #default="scope">
            <el-input placeholder="请输入" v-model="scope.row.a" type="textarea" />
          </template>
        </el-table-column>
        <el-table-column width="70">
          <template #default="scope">
            <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index, option[prop.name])">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="mt-4" style="width: 100%" @click="onAddItem(option[prop.name])">添加</el-button>
    </div>
    <!-- SELECT-->
    <el-select
      v-else-if="typeMap[option[prop.filedType]] === 'SELECT'"
      style="width: 100%"
      v-model="data[option[prop.name]]"
      :placeholder="option[prop.name] === 'projectTemplateReference' ? '请注意选择正确的模板，项目创建后模板不可以调整' : '请选择内容'"
      :disabled="!!option[prop.readOnly]"
      @change="inputChange(option)"
      @focus="blurTonnage(option)"
      :multiple="option[prop.name] === 'DevelopAttributes_B' || option[prop.name] === 'ProjectPurpose' ? true : false"
      :multiple-limit="option[prop.name] === 'DevelopAttributes_B' ? 3 : null"
      clearable
    >
      <el-option v-for="item in option[prop.options]" :key="item[prop.optionValue]" :label="item[prop.optionLabel]" :value="item[prop.optionValue]"></el-option>
    </el-select>

    <!-- SELECT b类-->
    <!-- <el-select
      v-else-if="typeMap[option[prop.filedType]] === 'SELECT' && option[prop.name] === 'DevelopAttributes_B'"
      style="width: 100%;"
      v-model="data[option[prop.options]]"
      placeholder="请选择内容"
      :disabled="!!option[prop.readOnly]"
      @change="inputChange(option)"
      multiple
    >
      <el-option
        v-for="item in option[prop.projectGroupList]"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select> -->

    <!-- TREESELECT -->
    <el-tree-select
      v-else-if="typeMap[option[prop.filedType]] === 'TREESELECT'"
      style="width: 100%"
      v-model="data[option[prop.name]]"
      :data="option[prop.options]"
      :props="option[prop.props]"
      multiple
      :node-key="option[prop.nodeKey]"
      :fit-input-width="true"
      :popper-append-to-body="false"
      :render-after-expand="false"
    ></el-tree-select>
    <!-- REMOTESELECT -->
    <remoteSelect v-else-if="typeMap[option[prop.filedType]] === 'REMOTESELECT'" :option="option" :data="data"></remoteSelect>
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
      <!-- <el-dialog
        class="dialog"
        :title="'选择' + option.label"
        v-model="option.showDialog"
        :width="option.width || '30%'"
        append-to-body
        :lock-scroll="true"
      >
        <slot :name="option[prop.name]" :option="option"></slot>
        <span slot="footer" class="dialog-footer">
          <el-button @click="option.showDialog = false">取 消</el-button>
          <el-button type="primary" @click="changeData(option)">
            确 定
          </el-button>
        </span>
      </el-dialog> -->
    </div>
    <div v-else-if="typeMap[option[prop.filedType]] === 'DISPLAY'">
      <!-- 对产品目录，销售目录，PBI团队特殊处理 -->
      <slot :name="option[prop.name]" :option="option">
        <a v-if="option.dataType === 'com.ptc.core.meta.common.TypeInstanceIdentifier'" class="goPage" :href="option.value" target="_blank">
          {{ option.displayValue }}
        </a>
        <span v-else v-html="option.displayValue || option.value"></span>
      </slot>
    </div>
  </div>
</template>

<script>
import remoteSelect from './remoteSelect.vue';
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
  components: {
    remoteSelect,
  },
  computed: {},
  data() {
    return {
      typeMap: {
        INPUT: 'INPUT',
        text: 'INPUT',
        SELECT: 'SELECT',
        select: 'SELECT',
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
      tableData: [],
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
    blurTonnage(obj) {
      if (obj.name === 'ProductCategory' || obj.name === 'Tonnage') {
        if (this.data.ProductCategory) {
          this.$emit('changeSecondGroup', 'ProductCategory', this.data.ProductCategory);
        }
      }
    },
    inputChange(obj) {
      if (obj.name === 'projectGroupReference' && this.data.projectGroupReference !== '') {
        this.data.SecondaryDepartment = '';
        // getSecondaryDepartments({ oid: this.data.projectGroupReference }).then((res) => {
        //   if (res.success) {
        //     this.projectGroupList = [];
        //     for (let key in res.data.options) {
        //       let obj1 = {};
        //       obj1.value = key;
        //       obj1.label = res.data.options[key];
        //       this.projectGroupList.push(obj1);
        //     }
        this.$emit('changeSecondGroup', 'secondGroup', this.data.projectGroupReference);
        //   } else {
        //     this.$message.error(res.message);
        //   }
        // });
      }
      if (obj.name === 'projectType' && this.projectTypeValue === 'cn.sdlg.productDevelopProject' && this.data.projectType === '开发类-全新产品A') {
        this.data.DevelopAttributes_B = '';
        this.$emit('changeSecondGroup', 'developA');
      }
      if (obj.name === 'projectType' && this.projectTypeValue === 'cn.sdlg.productDevelopProject' && this.data.projectType === '开发类-重大改进B') {
        this.data.DevelopAttributes_A = '';
        this.$emit('changeSecondGroup', 'developB');
      }
      if (
        obj.name === 'projectType' &&
        this.projectTypeValue === 'cn.sdlg.productDevelopProject' &&
        this.data.projectType !== '开发类-全新产品A' &&
        this.data.projectType !== '开发类-重大改进B'
      ) {
        this.data.DevelopAttributes_B = '';
        this.data.DevelopAttributes_A = '';
        this.$emit('changeSecondGroup', 'develop');
      }
      if (obj.name === 'ProductCategory') {
        this.data.Tonnage = '';
        this.$emit('changeSecondGroup', 'ProductCategory', this.data.ProductCategory);
      }
    },
    dealDevelop(item, i) {
      if (i === 'DevelopAttributes_B') {
        item = JSON.parse(item);
      }
      return item;
    },
    deleteRow(index, option) {
      this.data[option].splice(index, 1);
    },
    onAddItem(option) {
      if (!this.data[option]) {
        this.data[option] = [];
      }
      this.data[option].push({
        a: '',
      });
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

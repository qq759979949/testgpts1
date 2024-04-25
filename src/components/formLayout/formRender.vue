<template>
  <div class="formRender">
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
    <!-- SELECT -->
    <el-select
      v-else-if="typeMap[option[prop.filedType]] === 'SELECT'"
      style="width: 100%"
      v-model="data[option[prop.name]]"
      placeholder="请选择内容"
      :disabled="!!option[prop.readOnly]"
      @change="inputChange"
    >
      <el-option v-for="item in option[prop.options]" :key="item[prop.optionValue]" :label="item[prop.optionLabel]" :value="item[prop.optionValue]"></el-option>
    </el-select>
    <!-- TREESELECT -->
    <el-tree-select
      v-else-if="typeMap[option[prop.filedType]] === 'TREESELECT'"
      style="width: 100%"
      v-model="data[option[prop.name]]"
      :data="option[prop.options]"
      :props="option[prop.props]"
      :node-key="option[prop.nodeKey]"
      check-strictly
      :render-after-expand="false"
    />
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
export default {
  name: 'formRender',
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
        TEXTAREA: 'TEXTAREA',
        textArea: 'TEXTAREA',
        RADIO: 'RADIO',
        BUTTON: 'BUTTON',
        DISPLAY: 'DISPLAY',
        UPLOAD: 'UPLOAD',
        TREESELECT: 'TREESELECT',
      },
    };
  },
  methods: {
    changeData(option) {
      this.data[option[prop.name]] = (option.selected || []).map((el) => el[option.valueKey || 'key']);
      if (option.single) {
        this.data[option[prop.name]] = this.data[option[prop.name]].join(',');
      }
      option.displayValue = (option.selected || []).map((el) => el[option.labelKey || 'title']).join(',');
      option.showDialog = false;
    },
    inputChange() {
      // this.$forceUpdate()
    },
  },
};
</script>

<style scoped lang="scss">
.formRender {
  width: 100%;
}
.formRender :deep(input[type='number']) {
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

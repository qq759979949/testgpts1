<template>
  <div class="formRender">
    <!-- INPUT -->
    <el-input
      v-if="typeMap[option[prop.filedType]] === 'INPUT' && option.dataType === 'java.lang.String'"
      :disabled="!!option[prop.readOnly]"
      v-model="data[option[prop.name]]"
      placeholder="请输入内容"
      @input="inputChange"
    ></el-input>
    <!-- INPUT 数字 -->
    <el-input
      v-else-if="typeMap[option[prop.filedType]] === 'INPUT' && option.dataType === 'java.lang.Double'"
      class="numberInput"
      type="number"
      v-model="data[option[prop.name]]"
      oninput="value = value;value=value.replace(/\D/g,'')"
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
    <div v-else-if="typeMap[option[prop.filedType]] === 'UPLOAD'" style="display: flex; justify-content: space-between">
      <!-- <el-upload :auto-upload="false" v-model:file-list="data[option[prop.name]]" action="/" style="width: 90%" :limit="1" :on-exceed="handleExceed"> -->
      <el-upload
        :auto-upload="false"
        v-model:file-list="data[option[prop.name]]"
        action="/"
        style="width: 90%"
        :multiple="true"
        :disabled="!!option[prop.readOnly]"
        :on-change="changeFile"
        :on-remove="removeFile"
      >
        <el-input placeholder="请上传" readonly v-model="info" class="fileInfo">
          <template #suffix>
            <el-icon class="el-input__icon"><Upload /></el-icon>
          </template>
        </el-input>
        <!-- <el-button type="primary">上传</el-button> -->
      </el-upload>
      <el-button @click="downLoad(reviewType)">下载模板</el-button>
    </div>
  </div>
</template>

<script>
import { useCommonHandler } from '@/hooks';
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
    reviewType: {
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
        REMOTESELECT: 'REMOTESELECT',
        DATE: 'DATE',
        Date: 'DATE',
        TEXTAREA: 'TEXTAREA',
        textArea: 'TEXTAREA',
        RADIO: 'RADIO',
        BUTTON: 'BUTTON',
        DISPLAY: 'DISPLAY',
        UPLOAD: 'UPLOAD',
        FILE: 'FILE',
        TREESELECT: 'TREESELECT',
      },
      info: '',
    };
  },
  methods: {
    changeFile(e) {
      if (e) {
        this.info = '请上传';
      }
    },
    removeFile(e) {
      this.info = '';
    },
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
    //下载模板
    downLoad(e) {
      sessionStorage.removeItem('downloadName');
      let params = new FormData();
      params.append('reviewType', e);
      window.$api.projectInitiationApi.downloadFinancialTemplate(params).then((res) => {
        if (!res) return window.$message.error('下载失败');
        let str = decodeURIComponent(sessionStorage.getItem('downloadName'));
        useCommonHandler.download(res, str.split('=')[1]);
      });
    },
    // 上传文件超出限制执行的方法
    handleExceed(file) {
      if (this.option['name'] === 'fileInfo') {
        this.data[this.option[this.prop.name]] = [];
        let fileList = [
          {
            name: file[0].name,
            raw: file[0],
            percentage: 0,
            size: file[0].size,
            status: 'ready',
            uid: file.uid,
          },
        ];
        this.data[this.option[this.prop.name]] = fileList;
      }
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
:deep(.el-upload) {
  width: 90%;
}
.fileInfo {
  :deep(.el-input__inner) {
    color: #a8abb2;
  }
}
</style>

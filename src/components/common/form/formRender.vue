<template>
  <div class="formRender" data-fileOid="OR:wt.content.ApplicationData:1119567683">
    <!-- INPUT -->
    <el-input
      v-if="typeMap[option[prop.filedType]] === 'INPUT' && option.dataType !== 'java.lang.Long'"
      :disabled="!!option[prop.readOnly]"
      v-model="bindData[option[prop.name]]"
      clearable
      :placeholder="option[prop.readOnly] ? '自动生成' : '请输入内容'"
      @input="inputChange"
    ></el-input>
    <div v-if="typeMap[option[prop.filedType]] === 'INPUT' && option.dataType !== 'java.lang.Long' && option[prop.descriptionFile]">
      <template v-if="option.name === 'name'">
        <div>
          <span>{{ getLinkData(option)[0].descPrev }}</span>
          <el-link style="margin: 0 4px" type="primary" :underline="false" @click="downloadTips(item)">{{ getLinkData(option)[0].fileName }}</el-link>
          ,
          <el-link style="margin: 0 4px" type="primary" :underline="false" @click="downloadTips(item)">{{ getLinkData(option)[1].fileName }}</el-link>
          <span>{{ getLinkData(option)[1].descPrev }}</span>
        </div>
        <div>
          <span>{{ getLinkData(option)[1].descNext }}</span>
        </div>
      </template>
      <template v-else>
        <div v-for="item in getLinkData(option)" :key="item.fileOid">
          <span>{{ item.descPrev }}</span>
          <el-link style="margin: 0 4px" :underline="false" type="primary" @click="downloadTips(item)">{{ item.fileName }}</el-link>
          <span>{{ item.descNext }}</span>
        </div>
      </template>
    </div>
    <!-- INPUTBUTTON -->
    <el-input
      v-if="typeMap[option[prop.filedType]] === 'INPUTBUTTON' && option.dataType !== 'java.lang.Long'"
      clearable
      :disabled="!!option[prop.readOnly]"
      v-model="bindData[option[prop.name]]"
      :placeholder="option[prop.readOnly] ? '自动生成' : '请输入内容'"
    >
      <template #append>
        <el-button style="font-size: 14px; color: rgba(0, 0, 0, 0.9); font-weight: bold" @click="inputButton(option)">{{ option['buttonValue'] }}</el-button>
      </template>
    </el-input>

    <!-- INPUT 数字 -->
    <el-input
      v-else-if="typeMap[option[prop.filedType]] === 'INPUT' && option.dataType !== 'java.lang.String'"
      class="numberInput"
      type="number"
      v-model.trim="bindData[option[prop.name]]"
      placeholder="请输入数字"
      :disabled="!!option[prop.readOnly]"
    ></el-input>
    <!-- SELECT -->
    <el-select
      v-else-if="typeMap[option[prop.filedType]] === 'SELECT'"
      style="width: 100%"
      v-model="bindData[option[prop.name]]"
      :multiple="!option.single"
      :filterable="!option.single"
      placeholder="请选择内容"
      :disabled="!!option[prop.readOnly]"
      :clearable="true"
      @change="inputChange"
    >
      <el-option v-for="item in option[prop.options]" :key="item[prop.optionValue]" :label="item[prop.optionLabel]" :value="item[prop.optionValue]"></el-option>
    </el-select>
    <template v-if="typeMap[option[prop.filedType]] === 'SELECT' && option[prop.descriptionFile]">
      <div v-for="item in getLinkData(option)" :key="item.fileOid">
        <span>{{ item.descPrev }}</span>
        <el-link type="primary" :underline="false" @click="downloadTips(item)">{{ item.fileName }}</el-link>
        <span>{{ item.descNext }}</span>
      </div>
    </template>
    <!-- TREESELECT -->
    <el-tree-select
      v-else-if="typeMap[option[prop.filedType]] === 'TREESELECT'"
      style="width: 100%"
      v-model="bindData[option[prop.name]]"
      :data="option[prop.options]"
      :props="option[prop.props]"
      :node-key="option[prop.nodeKey]"
      check-strictly
      :render-after-expand="false"
    />
    <!-- REMOTESELECT -->
    <RemoteSelect v-else-if="typeMap[option[prop.filedType]] === 'REMOTESELECT'" :option="option" :data="data"></RemoteSelect>
    <!-- DATE -->
    <el-date-picker
      v-else-if="typeMap[option[prop.filedType]] === 'DATE'"
      style="width: 100%"
      v-model="bindData[option[prop.name]]"
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
      v-model="bindData[option[prop.name]]"
      @input="inputChange"
      :disabled="!!option[prop.readOnly]"
    ></el-input>
    <!-- RADIO -->
    <el-radio-group v-else-if="typeMap[option[prop.filedType]] === 'RADIO'" v-model="bindData[option[prop.name]]" :disabled="!!option[prop.readOnly]">
      <el-radio v-for="item in option[prop.options]" :key="item[prop.optionValue]" :label="item[prop.optionValue]">
        {{ item[prop.optionLabel] }}
      </el-radio>
    </el-radio-group>
    <!-- UPLOAD -->
    <el-upload v-else-if="typeMap[option[prop.filedType]] === 'UPLOAD'" :auto-upload="false" v-model:file-list="bindData[option[prop.name]]" action="/">
      <el-button type="primary">上传</el-button>
    </el-upload>
    <!-- BUTTON -->
    <div class="button" v-else-if="typeMap[option[prop.filedType]] === 'BUTTON'">
      <!-- <div> -->
      <el-input placeholder="请输入内容" v-model="option[prop.displayValue]" clearable @clear="inputClear(option, prop)">
        <!-- <i slot="suffix" class="el-input__icon el-icon-search"></i> -->
        <template #append>
          <el-button @click="option.showDialog = true" :icon="Search" />
        </template>
      </el-input>
      <!-- </div> -->
      <slot :name="option[prop.name]" :option="option"></slot>
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
    <!-- 操作指南 -->
    <template v-else-if="typeMap[option[prop.filedType]] === 'HYPERLINK'">
      <div v-for="item in getLinkData(option)" :key="item.fileOid">
        <el-link type="primary" :underline="false" @click="downloadTips(item)">{{ '请点击下载：' + item.fileName }}</el-link>
      </div>
    </template>
  </div>
</template>

<script setup>
const $api = window.$api;
import { useCommonHandler } from '@/hooks';
import { inject } from 'vue';
// import remoteSelect from './remoteSelect.vue';
import { Search } from '@element-plus/icons-vue';
const props = defineProps({
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
});
const route = useRoute();
const { option } = toRefs(props);
// const bindData = ref(props.data);
const bindData = computed(() => {
  return props.data;
});
// const bindOption = ref(props.option);

const typeMap = reactive({
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
  HYPERLINK: 'HYPERLINK',
  INPUTBUTTON: 'INPUTBUTTON',
});
const inputChange = () => {};

const handleFunction = inject('handleFunction', null);
const inputButton = (option) => {
  // 调用函数 -- 从爷组件中获取共享的函数
  if (handleFunction) {
    handleFunction(option);
  }
};

const getLinkData = (data) => {
  const originStr = data.filedType === 'HYPERLINK' ? data.displayValue : data.descriptionFile;
  const str = JSON.parse(originStr);
  const arr = Object.keys(str);
  const regex = /(<a>)([^]+)(<\/a>)/g;
  const splitStr = [];
  arr.forEach((item) => {
    splitStr.push(str[item]);
  });
  const newArr = arr.map((item) => {
    const itemStr = str[item].replace(regex, ',,,');
    const itemStr_n = str[item].split('\n');
    return {
      fileOid: item,
      descPrev: itemStr.split(',,,')[0] || itemStr_n[0].replace(regex, ''),
      descNext: itemStr_n[1] || itemStr.split(',,,')[1],
      fileName: data.filedType === 'HYPERLINK' ? str[item] : str[item]?.match(regex)[0].replace(regex, '$2'),
    };
  });
  return newArr;
};
const downloadTips = ({ fileOid, fileName }) => {
  $api.createApi
    .downloadContent({ oid: fileOid })
    .then((result) => {
      if (!result) return window.$message.error('下载失败');
      useCommonHandler.download(result, fileName);
    })
    .catch((err) => {});
};

/**
 * 清空
 */
const inputClear = (option, value) => {
  bindData.value[option.name] = '';
};
</script>

<style scoped lang="less">
.formRender {
  display: inline-block;
  width: 90%;
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
  :deep(.el-input--suffix) {
    .el-input__wrapper {
      box-shadow: none;
      border: 1px solid var(--el-input-border-color);
    }
    .el-input-group__append {
      background-color: #fff;
    }
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

<template>
  <el-form :model="submitData" ref="ruleForm" :rules="rules" :label-width="labelWidth" class="demo-ruleForm">
    <div v-for="(item, i) in formList" :key="i">
      <div class="form-content" :class="isInfo ? 'background' : ''">
        <el-row v-for="(array, j) in item.list" :key="j">
          <el-col v-for="el in array" :key="el[defaultprop.name]" :span="el.span || 24 / (array.length === 1 ? 2 : array.length)">
            <el-form-item :prop="el[defaultprop.name]" :rules="getRule(el)">
              <template #label>
                <div class="row-text" v-show-tip>
                  <el-tooltip placement="top" :content="el[defaultprop.label]">
                    <span>{{ el[defaultprop.label] + '：' }}</span>
                  </el-tooltip>
                </div>
                <el-popover placement="bottom-start" :title="el[defaultprop.label] + '规则：'" :width="'30vw'" trigger="click" v-if="el[defaultprop.description]">
                  <template #reference>
                    <span class="tips">
                      <el-icon size="20"><Warning /></el-icon>
                    </span>
                  </template>
                  <p v-html="el[defaultprop.description].replace(/\n/g, '<br/>')"></p>
                </el-popover>
              </template>
              <FormRender :option="el" :prop="defaultprop" :data="submitData" v-bind="$attrs">
                <template #[getSlotName(el)]="{ option }">
                  <slot :name="el[defaultprop.name]" :option="option"></slot>
                </template>
              </FormRender>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-form>
</template>

<script setup>
const { proxy: that } = getCurrentInstance();

const props = defineProps({
  formList: {
    type: Array,
    default: () => {
      return [];
    },
  },
  submitData: {
    type: Object,
    default: () => {
      return {};
    },
  },
  labelWidth: {
    type: String,
    default: '160px',
  },
  isInfo: {
    type: Boolean,
    default: true,
  },
  prop: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
const { formList } = toRefs(props);
/**计算属性 */
const maxCol = computed(() => {
  let max = null;
  formList.value.forEach((item) => {
    item.list.forEach((el) => {
      if (max < el.length) {
        max = el.length;
      } else {
        max = 2;
      }
    });
  });
  return max;
});
const defaultprop = computed(() => {
  let prop = {
    groupName: 'groupName',
    name: 'name',
    label: 'label',
    required: 'required',
    filedType: 'filedType',
    readOnly: 'readOnly',
    options: 'options',
    optionValue: 'value',
    optionLabel: 'label',
    displayValue: 'displayValue',
    props: 'props',
    nodeKey: 'nodeKey',
    description: 'description',
    descriptionFile: 'descriptionFile',
  };
  return Object.assign({}, prop, props);
});

const rules = ref();

onMounted(() => {
  // console.log(props.formList, 109); // Proxy {…}
});

const formatWord = (val) => {
  return val.replace(/\n/g, '<br>');
};

/**获取绑定 */
const ruleForm = ref();
const validate = (valid, fields) => {
  return ruleForm.value.validate(valid, fields);
};
const checkForm = () => {
  ruleForm.value.validate((valid, fields) => {
    for (let v in fields) {
      fields[v].forEach((v) => {
        window.$message.warning(v.message);
      });
    }
  });
};
const clearValidate = () => {
  return ruleForm.value.clearValidate();
};
const getSlotName = (el) => {
  return el[defaultprop.value.name];
};
const getRule = (data) => {
  let rule = [
    {
      required: data[defaultprop.value.required],
      message: '请输入' + data[defaultprop.value.label],
      trigger: ['blur', 'change'],
    },
  ];
  return rule;
};
defineExpose({
  ruleForm,
  validate,
  checkForm,
  clearValidate,
});
</script>

<style scoped lang="less">
.demo-ruleForm {
  .title {
    font-size: 16px;
    font-weight: bolder;
  }
  .row-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }

  :deep(.el-form-item) {
    margin-bottom: 16px;
    flex-direction: column;
    .el-form-item__label {
      justify-content: flex-start;
      align-items: center;
    }
    .el-form-item__content {
      width: 100%;
    }
    .tips {
      display: inline-block;
      width: 24px;
      height: 24px;
      cursor: pointer;
      border-radius: 50%;
      // margin-left: 10px;
      color: #92929d;
      &:hover {
        color: #0062ff;
      }
    }
  }
}
</style>

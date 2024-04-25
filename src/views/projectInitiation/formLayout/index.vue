<template>
  <el-form :model="submitData" ref="ruleForm" :label-width="labelWidth" class="demo-ruleForm">
    <div v-for="(item, i) in formList" :key="i">
      <div class="title" :id="item.tab" v-if="isInfo" v-show="item[defaultprop.groupName]">{{ item[defaultprop.groupName] }}</div>
      <div class="form-content" :class="isInfo ? 'background' : ''">
        <el-row v-for="(array, j) in item.list" :key="j">
          <el-col :span="el.span || 24 / maxCol" v-for="el in array" :key="el[defaultprop.name]">
            <el-form-item :prop="el[defaultprop.name]" :rules="getRule(el)">
              <template #label>
                <div class="row-text" v-show-tip>
                  <el-tooltip placement="top" :content="el[defaultprop.label]">
                    <span>{{ el[defaultprop.label] + '：' }}</span>
                  </el-tooltip>
                </div>
              </template>
              <formRender1 :option="el" :prop="defaultprop" :data="submitData" :reviewType="item[defaultprop.groupName]">
                <template #[getSlotName(el)]="{ option }">
                  <slot :name="el[defaultprop.name]" :option="option"></slot>
                </template>
              </formRender1>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-form>
</template>

<script>
import formRender1 from './formRender.vue';
export default {
  name: 'FormList',
  components: {
    formRender1,
  },
  props: {
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
      default: '240px',
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
  },
  data() {
    return {};
  },
  computed: {
    maxCol() {
      let max = 1;
      this.formList.forEach((item) => {
        item.list.forEach((el) => {
          if (max < el.length) {
            max = el.length;
          }
        });
      });
      return max;
    },
    defaultprop() {
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
      };
      return Object.assign({}, prop, this.prop);
    },
  },
  created() {},
  mounted() {},
  methods: {
    validate() {
      return this.$refs.ruleForm.validate();
    },
    clearValidate() {
      return this.$refs.ruleForm.clearValidate();
    },
    getSlotName(el) {
      return el[this.defaultprop.name];
    },
    getRule(data) {
      let rule = [
        {
          required: data.name === 'projectTemplateReference' ? true : data[this.defaultprop.required],
          message: data[this.defaultprop.label] === '附件' ? '请上传' + data[this.defaultprop.label] : '请输入' + data[this.defaultprop.label],
          trigger: ['blur', 'change'],
        },
      ];
      return rule;
    },
  },
};
</script>

<style scoped lang="scss">
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
    color: #666;
  }

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }
  :deep(.el-form-item__content) {
    color: #333;
  }
  :deep(.el-form-item__label) {
    display: inline-flex !important;
    justify-content: flex-start !important;
    align-items: flex-start !important;
    padding-left: 20px;
    flex: 0 0 auto !important;
    // max-width: 150px !important;
  }
  :deep(.el-row) {
    margin-bottom: 5px;
  }
}
</style>

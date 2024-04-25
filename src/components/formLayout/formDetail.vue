<template>
  <el-form :model="submitData" ref="ruleForm" :label-width="labelWidth" class="demo-ruleForm">
    <div v-for="(item, i) in formList" :key="i">
      <div class="title" :id="item.tab" v-if="isInfo" v-show="item[defaultprop.groupName]">{{ item[defaultprop.groupName] }}</div>
      <div class="form-content" :class="isInfo ? 'background' : ''">
        <el-row v-for="(array, j) in item.list" :key="j">
          <el-col :span="el.span || 24 / array.maxSpan" v-for="el in array" :key="el[defaultprop.name]">
            <el-form-item :prop="el[defaultprop.name]">
              <template #label>
                <div class="row-text" v-show-tip>
                  <el-tooltip placement="top" :content="el[defaultprop.label]">
                    <span>{{ el[defaultprop.label] }}</span>
                  </el-tooltip>
                </div>
              </template>
              <div v-html="el[defaultprop.displayValue]" class="row-value row-value1" v-if="el[defaultprop.name] === 'state.state'"></div>
              <div
                v-html="el[defaultprop.displayValue]"
                class="row-value"
                v-if="el[defaultprop.name] !== 'state.state' && el[defaultprop.name] !== 'ObjectivesAndDeliverables'"
              ></div>
              <div v-if="el[defaultprop.name] === 'ObjectivesAndDeliverables'">
                <el-table :data="el[defaultprop.displayValue]" style="width: 100%" max-height="250">
                  <el-table-column prop="number" label="序号" width="70"></el-table-column>
                  <el-table-column prop="a" label="项目目标及可交付成果" width="380" />
                </el-table>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-form>
</template>

<script>
export default {
  name: 'formLayout',
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
    isProject: {
      type: Boolean,
      default: false,
    },
    projectTypeValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  computed: {
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
    getSlotName(el) {
      return el[this.defaultprop.name];
    },
    // editFormList() {
    //   this.formList.forEach((item) => {
    //     item.list = item.list.map((el) => {
    //       el.maxSpan = el.length;
    //       return el;
    //     });
    //   });
    //   return this.formList;
    // },
  },
};
</script>

<style scoped lang="scss">
.demo-ruleForm {
  .title {
    font-size: 16px;
    font-weight: bolder;
    margin: 10px 0;
  }
  .row-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    color: #666;
    font-weight: 550;
    line-height: 18px;
    // line-height: 32px !important;
  }
  .row-value {
    line-height: 16px !important;
    white-space: pre-wrap;
    white-space: pre-wrap;
    word-wrap: break-word;
    width: 100%;
  }
  .row-value1 {
    color: #999;
  }

  :deep(.el-form-item) {
    margin-bottom: 5px;
  }
  :deep(.el-form-item__content) {
    color: #333;
    // line-height: 16px !important;
    // margin-top: -10px;
    padding-top: 10px;
    b {
      color: #386bd7;
    }
  }
  :deep(.el-form-item__label) {
    display: inline-flex !important;
    justify-content: flex-start !important;
    align-items: flex-start !important;
    padding-left: 20px;
    flex: 0 0 auto !important;
    max-width: 200px !important;
    line-height: 16px !important;
    height: 24px;
    padding-top: 10px;
  }
}
</style>

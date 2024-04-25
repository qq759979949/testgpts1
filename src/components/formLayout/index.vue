<template>
  <el-form :model="submitData" ref="ruleForm" :label-width="labelWidth" class="demo-ruleForm">
    <div v-for="(item, i) in newFormList" :key="i">
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
              <FormRenderProject :option="el" :prop="defaultprop" :data="submitData" v-if="isProject" @changeSecondGroup="changeSecondGroup" :projectTypeValue="projectTypeValue">
                <template #[getSlotName(el)]="{ option }">
                  <slot :name="el[defaultprop.name]" :option="option"></slot>
                </template>
              </FormRenderProject>
              <formRender :option="el" :prop="defaultprop" :data="submitData" v-else>
                <template #[getSlotName(el)]="{ option }">
                  <slot :name="el[defaultprop.name]" :option="option"></slot>
                </template>
              </formRender>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-form>
</template>

<script>
import formRender from './formRender.vue';
import FormRenderProject from './formRenderProject.vue';
import { getSecondaryDepartments } from '@/api/project';
let validcodeName = (rule, value, callback) => {
  if (rule.field === 'description') {
    //替换双字节汉字，为aa,限制输入框长度；
    if (value.length > 200) {
      callback(new Error('最多只能输入200字符'));
    } else {
      callback();
    }
  } else {
    //替换双字节汉字，为aa,限制输入框长度；
    if (value.length > 500) {
      callback(new Error('最多只能输入500字符'));
    } else {
      callback();
    }
  }
};
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
  components: {
    formRender,
    FormRenderProject,
  },
  data() {
    return {
      newFormList: [],
    };
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
  watch: {
    formList: {
      handler(n) {
        this.newFormList = n;
        setTimeout(() => {
          this.clearValidate(); // 解决表单初始化执行校验的问题
        }, 300);
      },
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
      let rule = [];
      if ((data[this.defaultprop.filedType] === 'INPUT' || data[this.defaultprop.filedType] === 'TEXTAREA') && data.name !== 'ObjectivesAndDeliverables') {
        rule = [
          {
            required: data.name === 'projectTemplateReference' ? true : data[this.defaultprop.required],
            message: '请输入' + data[this.defaultprop.label],
            trigger: ['blur', 'change'],
          },
          {
            // max: data.name === 'description' ? 200 : 500,
            validator: validcodeName,
            message: data.name === 'description' ? data[this.defaultprop.label] + ':' + '输入字符不可超过200' : data[this.defaultprop.label] + ':' + '输入字符不可超过500',
            trigger: ['change'],
          },
        ];
      } else {
        rule = [
          {
            required: data.name === 'projectTemplateReference' ? true : data[this.defaultprop.required],
            message: '请输入' + data[this.defaultprop.label],
            trigger: ['blur', 'change'],
          },
        ];
      }
      return rule;
    },
    changeSecondGroup(type, arr) {
      // eslint-disable-next-line vue/no-mutating-props
      this.newFormList = this.formList.map((item) => {
        if (item.groupName === '基本属性') {
          item.items = item.items.map((i) => {
            if (type === 'secondGroup') {
              if (i.name === 'SecondaryDepartment') {
                i.options = [];
                getSecondaryDepartments({ oid: arr }).then((res) => {
                  if (res.success) {
                    this.projectGroupList = [];
                    for (let key in res.data.options) {
                      let obj1 = {};
                      obj1.value = key;
                      obj1.label = res.data.options[key];
                      this.projectGroupList.push(obj1);
                    }
                    i.options = this.projectGroupList;
                  } else {
                    this.$message.error(res.message);
                  }
                });
              }
            } else if (type === 'develop') {
              if (i.name === 'DevelopAttributes_A' || i.name === 'DevelopAttributes_B') {
                i.readOnly = true;
                i.required = false;
              }
            } else if (type === 'developA') {
              if (i.name === 'DevelopAttributes_B') {
                i.readOnly = true;
                i.required = false;
              }
              if (i.name === 'DevelopAttributes_A') {
                i.readOnly = false;
                i.required = true;
              }
            } else if (type === 'developB') {
              if (i.name === 'DevelopAttributes_A') {
                i.readOnly = true;
                i.required = false;
              }
              if (i.name === 'DevelopAttributes_B') {
                i.readOnly = false;
                i.required = true;
              }
            } else if (type === 'ProductCategory') {
              if (i.name === 'Tonnage') {
                i.options = [];
                window.$api.projectApi.getDunTreeByCode({ code: arr }).then((res) => {
                  if (res.success) {
                    i.options = res.data.children.map((item) => {
                      item.label = item.areaName;
                      item.value = item.areaName;
                      return item;
                    });
                    // this.tonnageList = [];
                    // for (let key in res.data.options) {
                    //   let obj1 = {};
                    //   obj1.value = key;
                    //   obj1.label = res.data.options[key];
                    //   this.tonnageList.push(obj1);
                    // }
                    // i.options = this.projectGroupList;
                  } else {
                    this.$message.error(res.message);
                  }
                });
              }
            }
            return i;
          });
        }
        return item;
      });
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
}
</style>

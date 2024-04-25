<template>
  <div class="processSubmit">
    <slot v-if="processName === '重新提交'"></slot>
    <div class="actionBox">
      <table class="table">
        <tr class="row clearfix">
          <td class="col1">{{ $intl('resolution').d('处理意见') }}</td>
          <td class="col2">
            <div class="mb12 mt12" v-if="!isHandDetail">
              {{ $intl('commonOpinions').d('常用意见') }}：
              <el-select v-model="Data.opinion" @change="changeResolution">
                <el-option v-for="item in Data.commonOpinions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <span class="customize" @click="Data.dialogVisible = true">自定义</span>
            </div>
            <div class="mb12">
              <el-input v-model="Data.resolution" :rows="2" type="textarea" :disabled="isHandDetail" @change="changeResolution" />
            </div>
          </td>
        </tr>
      </table>
    </div>
    <el-dialog v-model="Data.dialogVisible" title="自定义处理意见" width="30%">
      <div>自定义常用处理意见（每行一个）</div>
      <el-input type="textarea" :rows="4" v-model="Data.textValue"></el-input>
      <div>说明：自定义意见配置好后，下次将可在常用意见下拉选择项中引用</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="Data.dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAdvice">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { getAllUser } from '@/api/team.js';
const props = defineProps({
  oid: {
    type: String,
  },
  // 是否显示操作行 --true任务使用，--false流程使用
  isTask: {
    type: Boolean,
    default: false,
  },
  // 任务以及流程查看使用 true--查看，false--编辑
  isHandDetail: {
    type: Boolean,
    default: false,
  },
  operationVal: {
    type: String,
    default: '通过',
  },
  /**按钮路由处理 */
  radioList: {
    type: Array,
    default: () => [],
  },
  processOID: {
    type: String,
  },
  processName: {
    type: String,
  },
  // isLoading: {
  //   type: Boolean,
  //   default: false,
  // },
});
const api = window.$api;
const route = useRoute();
const router = useRouter();
const Data = reactive({
  opinion: '',
  // 意见
  resolution: '',
  /**转办人员弹框 */
  isReassignDialog: false,
  /**搜索框数据 */
  userList: [],

  /**表单 */
  ruleForm: {},
  dialogVisible: false,
  textValue: '',

  /**用户 */
  userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),
  transferData: {},
  loading: false,
  isContentLoading: false,
  isLoading: false,
});
onMounted(() => {
  getAdviceList();
});
const changeResolution = (value) => {
  Data.resolution = value;
  emit('processResolution', Data.resolution);
};
// 批量设置建议
const submitAdvice = () => {
  const params = Data.textValue.split('\n').filter((it) => it !== '');
  window.$api.toDoApi.batchAddUserOpinion(params).then((res) => {
    if (res.success) {
      Data.dialogVisible = false;
      getAdviceList();
    } else {
      window.$message.error(res.message);
    }
  });
};
// 获取批量意见
const getAdviceList = () => {
  window.$api.toDoApi.listUserOpinion().then((res) => {
    if (res.success) {
      Data.commonOpinions = res.data.map((item) => {
        const obj = {};
        obj.label = item;
        obj.value = item;
        return obj;
      });
      Data.textValue = res.data.join('\n');
    } else {
      window.$message.error(res.message);
    }
  });
};
const emit = defineEmits(['processResolution']);
defineExpose({
  Data,
});
</script>

<style scoped lang="less">
.processSubmit {
  .actionBox {
    margin-top: 20px;
    padding-bottom: 20px;
    > table {
      width: 100%;
      border: 1px solid var(--el-border-color);
      border-collapse: collapse;
    }
    .row {
      min-height: 40px;
      line-height: 40px;
      border-bottom: 1px solid var(--el-border-color);
      .col1 {
        width: 160px;
        height: 100%;
        padding-left: 30px;
        background: #f6f6f6;
        border-right: 1px solid var(--el-border-color);
      }
      .col2 {
        width: calc(100% - 160px);
        padding-left: 30px;
        :deep(.el-radio) {
          top: 2px;
        }
        .mb12 {
          :deep(.el-button) {
            height: 24px;
            background: #386bd7;
            border-radius: 2px;
            padding: 0 9px;
          }
        }
      }
      .colSelect {
        padding-top: 20px;
      }
    }
  }
  .customize {
    font-size: 14px;
    font-weight: 400;
    color: #999;
    border: 1px solid #dcdfe6;
    padding: 5px 10px;
    margin-left: 20px;
    border-radius: 4px;
    position: relative;
    top: 2px;
    cursor: pointer;
  }
  :deep(.el-dialog__footer) {
    border-top: solid 1px #dedede;
  }
}
</style>

<template>
  <div class="phase" v-loading="Data.cardVisible">
    <div class="phase_box">
      <el-row :gutter="20">
        <el-col :md="4" :lg="4" :xl="3" class="left_box">
          <div class="outer">
            <div class="inside">
              <p class="grade">{{ Data.currentScore }}</p>
              <p class="grade-text">当前得分</p>
            </div>
          </div>
        </el-col>
        <el-col :md="20" :lg="20" :xl="21">
          <div class="card">
            <div
              class="card_item"
              :class="Data.currentIndex === item.pointOrder ? 'ccurrent-item' : 'other-item'"
              v-for="(item, index) in Data.cardList"
              :key="index"
              @click="handleCurrent(item)"
            >
              <p
                class="isTips"
                v-if="!isCompleted && item.isScoreTip && route.query.templateName === 'EvaluationGradeProcess'"
                :class="item.markIdentify === '已打分' ? 'mark-identify' : 'please-identify'"
              >
                {{ item.markIdentify }}
              </p>
              <p class="card-title">{{ item.pointName }}</p>
              <p class="card-grade">
                {{ item.score ? item.score : 0 }}
                <span class="grade-text">分</span>
              </p>
              <p class="scored-item">
                <img src="@/assets/img/alreadyScored.png" alt="" />
                <span class="scored">{{ item.completeUser.length + '人已打分' }}</span>
              </p>
              <p class="scored-item">
                <img src="@/assets/img/unscored.png" alt="" />
                <span class="scored">{{ item.inCompleteUser.length + '人未打分' }}</span>
              </p>
            </div>
          </div>
          <div class="detail_box" v-if="Data.currentIndex">
            <!-- v-for="(item, index) in Data.contentList" :key="index" -->
            <el-row :gutter="20">
              <el-col :span="12" class="details" v-for="(itm, idx) in Data.contentList" :key="idx">
                <el-row :gutter="20">
                  <el-col :md="6" :lg="6" :xl="4">
                    <span v-show-tip class="details-left">{{ itm.title }}</span>
                  </el-col>
                  <el-col :md="18" :lg="18" :xl="20">
                    <span class="details-right">{{ itm.content }}</span>
                    <ul style="list-style-type: none; padding: 0; margin: 0">
                      <li class="base-item" v-for="(stand, sindex) in itm.stand" :key="sindex">{{ stand ? stand : '-' }}</li>
                    </ul>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="phase_table" v-if="Data.currentIndex">
      <NewPiTable :columns="Data.columns" :data="Data.tableData" :selectable="false" rowKey="resultOid" :pagination="false" :isShowSetting="false">
        <template #attachment="scope">
          <el-link style="color: #386bd7" v-if="scope.row?.attachment.length <= 1" @click="handleExport(scope.row?.attachment[0])">
            {{ scope.row?.attachment[0]?.fileName }}
          </el-link>
          <el-dropdown v-else>
            <span class="el-dropdown-link">
              {{ scope.row?.attachment ? scope.row?.attachment[0].fileName : '' }}
              <span class="file-number">{{ scope.row?.attachment?.length }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(item, index) in scope.row?.attachment" :key="index">
                  <span @click="handleExport(item)">{{ item.fileName }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </NewPiTable>
    </div>
    <div class="project_detail">
      <el-button type="primary" @click="handeProjectDetail">项目详情</el-button>
      {{ Data.currentIndex }}
      {{ handScoreVisible }}
      <div class="form_style" v-if="!isCompleted && Data.currentIndex && handScoreVisible">
        <el-form :model="Data.form" label-width="120px">
          <el-form-item :label="item.label + ':'" v-for="(item, index) in formData" :key="index">
            <template #label>
              <div class="row-text" v-show-tip>
                <span style="color: red; margin-right: 5px" v-if="item.name === 'resultScore'">*</span>
                <el-tooltip placement="top" :content="item.label">
                  <span>{{ item.label + '：' }}</span>
                </el-tooltip>
              </div>
            </template>
            <el-input
              v-model="Data.form[item.name]"
              @change="(e) => inputChange(e, item)"
              :placeholder="'请输入' + item.label"
              type="textarea"
              style="width: 680px"
              v-if="item.filedType === 'TEXTAREA'"
            />
            <el-input-number
              :controls="false"
              v-model="Data.form[item.name]"
              @change="(e) => inputChange(e, item)"
              :placeholder="scorePlaceholder"
              style="width: 245px"
              v-else-if="item.filedType === 'INPUT'"
            />
            <el-upload
              v-else-if="item.filedType === 'FILE'"
              v-model:file-list="Data.uploadFileList"
              action="/"
              multiple
              :auto-upload="false"
              :on-change="uploadChange"
              :on-remove="fileRemove"
            >
              <el-button type="">
                <i class="iconfont icon-shangchuan" style="margin-right: 5px"></i>
                上传文件
              </el-button>
              <template #tip>
                <p>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p>
              </template>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handScoreSave">保存</el-button>
          </el-form-item>
          <!-- <el-form-item label="得分: ">
          <el-input v-model="Data.form.score" style="width: 245px" />
        </el-form-item>
        <el-form-item label="附件: ">
          <el-upload
            v-model="Data.uploadFileList"
            multiple
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="3"
            :on-exceed="handleExceed"
          >
            <el-button type="">
              <i class="iconfont icon-shangchuan" style="margin-right: 5px"></i>
              上传文件
            </el-button>
            <template #tip>
              <p>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</p>
            </template>
          </el-upload>
        </el-form-item> -->
        </el-form>
      </div>
    </div>
    <!-- 项目详情 -->
    <el-drawer v-model="Data.projectVisable" class="drawerSelf" size="60vw">
      <template #header>
        <h4>项目详情</h4>
      </template>
      <template #default>
        <projectDetail></projectDetail>
      </template>
      <template #footer>
        <div style="flex: auto">
          <!-- <el-button @click="Data.projectVisable = false">取消</el-button> -->
          <el-button type="primary" @click="hanldeConfirm">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import projectDetail from './projectDetail.vue';
import { useCommonHandler } from '@/hooks';
import _ from 'lodash';
const route = useRoute();
const Data = reactive({
  /**分数参数 */
  currentScore: '', // 当前得分
  currentIndex: '', // 点击卡片索引
  // 卡片数据
  cardList: [],
  // 卡片内容
  contentList: [
    { key: 'pointName', content: '', title: '评价维度：' },
    { key: 'methodStr', content: '', title: '评价方式：' },
    { key: 'baseScore', content: '', title: '基础分值：' },
    { key: 'userListStr', content: '', title: '评价人：' },
    { key: 'scoreStr', content: '', title: '分值区间：' },
    { key: 'pmSelfDesc', content: '', title: '项目经理自评：' },
    { key: 'pointDesc', stand: [], title: '评价标准：' },
  ],
  // 已评价列表
  columns: [
    {
      title: '时间',
      dataIndex: 'time',
    },
    {
      title: '评价人',
      dataIndex: 'evalUser',
    },
    {
      title: '评价说明',
      dataIndex: 'evalDesc',
    },
    {
      title: '得分',
      dataIndex: 'evalScore',
    },
    {
      title: '附件',
      dataIndex: 'attachment',
    },
  ],
  tableData: [],
  // 项目打分表单
  cardVisible: false,
  form: {
    // userComment: '',
    // resultScore: '',
  },
  // 项目详情抽屉
  projectVisable: false,
  // 上传文件
  uploadFileList: [],
  /**用户 */
  userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),
});
const props = defineProps({
  workItemOid: {
    type: String,
    default: '',
  },
  phaseData: {
    type: Array,
    default: () => [],
  },
  scoreResultData: {
    type: Array,
    default: () => [],
  },
  scoreFileData: {
    type: Array,
    default: () => [],
  },
});
const api = window.$api;
const isCompleted = ref(route.query.isCompleted);

watch(
  () => props.phaseData,
  () => {
    if (props.phaseData.length > 0) {
      props.phaseData.forEach((e) => {
        if (e.pointOrder <= 3) {
          e.isEdit = true;
        } else {
          e.isEdit = false;
        }
      });
      Data.cardList = props.phaseData.map((e) => {
        e.pointDesc = e.pointDesc.split('\n');
        // e.userListStr = e.userListStr.split('\n').join('、');
        // e.userListStr = e.userListStr.split(',');
        e.inCompleteUser = (e.inCompleteUser.length > 0 && e.inCompleteUser.split(',')) || []; // 未打分
        e.completeUser = (e.completeUser.length > 0 && e.completeUser.split(',')) || []; // 已打分

        /**
         * ----------------判断打分权限-----------------------
         * --条件
         * hasScorePower: 是否有打分权限；isScoreTip： 当前用户显示请打分和已打分条件
         * ---逻辑
         * 1. 当未打分人为空的时候，此时显示“已打分”；不用考虑其他情况；
         *    1）则此时数据中打分权限hasScorePower：false；
         *    2）数据中是否显示右上角Tips的参数isScoreTip：true
         * 2. 当未打分人有值时，则只需要考虑当前用户是否在未打分人第一个
         *    1）如果在第一个：则此时hasScorePower：true；
         *    2) 如果不在第一个：则此时hasScorePower：false；
         *   其中isScoreTip在此条件下，根据hasScorePower的值确定；
         */
        if (e.inCompleteUser.length === 0) {
          e.hasScorePower = false;
          e.isScoreTip = false;
        } else {
          let hasScorePower = e.inCompleteUser.length > 0 && e.inCompleteUser[0].includes(Data.userInfo.username);
          e.hasScorePower = hasScorePower;
          e.isScoreTip = hasScorePower;
          if (hasScorePower) e.markIdentify = '请打分';
        }

        return e;
      });
      console.log(Data.cardList, 259);
    }
  },
);

onMounted(() => {
  getCurrentScoreFun();
});
/**获取当前得分 */
const getCurrentScoreFun = () => {
  api.projectEvaluateApi.getCurrentScore({ oid: props.workItemOid }).then((res) => {
    if (res.success) {
      Data.currentScore = res.data;
    } else {
      window.$message.error(res.message);
    }
  });
};

const pointIdStr = ref('');
/**获取未打分的数据--表单数据 */
const formData = ref([]);
const getFormInputData = async () => {
  let userStr = Data.cardList[Data.currentIndex - 1].inCompleteUser[0];
  await api.projectEvaluateApi.getEvaluationGradeInput({ pointId: pointIdStr.value, evaluationUser: userStr }).then((res) => {
    if (res.success) {
      formData.value = res.data;
    } else {
      window.$message.error(res.message);
    }
  });
};
/**获取已打分数据 */
const getRatedFun = async () => {
  await api.projectEvaluateApi.getEvaluationGradeInfo({ pointId: pointIdStr.value }).then((res) => {
    if (res.success) {
      Data.tableData = res.data;
    } else {
      window.$message.error(res.message);
    }
  });
};

/**点击卡片 */
const scorePlaceholder = ref('');
const handScoreVisible = ref(true);
const handleCurrent = async (item) => {
  if (Data.currentIndex === item.pointOrder) {
    Data.currentIndex = '';
    return;
  } else {
    Data.currentIndex = item.pointOrder;
  }

  // if (item.hasScorePower) Data.cardVisible = true;
  Data.cardVisible = true;

  // 处理入参
  let arr = item.pointOid.split(':');
  pointIdStr.value = arr[arr.length - 1];

  // 判断打分处理模块
  scorePlaceholder.value = item.scoreStr;
  handScoreVisible.value = item.isScoreTip;
  formData.value = [];
  Data.form = {};
  Data.uploadFileList = [];

  // 切换走如果写了分数，就要标注已经打分
  if (scoreFormData.value.length > 0) {
    Data.cardList.forEach((e) => {
      if (scoreFormData.value.some((v) => e.pointOrder === v.index)) e.markIdentify = '已打分';
    });
  }

  // 切换时需要把表单数据回显
  if (scoreFormData.value.length > 0) {
    let isWrite = scoreFormData.value.some((v) => v.index === item.pointOrder);
    if (isWrite) {
      let ix = scoreFormData.value.findIndex((v) => v.index === item.pointOrder);
      let obj = scoreFormData.value[ix];
      obj.resultScore = obj.writeScore || '';
      Data.form = obj;
    }
  }

  // 附件回显
  if (item.handFileList) {
    Data.uploadFileList = item.handFileList;
  }

  // 方法执行
  getDetailInfo(item);
  await getRatedFun();
  // 接口调用
  item.hasScorePower && (await getFormInputData());

  if (Data.tableData.length > 0 && item.hasScorePower) {
    Data.form.resultScore = Data.tableData[0].evalScore;
    let data = formData.value.filter((e) => e.name === 'resultScore');
    inputChange(Data.form.resultScore, data[0]);
  }
  Data.cardVisible = false;
  // Data.tableData.length > 0 && Data.form.resultScore = Data.tableData[0].evalScore;
};

/**卡片详细信息 */
const getDetailInfo = (data) => {
  Data.contentList.forEach((v) => {
    if (v.key === 'pointDesc') {
      v.stand = data[v.key];
    } else {
      v.content = data[v.key];
    }
  });
  console.log(Data.contentList, 412);
};

/**表单操作 */
const scoreFormData = ref([]);
const inputChange = (value, data) => {
  // 判断输入值是否在区间内
  let getScore = '';
  if (data.name === 'resultScore') {
    let scoreRange = JSON.parse(scorePlaceholder.value);
    if ((Number(value) < scoreRange[0] || Number(value) > scoreRange[1]) && value) {
      window.$message.warning('请输入区间内的值！');
      Data.form[data.name] = '';
    }
    getScore = (value && Number(value) - Number(Data.cardList[Data.currentIndex - 1].baseScore)) || '';
  }
  // 入参处理
  handScoreData(data, getScore);

  emit('update:scoreResultData', scoreFormData.value);
  emit('update:scoreFileData', Data.cardList);
};

/**表单保存 */
// const saveListData = ref([]);
const handScoreSave = () => {
  console.log(Data.cardList, 439);
  console.log(scoreFormData.value, 440);
  let scoreData = _.cloneDeep(scoreFormData.value);
  let cardData = _.cloneDeep(Data.cardList);

  let params = new FormData();
  let fileArr = [];
  scoreData.forEach((e) => {
    cardData.forEach((v) => {
      if (e.index === v.pointOrder) {
        // 文件入参
        if (v.handFileList && v.handFileList.length > 0) {
          fileArr = v.handFileList.map((m) => {
            params.append(m.uid + '&&&' + m.name, m.raw);
            return m.uid + '&&&' + m.name;
          });
        }
        // 赋值
        e.fileName = fileArr;
        // 分值相减--传入入参
        e.resultScore = (Number(e.resultScore) - Number(v.baseScore)).toString();
      }
    });
  });

  params.append('evaluationResultParams', JSON.stringify(scoreData));
  api.projectEvaluateApi.saveEvaluationGrade(params).then((res) => {
    if (res.success) {
      console.log(res);
    } else {
      window.$message.error(res.message);
    }
  });
};

/**入参处理 */
const handScoreData = (data, getScore) => {
  let obj = {};
  obj.evaluationUser = Data.userInfo.username;
  obj.resultOid = data.resultOid;
  // obj.resultScore = getScore.toString();
  obj.resultScore = Data.form.resultScore.toString();
  obj.userComment = Data.form.userComment;
  obj.index = Data.currentIndex;
  obj.writeScore = Data.form.resultScore.toString();
  if (scoreFormData.value.length > 0) {
    let index = scoreFormData.value.findIndex((v) => v.resultOid === data.resultOid);
    if (index === -1) {
      scoreFormData.value.push(obj);
    } else {
      scoreFormData.value.splice(index, 1, obj);
    }
  } else {
    scoreFormData.value.push(obj);
  }
};

/**文件操作 */
const uploadChange = (uploadFile, fileData) => {
  Data.uploadFileList = fileData;
  addFileData(Data.uploadFileList);
};
const fileRemove = (UploadFile, data) => {
  Data.uploadFileList = data;
  addFileData(Data.uploadFileList);
};

const addFileData = (data) => {
  Data.cardList[Data.currentIndex - 1]['handFileList'] = data;
  emit('update:scoreFileData', Data.cardList);
};

// 项目详情
const handeProjectDetail = () => {
  Data.projectVisable = true;
};
// 确定
const hanldeConfirm = () => {
  Data.projectVisable = false;
};
// 下载
const handleExport = (item) => {
  api.fileApi.downloadContent({ oid: item.fileOid }).then((res) => {
    useCommonHandler.download(res, item.fileName);
  });
};

// 提交校验
const checkParameters = (checkData) => {
  let isPass = true;
  let isScrollTask = Data.cardList.some((v) => v.hasScorePower);
  if (checkData.length === 0 && isScrollTask) {
    window.$message.warning('请点击打分模块，输入打分值！');
    isPass = false;
  } else if (checkData.length > 0) {
    let isScrollTaskArr = Data.cardList.filter((v) => v.hasScorePower);
    if (checkData.length < isScrollTaskArr.length) {
      window.$message.warning('请完成所有打分模块！');
      isPass = false;
    } else if (checkData.length === isScrollTaskArr.length) {
      let isInput = checkData.some((v) => !v.resultScore.toString());
      if (isInput) {
        window.$message.warning('请输入得分！');
        isPass = false;
      }
    }
  }
  return isPass;
};

/**
 * emit输出
 */
const emit = defineEmits(['update:scoreResultData', 'update:scoreFileData']);
defineExpose({
  checkParameters,
});
</script>

<style lang="less" scoped>
.phase {
  margin-top: 15px;
  .phase_box {
    .left_box {
      text-align: center;
      .outer {
        // width: 154px;
        // height: 154px;
        width: 10vw;
        height: 10vw;
        display: inline-block;
        background: #ffffff;
        border: 1px solid #c2d2f3;
        border-radius: 50%;
        .inside {
          // width: 140px;
          // height: 140px;
          width: calc(10vw - 14px);
          height: calc(10vw - 14px);
          background: #ffffff;
          border: 1px solid #c2d2f3;
          border-radius: 50%;
          margin: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .grade {
            // font-size: 50px;
            font-size: 3vw;
            font-family: zcoolqingkehuangyouti, zcoolqingkehuangyouti;
            font-weight: 400;
            color: #386bd7;
            line-height: 50px;
          }
          .grade-text {
            font-size: 14px;
            font-family: 'PingFangSC, PingFang SC';
            font-weight: 400;
            color: #666666;
          }
        }
      }
    }

    .card {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      .card_item {
        // width: 200px;
        width: 10.5vw;
        // height: 250px;
        height: 28vh;
        border-radius: 10px;
        text-align: center;
        // padding: 40px 20px;
        padding: 2vw 1vw;
        margin-right: 2vw;
        cursor: pointer;
        position: relative;
        .isTips {
          position: absolute;
          top: 0%;
          right: 0;
          // transform: translate(-50%, 0%);
          border-radius: 0px 10px 0px 10px;
          width: 4vw;
          font-size: 0.8vw;
          font-family: 'PingFangSC, PingFang SC';
          font-weight: 400;
          color: #ffffff;
        }
        .mark-identify {
          background: #3dbd7d;
        }
        .please-identify {
          background: #386bd7;
        }
        .card-title {
          height: 22px;
          // font-size: 14px;
          font-size: 0.8vw;
          font-family: 'PingFangSC, PingFang SC';
          font-weight: bold;
        }
        .card-grade {
          // font-size: 38px;
          font-size: 2vw;
          font-family: 'PingFangSC, PingFang SC';
          font-weight: 500;
          // margin: 20px 0 20px 20px;
          margin: 1vw 0 1vw 1vw;
          .grade-text {
            font-size: 14px;
            font-family: 'PingFangSC, PingFang SC';
            font-weight: 400;
            opacity: 0.9;
          }
        }
        .scored-item {
          margin-bottom: 5px;
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: center;
          img {
            display: inline-block;
          }
          .scored {
            font-size: 0.8vw;
            font-family: 'PingFangSC, PingFang SC';
            font-weight: 400;
            display: inline-block;
            // margin-left: 15px;
            margin-left: 0.6vw;
          }
        }
      }
      .ccurrent-item {
        background-image: url('@/assets/img/card_img.png');
        background-repeat: no-repeat;
        background-position-x: center;
        background-position-y: bottom;
        background-size: 100%;
        color: #ffffff;
        background-color: #386bd7;
        .isTips {
          opacity: 0;
        }
      }
      .other-item {
        color: #333333;
        background: #f0f5ff;
        .isTips {
          opacity: 1;
        }
        .card-grade {
          color: #386bd7;
          .grade-text {
            color: #333333;
          }
        }
      }
    }
    .details {
      margin-bottom: 10px;
      font-size: 14px;
      font-family: 'PingFangSC, PingFang SC';
      font-weight: 400;
      .details-left {
        color: #666666;
      }
      .details-right {
        color: #333333;
        white-space: pre-wrap;
      }
    }
  }
  .phase_table {
    margin: 20px 0;
    .file-number {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: inline-block;
      background: #386bd7;
      color: #fff;
      text-align: center;
      margin-left: 10px;
      line-height: 16px;
    }
  }
  .project_detail {
    .form_style {
      // min-height: 200px;
      :deep(.el-form) {
        .el-form-item {
          .el-form-item__content .el-input-number .el-input__inner {
            text-align: left;
          }

          &:nth-last-child(2) {
            margin-bottom: 0;
          }
          &:nth-last-child(1) {
            margin-left: 10px;
            // width: 3vw;
            .el-form-item__content {
              .el-button {
                width: 4vw;
              }
            }
          }
        }
      }
    }
  }
}
:deep(.el-dropdown) {
  cursor: pointer;
  color: #386bd7;
  display: flex;
  align-items: center;
}
:deep(.el-textarea__inner) {
  height: 96px;
}
:deep(.el-form) {
  margin-top: 15px;
  // margin-left: -45px;
}
:deep(.el-form-item__label) {
  margin-right: 10px;
}
</style>

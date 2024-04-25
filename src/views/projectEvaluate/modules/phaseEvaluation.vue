<template>
  <div class="phase" v-loading="Data.cardVisible">
    <div class="phase_box">
      <el-row :gutter="20" style="margin-bottom: 30px">
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
                v-if="!isCompleted && item.isEdit && templateName === 'EvaluationGradeProcess'"
                :class="item.markIdentify === '已打分' ? 'mark-identify' : 'please-identify'"
              >
                {{ item.markIdentify }}
              </p>
              <p class="card-title" :title="item.pointName">{{ item.pointName }}</p>
              <p class="card-grade">
                {{ getCardScore(item) }}
                <span class="grade-text">分</span>
              </p>
              <p class="scored-item">
                <img src="@/assets/img/alreadyScored.png" alt="" />
                <span class="scored">{{ item.completeStatue }}</span>
              </p>
              <p class="scored-item">
                <img src="@/assets/img/unscored.png" alt="" />
                <span class="scored">{{ item.inCompleteStatue }}</span>
              </p>
              <p class="score_interval">分值区间：{{ item.scoreStr }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div class="detail_box" v-if="Data.currentIndex">
            <el-row :gutter="20">
              <el-col :span="3"></el-col>
              <el-col :span="8" v-if="!isCompleted && Data.currentIndex && handScoreVisible">
                <div class="project_detail">
                  <div class="form_style">
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
                    </el-form>
                  </div>
                </div>
              </el-col>
              <el-col :span="!isCompleted && Data.currentIndex && handScoreVisible ? 13 : 20">
                <el-row :gutter="20">
                  <el-col :span="24" class="details" v-for="(itm, idx) in Data.contentList" :key="idx">
                    <el-row :gutter="20">
                      <el-col :md="6" :lg="6" :xl="4">
                        <span v-show-tip class="details-left">{{ itm.title }}</span>
                      </el-col>
                      <el-col :md="18" :lg="18" :xl="20">
                        <span class="details_right" v-show-tip v-if="itm.key !== 'pointDesc'">
                          <el-tooltip :content="itm.content" placement="top-start">
                            <span>{{ itm.content }}</span>
                          </el-tooltip>
                        </span>
                        <ul v-else style="list-style-type: none; padding: 0; margin: 0">
                          <li class="base-item" v-for="(stand, sindex) in itm.content" :key="sindex">{{ stand ? stand : '-' }}</li>
                        </ul>
                      </el-col>
                    </el-row>
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
  </div>
</template>

<script setup>
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
    // { key: 'pointName', content: '', title: '评价维度：' },
    // { key: 'methodStr', content: '', title: '评价方式：' },
    { key: 'baseScore', content: '', title: '基础分值：', label: '基础分值：' },
    { key: 'userListStr', content: '', title: '评价人：', label: '评价人：' },
    // { key: 'scoreStr', content: '', title: '分值区间：' },
    { key: 'pmSelfDesc', content: '', title: '项目阶段完成情况：', label: '项目阶段完成情况：' },
    { key: 'pointDesc', content: [], title: '评价标准：', label: '评价标准：' },
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
  isUpdate: {
    type: Boolean,
    default: false,
  },
});
const api = window.$api;
const isCompleted = ref(route.query.isCompleted);

const templateName = ref(route.query.templateName);

const initCardGetInput = ref([]);
watch(
  () => props.phaseData,
  () => {
    if (props.phaseData.length > 0) {
      Data.cardList = props.phaseData.map((e) => {
        e.pointDesc = e.pointDesc.split('\n');
        e.checkUserList = e.userListStr.split(',');
        e.completeUser = e.completeUser.split(',');
        e.inCompleteUser = e.inCompleteUser.split(',');

        if (e.isEdit) {
          if (e.inCompleteUser.length > 0 && e.inCompleteUser[0].includes(Data.userInfo.username)) {
            e.markIdentify = '请打分';
          } else {
            e.markIdentify = '已打分';
            /**页面进入调用input接口方法，以防止点击保存后，再次进入直接点击提交 */
            initCardGetInput.value.push(e);
          }
        }
        return e;
      });
      /**获取总分 */
      getCurrentScoreFun();

      /**默认选中 */
      templateName.value === 'EvaluationGradeProcess' && handleCurrent(Data.cardList.filter((v) => v.isEdit)[0]);
      /**点击保存的时候不执行 */
      !props.isUpdate && getInitParmasData();
    }
  },
);

/**初始进入调用接口 */
const getInitParmasData = () => {
  initCardGetInput.value.forEach(async (v) => {
    let arr = v.pointOid.split(':');
    let inputFormArr = await api.projectEvaluateApi.getEvaluationGradeInput({ pointId: arr[arr.length - 1], evaluationUser: v.checkUserList[0] });
    if (inputFormArr.success) {
      let obj = {};
      obj.evaluationUser = Data.userInfo.username;
      obj.resultOid = inputFormArr.data[0].resultOid;
      obj.resultScore = inputFormArr.data.filter((v) => v.name === 'resultScore')[0].value.toString();
      obj.userComment = inputFormArr.data.filter((v) => v.name === 'userComment')[0].value;
      obj.index = v.pointOrder;
      obj.writeScore = obj.resultScore;
      scoreFormData.value.push(obj);
      emit('update:scoreResultData', scoreFormData.value);

      Data.cardList.forEach((el) => {
        if (el.pointOrder === v.pointOrder) {
          let initInputFileArr = inputFormArr.data.filter((k) => k.filedType == 'FILE')[0].value;
          el.handFileList = initInputFileArr.map((n) => {
            n.name = n.fileName;
            n.url = '';
            return n;
          });
        }
      });
      emit('update:scoreFileData', Data.cardList);
    }
  });
};

/**各个维度分数 */
const getCardScore = (item) => {
  return item?.tempScore?.toString() ? item.tempScore : Number(item.score) || 0;
};

onMounted(() => {
  // getCurrentScoreFun();
});
/**获取当前得分 */
const getCurrentScoreFun = () => {
  Data.cardList.forEach((e) => {
    e.calcScore = e?.tempScore && e?.tempScore.toString() ? e?.tempScore : Number(e.score) || 0;
  });
  Data.currentScore = Data.cardList.reduce((prev, cur) => {
    return Number(prev) + Number(cur?.calcScore);
  }, 0);

  // let arr = Data.cardList.filter((v) => v.saveScoreObj && v.saveScoreObj?.name?.includes(Data.userInfo.username));
  // if (arr.length > 0) {
  //   Data.currentScore = arr.reduce((prev, cur) => {
  //     if (cur?.saveScoreObj) {
  //       return Number(prev) + Number(cur?.saveScoreObj.saveScore);
  //     }
  //   }, 0);
  // } else {
  //   api.projectEvaluateApi.getCurrentScore({ oid: props.workItemOid }).then((res) => {
  //     if (res.success) {
  //       Data.currentScore = res.data;
  //     } else {
  //       window.$message.error(res.message);
  //     }
  //   });
  // }
};

const pointIdStr = ref('');
/**获取未打分的数据--表单数据 */
const formData = ref([]);
const saveFile = ref([]); // 保存的时候拿到的文件数据
const getFormInputData = async () => {
  let userStr = Data.cardList[Data.currentIndex - 1].inCompleteUser[0];
  // let isSaveStatus = Data.cardList[Data.currentIndex - 1].isEdit && Data.cardList[Data.currentIndex - 1].saveFlag; // 代表是保存，并且当前用户有权限编辑
  await api.projectEvaluateApi.getEvaluationGradeInput({ pointId: pointIdStr.value, evaluationUser: userStr }).then((res) => {
    if (res.success) {
      saveFile.value = []
      res.data.forEach((e) => {
        if (e.filedType !== 'FILE') {
          Data.form[e.name] = e.name === 'resultScore' ? (e.value.toString() ? Number(e.value) : null) : e.value || '';
        } else {
          if (e.value && e.value.length > 0) {
            saveFile.value = e.value.map((e) => {
              e.name = e.fileName;
              e.url = '';
              return e;
            });
          }
        }
      });

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
  Data.cardVisible = true;

  // 处理入参
  let arr = item.pointOid.split(':');
  pointIdStr.value = arr[arr.length - 1];

  // 判断打分处理模块
  scorePlaceholder.value = item.scoreStr;
  handScoreVisible.value = item.isEdit;

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
      // obj.resultScore = obj.writeScore || null;
      obj.resultScore = obj.writeScore;
      Data.form = obj;
    }
  }

  // 方法执行
  getDetailInfo(item);
  await getRatedFun();
  // 接口调用
  item.isEdit && (await getFormInputData());

  // 附件回显
  if (item.handFileList) {
    Data.uploadFileList = item.handFileList;
  } else if (saveFile.value.length > 0) {
    // 保存附件回显
    Data.uploadFileList = [...Data.uploadFileList, ...saveFile.value];
  }
  Data.cardList[Data.currentIndex - 1]['handFileList'] = Data.uploadFileList;

  // 带出前一个人打分的数据
  if (Data.tableData.length > 0) {
    if (item.isEdit) {
      Data.form.resultScore = item?.tempScore?.toString() ? item.tempScore : Number(Data.tableData[0].evalScore);
      let data = formData.value.filter((e) => e.name === 'resultScore');
      inputChange(Data.form.resultScore, data[0]);
    }
  } else {
    Data.form.resultScore = item?.tempScore?.toString() ? Number(item?.tempScore) : null;
    let data = formData.value.filter((e) => e.name === 'resultScore');
    inputChange(Data.form.resultScore, data[0]);
  }
  Data.cardVisible = false;
};

/**卡片详细信息 */
const getDetailInfo = (data) => {
  Data.contentList.forEach((v) => {
    v.content = data[v.key];
  });
};

/**表单操作 */
const scoreFormData = ref([]);
const inputChange = (value, data) => {
  // if (!(value + '')) return;
  let item = Data.cardList[Data.currentIndex - 1];
  // 判断输入值是否在区间内
  if (data?.name === 'resultScore') {
    let scoreRange = JSON.parse(scorePlaceholder.value);
    if (value || value === 0) {
      if (Number(value) < scoreRange[0] || Number(value) > scoreRange[1]) {
        window.$message.warning('请输入区间内的值！');
        Data.form[data.name] = '';
        item.tempScore = '';
        changeInputCurent();
        return;
      }
    } else {
      // 如果有保存值，那就拿保存的值，如果没有保存的值，那就拿上一个人填写的值
      if (Data.tableData.length > 0) {
        Data.form[data.name] = item?.tempScore ? item.tempScore : Number(Data.tableData[0].evalScore);
        window.$message.warning('请输入打分值');
      } else {
        Data.form[data.name] = item?.tempScore ? item.tempScore : data.value;
        item?.tempScore && window.$message.warning('请输入打分值');
      }
      changeInputCurent();
      return;
    }

    // setTimeout(() => {
    /**改变值后，重新获取各个卡片的值，并且计算总数 */
    Data.cardList.forEach((e) => {
      if (e.pointOrder === Data.currentIndex) {
        e.tempScore = Number(value); // 临时值
        getCardScore(e);
      }
    });
    changeInputCurent();
    // }, 200);
  }

  // 入参处理
  item.isEdit && handScoreData(data);

  emit('update:scoreResultData', scoreFormData.value);
  emit('update:scoreFileData', Data.cardList);
};

// input改变后计算总数
const changeInputCurent = () => {
  Data.cardList.forEach((e) => {
    e.calcScore = e?.tempScore?.toString() ? e.tempScore : e.score.toString() ? Number(e.score) : 0;
  });
  Data.currentScore = Data.cardList.reduce((prev, cur) => {
    return Number(prev) + Number(cur?.calcScore);
  }, 0);
};

/**入参处理 */
const handScoreData = (data) => {
  let obj = {};
  obj.evaluationUser = Data.userInfo.username;
  obj.resultOid = data?.resultOid;
  // obj.resultScore = getScore.toString();
  obj.resultScore = Data.form.resultScore;
  obj.userComment = Data.form.userComment;
  obj.index = Data.currentIndex;
  obj.writeScore = Data.form.resultScore;
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

/**表单保存 */
const handScoreSave = () => {
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
            if (!m?.fileOid) {
              params.append(m.uid + '&&&' + m.name, m.raw);
              return m.uid + '&&&' + m.name;
            }
          });
        }
        /**用户 */
        e.evaluationUser = v.checkUserList.filter((v) => v.includes(e.evaluationUser))[0];
        // 赋值
        e.fileName = fileArr.filter((e) => e);
        // 分值相减--传入入参
        e.resultScore = (Number(e.resultScore) - Number(v.baseScore)).toString();
        // 保存的文件
        let newArr = v.handFileList.filter((e) => e.fileOid);
        e.hasUploadFile = newArr.length > 0 ? newArr.map((v) => v.fileOid) : [];
        e.saveFlag = '0';
      }
    });
  });

  params.append('evaluationResultParams', JSON.stringify(scoreData));
  Data.cardVisible = true;
  api.projectEvaluateApi.saveEvaluationGrade(params).then((res) => {
    if (res.success) {
      window.$message.success(res.data);
      // emit('saveFun', true);
      // getCurrentScoreFun();
    } else {
      window.$message.error(res.message);
    }
    Data.cardVisible = false;
  });
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
  let isScrollTask = Data.cardList.filter((v) => v.isEdit);

  if (checkData.length < isScrollTask.length && isScrollTask.length > 0) {
    window.$message.warning('请点击打分模块，输入打分值！');
    isPass = false;
  } else if (checkData.length === isScrollTask.length && isScrollTask.length > 0) {
    let isScrollTaskArr = Data.cardList.filter((v) => v.isEdit);
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
const emit = defineEmits(['update:scoreResultData', 'update:scoreFileData', 'saveFun']);
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
      display: flex;
      align-items: center;
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
      // margin-bottom: 30px;
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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .card-grade {
          // font-size: 38px;
          font-size: 2vw;
          font-family: 'PingFangSC, PingFang SC';
          font-weight: 500;
          // margin: 20px 0 20px 20px;
          margin: 1vw 0 1vw 1vw;
          margin: 0 0 0 1vw;
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
        .score_interval {
          font-size: 0.8vw;
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
      .details_right {
        color: #333333;
        // white-space: pre-wrap;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
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
  // margin-top: 15px;
  // margin-left: -45px;
}
:deep(.el-form-item__label) {
  // margin-right: 10px;
  justify-content: flex-start;
}
</style>

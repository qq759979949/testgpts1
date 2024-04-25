<template>
  <div class="main-box">
    <div class="content_container">
      <div class="left_content">
        <section class="section-container">
          <my-app :oid="oid" @initData="initData"></my-app>
        </section>
        <section class="section-container" v-if="projectType === '产品开发类项目' || projectType === '制造技术类项目' || projectType === '信息技术类项目'" v-loading="loading">
          <div class="section-title">项目导航</div>
          <steps :stepList="stepList" :active="active"></steps>
        </section>
        <section class="section-container" v-loading="formLoading">
          <FormDetail ref="form" labelWidth="200px" :formList="formList" v-model:submitData="submitData"></FormDetail>
          <!-- <objectInfo :detailLayout="item.items" :column="3" :infoTitle="item.groupName" v-for="(item, index) in infoDatas" :key="index"></objectInfo> -->
        </section>
        <!-- <section class="section-container">
          <div class="title">
            项目看板
          </div>
          <div class="board-box">
            <div class="board-item divider-right">
              <div class="data">
                <span class="large">23</span>
                <span class="small"> %</span>
              </div>
              <div class="text">项目进度完成率</div>
              <el-progress
              style="width: 110px;"
              color="#75D06C"
              :show-text="false"
              :percentage="23">
              </el-progress>
            </div>
            <div class="board-item divider-right">
              <div class="data">
                <span class="large">{{ problemSolved }}</span>
                <span class="small grey"> / {{ problemTotal }}</span>
              </div>
              <div class="text">已解决/问题总数</div>
              <el-progress
              style="width: 110px;"
              color="#75D06C"
              :show-text="false"
              :percentage="problemRate">
              </el-progress>
            </div>
            <div class="board-item">
              <div class="data">
                <span class="large">{{ riskSolved }}</span>
                <span class="small grey"> / {{ riskTotal }}</span>
              </div>
              <div class="text">已解决/风险总数</div>
              <el-progress
              style="width: 110px;"
              color="#75D06C"
              :show-text="false"
              :percentage="riskRate">
              </el-progress>
            </div>
          </div>
        </section> -->
        <!-- <section class="section-container">
          <div class="title">
            项目附件
          </div>
          <div class="title">
            <el-button type="primary" @click="downLoad">下载选定的文件</el-button>
            <el-button @click="addFile">添加</el-button>
            <el-button @click="editFile">编辑</el-button>
            <el-button @click="removeFile">移除附件</el-button>
          </div>
          <div class="board-box">
            <PiTable
                :columns="colunms"
                :data="tableData"
                :selectable="true"
                @selectionChange="selectionChange"
                :isShowSetting="false"
                rowKey="oid"
                :pagination="true"
              >
            </PiTable>
          </div>
        </section> -->
        <section class="section-container" v-if="projectType === '产品开发类项目'">
          <div class="section-title">关联订货号</div>
          <el-button type="primary" @click="addOrder" v-permission="'/plmProject/AO'">添加</el-button>
          <div class="section-main">
            <span class="row-label">订货号：</span>
            <div class="row-content">
              <el-scrollbar>
                <el-tag v-for="tag in orderList" :key="tag" class="tag-item" closable @close="deleteOrder(tag, tag.split(':')[1])">
                  {{ tag }}
                </el-tag>
              </el-scrollbar>
            </div>
          </div>
        </section>
        <!-- <UploadDialog 
          :title="$intl('fileUpload').d('附件上传')"
          v-model:isShow="isShowUpload"
          @submit="uploadSubmit" >
          <template #topContent>
            <el-form :model="uploadParam" label-width="85px">
              <el-form-item :label="$intl('fileDescription').d('附件说明') + '：'">
                <el-input v-model="uploadParam.fileDescription"></el-input>
              </el-form-item>
            </el-form>
          </template>
        </UploadDialog> -->
      </div>
      <div class="dividerY"></div>
      <div class="right_content">
        <div class="sysInlet1 sysInlet2">
          <sysInlet></sysInlet>
        </div>
        <div class="divider" v-if="projectType === '产品开发类项目' || projectType === '制造技术类项目' || projectType === '信息技术类项目'"></div>
        <div class="sysInlet1" v-if="projectType === '产品开发类项目' || projectType === '制造技术类项目' || projectType === '信息技术类项目'">
          <div class="title">项目看板</div>
          <!-- <deliverables-summary> -->
          <div class="displayLabel">
            项目等级：
            <div class="displayVal">{{ projectBoard.projectLevel }}</div>
          </div>
          <div class="displayLabel">
            薪酬包金额：
            <div class="displayVal">{{ projectBoard.amount }}</div>
          </div>
          <!-- </deliverables-summary> -->
          <!-- <el-progress :text-inside="true" :stroke-width="25" :percentage="50" /> -->
          <div class="payPackage">
            <div v-for="(item, index) in projectBoard.phaseInfo" :key="index">
              <div class="displayLabel">
                {{ item.name }}
                <div class="displayVal">
                  {{ item.phaseScore ? item.phaseScore : '-' }} 分
                  <span class="icon" v-if="item.isGrant === '已发放'">
                    <el-tooltip class="box-item" effect="dark" content="已发放" placement="top-start">
                      <el-icon><SuccessFilled /></el-icon>
                    </el-tooltip>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="isAddOrderDialog" width="60%" title="添加订单号">
      <addOrderTable :update="isAddOrderDialog" @select="changeOrderSelect" ref="addOrderNoTable"></addOrderTable>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelAddOrder">取消</el-button>
          <el-button type="primary" @click="confirmAddOrder" :loading="isLoading">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, getCurrentInstance, onMounted } from 'vue';
import myApp from '@/components/myApp/myApp.vue';
import addOrderTable from './comp/addOrderTable.vue';
import steps from '@/components/steps/steps.vue';
// import objectInfo from '@/components/objectInfo/objectInfo.vue';
import FormDetail from '@/components/formLayout/formDetail.vue';
import { getProjectInfoLayout, getProjectMileStonePlan, queryProductOrders, addProductOrders, removeProductOrders } from '@/api/project';
// import { getInfoLayout } from '@/api/common'
import sysInlet from '@/views/homePage/components/sysInlet.vue';
import Cookies from 'js-cookie';
export default defineComponent({
  components: { myApp, sysInlet, addOrderTable, steps, FormDetail },
  setup() {
    const api = window.$api;
    const { proxy: that } = getCurrentInstance();
    const userInfo = JSON.parse(Cookies.get('userInfo'));
    const route = useRoute();
    const router = useRouter();
    const detail = reactive({
      // 项目信息
      // projectInfo: {},
      detailLayout: [],
      infoDatas: [],
      packList: [
        {
          label: '阶段一',
          value: '90分',
        },
        {
          label: '阶段二',
          value: '100分',
        },
        {
          label: '阶段三',
          value: '-分',
        },
      ],
      formList: [],
      submitData: {},
      // 项目看板
      problemTotal: 0,
      problemSolved: 0,
      riskTotal: 0,
      riskSolved: 0,
      // 项目附件
      colunms: [
        {
          title: '标签或文件名',
          dataIndex: 'fileName',
        },
        {
          title: '格式',
          dataIndex: 'fileFormat',
        },
        {
          title: '附件说明',
          dataIndex: 'fileDescription',
        },
        {
          title: '上次修改时间',
          dataIndex: 'lastModified',
        },
        {
          title: '修改者',
          dataIndex: 'modifier',
        },
      ],
      tableData: [],
      selectFileArr: [],
      isShowUpload: false,
      uploadParam: {},
      orderList: [], // 订货号
      isAddOrderDialog: false,
      projectType: JSON.parse(sessionStorage.getItem('currentProject')).type,
      oid: JSON.parse(sessionStorage.getItem('currentProject')).oid,
      stepList: [],
      active: 3,
      selectArr: [],
      projectBoard: {
        projectLevel: '',
        amount: '',
        phaseInfo: [],
      },
      loading: false,
      isLoading: false,
      formLoading: false,
      isFirst: true,
    });

    // 刷新
    const initData = () => {
      getInfoData();
    };

    // const problemRate = computed(() => {
    //   if (detail.problemTotal === 0) {
    //     return 100
    //   } else {
    //     return detail.problemSolved * 100 / detail.problemTotal
    //   }
    // })

    // const riskRate = computed(() => {
    //   if (detail.riskTotal === 0) {
    //     return 100
    //   } else {
    //     return detail.riskSolved * 100 / detail.riskTotal
    //   }
    // })

    const initFun = () => {
      // 风险
      // getRiskCount({oid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid}).then(res => {
      //   if (res.success) {
      //     detail.riskTotal = res.data[0].totalRisk
      //     detail.riskSolved = res.data[0].solvedRisk
      //   }
      // })
      // // 问题
      // getIssueCount({oid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid}).then(res => {
      //   if (res.success) {
      //     detail.problemTotal = res.data[0].totalIssue
      //     detail.problemSolved = res.data[0].solvedIssue
      //   }
      // })
      if (detail.projectType === '产品开发类项目' || detail.projectType === '信息技术类项目' || detail.projectType === '制造技术类项目') {
        detail.loading = true;
        getProjectMileStonePlan({ oid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid }).then((res) => {
          if (res.success) {
            // const newArr = res.data.filter((item) => {
            //   return item.actEndValue;
            // });
            // detail.active = newArr.length;
            let num = 0;
            res.data.forEach((item, index) => {
              if (item.actEndValue) {
                num = index + 1;
              }
            });
            detail.active = num;
            detail.stepList = res.data.map((item, index) => {
              if (index === detail.active) {
                item.status = '进行中';
              } else if (index < detail.active) {
                item.status = '已完成';
              } else if (index > detail.active) {
                item.status = '未开始';
              }
              item.number = index + 1;
              return item;
            });
            detail.loading = false;
          } else {
            detail.loading = false;
            that.$message.error(res.message);
          }
        });
        getBoardInfo();
      }
      if (detail.projectType === '产品开发类项目') {
        getOlderNo();
      }
      // detail.loading = false;
      getInfoData();
    };
    // 获取详细信息
    const getInfoData = () => {
      detail.formLoading = true;
      let obj = {
        serviceKey: 'com.pisx.pmgt.project.PIProject',
        oid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
      };
      getProjectInfoLayout(obj).then((res) => {
        if (res.success) {
          let datas = res.data.map((item) => {
            item.items = item.items.map((i) => {
              i.label = i.label + '：';
              i.value = i.displayValue;
              i.filedType = 'DISPLAY';
              i.required = false;
              if (i.name === 'state.state') {
                sessionStorage.setItem('projectState', i.displayValue ? getCharactersBetween(i.displayValue, '<b>', '</b>') : '');
              }
              if (i.name === 'ObjectivesAndDeliverables') {
                i.displayValue = i.displayValue.map((it, index) => {
                  it.number = index + 1;
                  return it;
                });
              }
              return i;
            });
            return item;
          });
          // let datas = res.data;
          datas.forEach((v) => {
            v.items.forEach((e) => {
              detail.submitData[e.name] = '';
            });
          });
          detail.formList = that.$formatData(datas, detail.submitData);
          detail.formList.forEach((item) => {
            item.list = item.list.map((el) => {
              el.maxSpan = el.length;
              return el;
            });
          });
          // detail.formList = that.$formatData(datas, detail.submitData)
          // detail.detailLayout = datas[0].items.map(v => {
          //   v.label = v.label + "："
          //   v.value = v.displayValue
          //   return v
          // })
          detail.formLoading = false;
        } else {
          detail.formList = [];
          detail.formLoading = false;
          that.$message.error(res.message);
        }
      });
    };
    // 截取状态
    const getCharactersBetween = (str, startChar, endChar) => {
      const startIndex = str.indexOf(startChar) + startChar.length;
      const endIndex = str.indexOf(endChar, startIndex);
      return str.substring(startIndex, endIndex);
    };

    // 根据项目oid获取订单号
    const getOlderNo = () => {
      // detail.loading = true;
      queryProductOrders({ projectOid: detail.oid }).then((res) => {
        if (res.success) {
          // detail.loading = false;
          if (res.data) {
            detail.orderList = res.data.split(',');
          } else {
            detail.orderList = '';
          }
        } else {
          that.$message.error(res.message);
        }
      });
    };
    // 获取项目看板
    const getBoardInfo = () => {
      window.$api.projectApi.queryProjectKanBanInfo({ oid: detail.oid }).then((res) => {
        if (res.success) {
          detail.projectBoard = res.data;
        } else {
          window.$message.error(res.message);
        }
      });
    };
    onMounted(async () => {
      await window.$commonApisFun._getRoleNamesByUserName(JSON.parse(sessionStorage.getItem('currentProject'))?.oid, userInfo.username);
      await window.$commonApisFun._getPermissionByProjectldAndUserName(JSON.parse(sessionStorage.getItem('currentProject'))?.oid, userInfo.username);
      await window.$commonApisFun._getGroupNamesByUserName(userInfo.username);
      initFun();
    });
    // const selectionChange = (rowKey, row) => {
    //   this.selectFileArr = row
    // }
    // const downLoad = () => {
    //   if(this.selectFileArr.length === 0) return this.$message.warning('请选择数据')
    // }
    // const addFile = () => {
    //   this.isShowUpload = true
    // }
    // const uploadSubmit = (file) => {
    //   console.log(file, this.uploadParam)
    // }
    // const editFile = () => {
    //   if(this.selectFileArr.length === 0) return this.$message.warning('请选择数据')
    // }
    // const removeFile = () => {
    //   if(this.selectFileArr.length === 0) return this.$message.warning('请选择数据')
    // }

    const deleteOrder = (id, dealId) => {
      // const index = detail.orderList.findIndex((item) => item.id === id);
      // detail.orderList.splice(index, 1);
      // console.log(index, detail.orderList)
      window.$ElMessageBox
        .confirm(`请确认是否移除订货号`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => {
          const newData = detail.orderList.filter((item) => item !== id);
          const newD = newData.map((item) => {
            item = item.split(':')[1];
            return item;
          });
          const params = {
            projectOid: detail.oid,
            productOrders: newD.join(','),
            deleteNumber: dealId,
          };
          removeProductOrders(params).then((res) => {
            if (res.success) {
              that.$message.success('移除成功');
              getOlderNo();
              getInfoData();
            } else {
              that.$message.error(res.message);
            }
          });
        })
        .catch(() => {});
    };

    const addOrder = () => {
      detail.isAddOrderDialog = true;
    };

    const confirmAddOrder = () => {
      detail.isLoading = true;
      let productOrders = '';
      if (detail.orderList.length > 0 && detail.selectArr.length > 0) {
        const newArr = [...detail.orderList, ...detail.selectArr];
        productOrders = newArr.join(',');
      } else {
        productOrders = detail.selectArr.join(',');
      }
      const params = {
        projectOid: detail.oid,
        productOrders: productOrders,
        addPartNumbers: detail.selectArr.join(','),
      };
      addProductOrders(params).then((res) => {
        if (res.success) {
          detail.isLoading = false;
          detail.isAddOrderDialog = false;
          getOlderNo();
          getInfoData();
        } else {
          detail.isLoading = false;
          that.$message.error(res.message);
        }
      });
    };

    const cancelAddOrder = () => {
      detail.isAddOrderDialog = false;
    };

    const changeOrderSelect = (arr) => {
      detail.selectArr = arr;
    };

    return {
      ...toRefs(detail),
      // problemRate,
      // riskRate,
      // selectionChange,
      // downLoad,
      // addFile,
      // uploadSubmit,
      // editFile,
      // removeFile,
      deleteOrder,
      addOrder,
      confirmAddOrder,
      cancelAddOrder,
      changeOrderSelect,
      getOlderNo,
      initData,
      getCharactersBetween,
    };
  },
});
</script>

<style lang="less" scoped>
@import '@/assets/commonCss/common.less';
.main-box {
  // padding-bottom: 20px;
  margin: 0 16px;
  background: #fff;
  height: calc(100vh - 116px);
  .content_container {
    display: flex;
    justify-content: flex-start;
    .left_content {
      padding: 10px;
      width: 80%;
      height: calc(100vh - 115px);
      overflow-y: scroll;
    }
    .right_content {
      width: 15%;
    }
  }
  .section-container {
    margin-bottom: 20px;
    .section-title {
      font-size: var(--el-font-size-medium);
      font-weight: 600;
      height: 24px;
      line-height: 24px;
      margin-bottom: 12px;
    }

    .section-main {
      padding-top: 12px;
      .row-label {
        display: inline-block;
        width: 100px;
        vertical-align: top;
      }
      .row-content {
        display: inline-block;
        height: 80px;
        width: 800px;
        border-radius: 4px;
        border: 1px solid #ccc;
        padding: 4px 6px;
        .tag-item {
          margin-right: 6px;
          width: 2;
          margin-bottom: 4px;
        }
      }
    }
  }
  .right-container {
    padding-left: 20px;
    background-color: red;
  }
  .title {
    font-size: var(--el-font-size-medium);
    font-weight: 600;
    height: 24px;
    line-height: 24px;
    margin-bottom: 16px;
    .title-btn {
      margin-left: 6px;
      transform: translateY(-2px);
    }
  }
  .displayLabel {
    display: flex;
    justify-content: flex-start;
    line-height: 32px;
    font-size: #666;
    margin-bottom: 10px;
    .displayVal {
      margin-left: 10px;
      font-size: #333;
    }
  }
  .section-box {
    .app-item {
      display: inline-block;
      margin-right: 40px;
      cursor: pointer;
      .btn-icon {
        width: 72px;
        height: 72px;
        display: inline-block;
        background: #f6f9fe;
        border-radius: 12px;
        font-size: 30px;
        line-height: 72px;
        text-align: center;
        color: var(--el-color-primary);
        margin-bottom: 8px;
      }
      .app-text {
        text-align: center;
        color: #666;
        font-size: var(--el-font-size-base);
      }
    }
    .app-item:hover {
      i {
        background: #f9fcff;
      }
    }
  }
  .step-box {
    height: 86px;
    position: relative;
  }
  :deep(.desc-row) {
    color: #333;
  }
  :deep(.desc-label) {
    color: #666;
  }
  :deep(.el-step__head.is-finish .el-step__line) {
    background-color: var(--el-color-primary);
  }
  .board-box {
    padding-bottom: 20px;
  }
  .board-item {
    width: 160px;
    text-align: center;
    display: inline-block;
    position: relative;
    .data {
      .large {
        font-size: 30px;
      }
      .small {
        font-size: var(--el-font-size-large);
      }
      .grey {
        color: #999;
      }
      margin-bottom: 4px;
    }
    .text {
      color: #999;
      margin-bottom: 20px;
    }
    .el-progress {
      margin-left: 25px;
    }
  }
  .divider-right::after {
    content: '';
    position: absolute;
    display: block;
    width: 1px;
    height: 40px;
    background: #ddd;
    top: 20px;
    right: 0;
  }
  .divider {
    // height: 15px;
    background-color: #f3f6f9;
    margin-bottom: 20px;
    padding: 6px 67%;
    margin-left: -12px;
  }
  .dividerY {
    background-color: #f3f6f9;
    // width: 10px;
    // margin-right: 20px;
    padding: 21% 6px;
    margin-top: -16px;
    min-height: calc(100vh - 60px - 36px);
  }
  .sysInlet {
    padding: 0px;
  }
  .sysInlet1 {
    padding: 0px 5px;
    .sysInlet-container {
      padding: 10px 0;
    }
  }
  .sysInlet2 {
    width: 130%;
  }
  .payPackage {
    margin-top: 10px;
    .displayLabel {
      display: flex;
      justify-content: space-between;
      .icon {
        color: green;
        position: relative;
        top: 2px;
        padding-left: 10px;
        font-size: 18px;
      }
    }
  }
  :deep(.el-step__icon.is-icon) {
    max-width: 200px;
    width: auto;
  }
}
:deep(.el-step__icon.is-icon) {
  max-width: 200px;
  width: auto;
}
:deep(.isLast) {
  // &:nth-of-type(5) {
  .el-step__line {
    display: block;
  }
  // }
}
</style>
<style lang="less">
.main-box {
  .el-dialog__header {
    border-bottom: 1px solid #ddd;
    margin-right: 0;
  }
  .el-dialog__body {
    padding: 10px 20px 20px 20px;
  }
  .el-dialog__footer {
    border-top: 1px solid #ddd;
    padding: 10px 20px;
  }
}

.el-descriptions__body .el-descriptions__table {
  white-space: nowrap;
}
.el-descriptions-item__content {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 8px;
}
</style>

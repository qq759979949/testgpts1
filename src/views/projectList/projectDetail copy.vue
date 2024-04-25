<template>
  <div class="main-box">
    <section class="section-container">
      <div class="title">
        我的应用
        <el-button class="title-btn" size="small" @click="configApp">
          <el-icon><Edit /></el-icon> 编辑
        </el-button>
      </div>
      <div class="section-box">
        <div
         v-for="item in myApp"
         class="app-item"
         @click="goApp(item)"
        >
          <i
            class="iconfont btn-icon"
            :class="item.icon"
          />
          <div class="app-text">{{ item.name }}</div>
        </div>
      </div>
    </section>
    <section class="section-container">
      <div class="title">
        详细信息
      </div>
      <el-descriptions
        direction="horizontal"
        :column="4"
      >
        <el-descriptions-item
        v-for="item in detailLayout"
        width="25%"
        label-class-name="desc-label"
        class-name="desc-row"
        :label="item.label">{{ item.value }}</el-descriptions-item>
      </el-descriptions>
    </section>
    <section class="section-container">
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
    </section>
    <section class="section-container">
      <div class="title">
        项目附件
      </div>
      <div class="title">
        <el-button type="primary" @click="downLoad">下载选定的文件</el-button>
        <el-button @click="addFile">添加</el-button>
        <!-- <el-button @click="editFile">编辑</el-button> -->
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
    </section>
    <el-dialog
      v-model="showAppConfig"
      title="我的应用编辑"
      width="1120"
    >
      <div class="dialog-box">
        <section class="section-top">
          <div class="title">当前应用<span class="text-tip">（可拖拽排序）</span>
          </div>
          <div class="app-box">
            <draggable
              v-model="tempApp"
              item-key="id"
              animation="200"
            >
              <template #item="{element, index}">
                <div class="app-item">
                  <i
                    class="iconfont"
                    :class="element.icon"
                  >
                  </i>
                  <span>{{ element.name }}</span>
                  <el-icon class="btn-icon" @click="delApp(index)"><RemoveFilled /></el-icon>
                </div>
              </template>
            </draggable>
          </div>
        </section>
        <section class="section-bottom">
          <div class="title">更多应用</div>
          <div class="app-box">
            <div
              v-for="item in appStore"
              class="app-item"
            >
              <i
                class="iconfont"
                :class="item.icon"
              />
              <span>{{ item.name }}</span>
              <el-icon class="btn-icon" @click="addApp(item)"><CirclePlusFilled /></el-icon>
            </div>
          </div>
        </section>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAppConfig = false">取消</el-button>
          <el-button type="primary" :loading="isLoading" @click="confirmConfig">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <UploadDialog 
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
    </UploadDialog>
  </div>
</template>

<script>
import PiTable from '@/components/pdcCustom/PiTable.vue'
import UploadDialog from '@/components/uploadDialog.vue'
import PiSteps from '@/components/pdcCustom/PiSteps.vue'
import draggable from 'vuedraggable'
import * as _ from 'lodash'
import {
  getUserApp,
  setUserApp,
  getRiskCount,
  getProjectInfo,
  getIssueCount } from '@/api/project'
export default {
  name: 'projectDetail',
  components: {
    PiSteps,
    draggable,
    PiTable,
    UploadDialog
  },
  data () {
    return {
      myApp: [
        // {
        //   id: '1',
        //   icon: 'icon-wenti',
        //   path: '',
        //   name: '创建问题'
        // },
        // {
        //   id: '2',
        //   icon: 'icon-fengxian',
        //   path: '',
        //   name: '创建风险'
        // },
        // {
        //   id: '7',
        //   icon: 'icon-xiangmujiaofuwu',
        //   path: '',
        //   name: '上传交付物'
        // }
      ],
      projectInfo: {},
      tempApp: [],
      problemTotal: 0,
      problemSolved: 0,
      riskTotal: 0,
      riskSolved: 0,
      isLoading: false,
      appList: [
        {
          id: '1',
          icon: 'icon-wenti',
          path: '/project/projectQuestion',
          name: '创建问题'
        },
        {
          id: '2',
          icon: 'icon-fengxian',
          path: '/project/projectRisk',
          name: '创建风险'
        },
        {
          id: '3',
          icon: 'icon-biaodan',
          path: '',
          name: '创建评审'
        },
        {
          id: '4',
          icon: 'icon-renwu',
          path: '',
          name: '创建项目任务书'
        },
        {
          id: '5',
          icon: 'icon-biaodan',
          path: '',
          name: '创建结项验收表'
        },
        {
          id: '6',
          icon: 'icon-xiangmuguanli',
          path: '/project/updateProject',
          name: '编辑项目'
        },
        {
          id: '7',
          icon: 'icon-xiangmujiaofuwu',
          path: '',
          name: '上传交付物'
        },
        {
          id: '8',
          icon: 'icon-xiangmushuju',
          path: '',
          name: '汇总项目数据'
        },
        {
          id: '9',
          icon: 'icon-xiangmuguanli',
          path: '',
          name: '更新进度'
        },
        {
          id: '10',
          icon: 'icon-jiankong',
          path: '',
          name: '设置状态'
        },
        {
          id: '11',
          icon: 'icon-biaodan',
          path: '',
          name: '结项检查'
        },
        {
          id: '12',
          icon: 'icon-tuisong',
          path: '',
          name: '推送项目数据到thingworx'
        }
      ],
      detailLayout: [
        {
          label: '项目名称：',
          value: '',
          key: 'projectName'
        },
        {
          label: '项目简称：',
          value: '',
          key: 'projectAbbreviation'
        },
        {
          label: '项目编码：',
          value: '',
          key: 'projectShortName'
        },
        {
          label: '项目类型：',
          value: '',
          key: 'projectType'
        },
        {
          label: '项目经理：',
          value: '',
          key: 'projectManager'
        },
        {
          label: '项目状态：',
          value: '',
          key: 'state'
        },
        {
          label: '健康状态：',
          value: '',
          key: 'healthStatus'
        },
        {
          label: '计划开始时间：',
          value: '',
          key: 'planStartDate'
        },
        {
          label: '创建者：',
          value: '',
          key: 'creator'
        },
        {
          label: '项目预算：',
          value: '',
          key: 'projectBudget'
        },
        {
          label: '风险等级：',
          value: '',
          key: 'riskLevel'
        },
        
        {
          label: '计划完成时间：',
          value: '',
          key: 'planEndDate'
        },
        {
          label: '修改者：',
          value: '',
          key: 'modifier'
        },
      ],
      showAppConfig: false,
      colunms:[
        {
          title:'标签或文件名',
          dataIndex:'fileName',
        },
        {
          title:'格式',
          dataIndex:'fileFormat',
        },
        {
          title:'附件说明',
          dataIndex:'fileDescription',
        },
        {
          title:'上次修改时间',
          dataIndex:'lastModified',
        },
        {
          title:'修改者',
          dataIndex:'modifier',
        },
      ],
      tableData:[
        // {
        //   fileName:'测试附件1',
        //   fileFormat:'txt',
        //   fileDescription:'测试附件1',
        //   lastModified:'2023/07/27',
        //   modifier:'wcadmin',
        //   oid:'1'
        // },
        // {
        //   fileName:'测试附件2',
        //   fileFormat:'word',
        //   fileDescription:'测试附件2',
        //   lastModified:'2023/07/26',
        //   modifier:'wcadmin2',
        //   oid:'2'
        // },
      ],
      selectFileArr: [],
      isShowUpload: false,
      uploadParam:{}
    }
  },
  computed: {
    appStore () {
      let arr = []
      this.appList.forEach(app => {
        let obj = this.tempApp.find(item => item.id === app.id)
        if (!obj) {
          arr.push(app)
        }
      })
      return arr
    },
    problemRate () {
      if (this.problemTotal === 0) {
        return 100
      } else {
        return this.problemSolved * 100 / this.problemTotal
      }
    },
    riskRate () {
      if (this.riskTotal === 0) {
        return 100
      } else {
        return this.riskSolved * 100 / this.riskTotal
      }
    }
  },
  mounted () {
    this.getMyApp()
    getProjectInfo ({oid: JSON.parse(sessionStorage.getItem('currentProject')).oid}).then(res => {
      if (res.success) {
        this.projectInfo = res.data
        this.initLayout()
      } else {
        this.$message.warning(res.message)
      }
    })
    getRiskCount({oid: JSON.parse(sessionStorage.getItem('currentProject')).oid}).then(res => {
      if (res.success) {
        this.riskTotal = res.data[0].totalRisk
        this.riskSolved = res.data[0].solvedRisk
      }
    })
    getIssueCount({oid: JSON.parse(sessionStorage.getItem('currentProject')).oid}).then(res => {
      if (res.success) {
        this.problemTotal = res.data[0].totalIssue
        this.problemSolved = res.data[0].solvedIssue
      }
    })
  },
  methods: {
    getMyApp () {
      getUserApp().then(res => {
        if (!res.data.myAppList) {
          this.myApp = []
        } else {
          let arr = res.data.myAppList.split(',')
          this.myApp = []
          arr.forEach(item => {
            let obj = this.appList.find(app => app.id === item)
            this.myApp.push(obj)
          })
        }
      })
    },
    initLayout () {
      this.detailLayout.forEach(item => {
        item.value = this.projectInfo[item.key]
      })
    },
    configApp () {
      this.showAppConfig = true
      this.tempApp = _.cloneDeep(this.myApp)
    },
    confirmConfig () {
      this.isLoading = true
      let tempArr = []
      this.tempApp.forEach(item => {
        tempArr.push(item.id)
      })
      setUserApp({
        myAppList: tempArr.join()
      }).then(res => {
        this.isLoading = false
        this.getMyApp()
        this.showAppConfig = false
      })
    },
    delApp (index) {
      this.tempApp.splice(index, 1)
    },
    addApp (obj) {
      this.tempApp.push(obj)
    },
    goApp (item) {
      if (item.path) {
        this.$router.push({path: item.path})
      }
    },
    selectionChange (rowKey,row) {
      this.selectFileArr = row
    },
    downLoad () {
      if(this.selectFileArr.length === 0) return this.$message.warning('请选择数据')
      console.log(this.selectFileArr)
    },
    addFile () {
      this.isShowUpload = true
    },
    uploadSubmit (file) {
      console.log(file, this.uploadParam)
    },
    editFile () {
      if(this.selectFileArr.length === 0) return this.$message.warning('请选择数据')
    },
    removeFile () {
      if(this.selectFileArr.length === 0) return this.$message.warning('请选择数据')
    }
  }
}
</script>

<style lang="scss" scoped>
.main-box {
  padding-bottom: 20px;
  .section-container {
    margin-bottom: 20px;
  }
  .title {
    font-size: 16px;
    font-weight: 600;
    height: 24px;
    line-height: 24px;
    margin-bottom: 16px;
    .title-btn {
      margin-left: 6px;
      transform: translateY(-2px);
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
        background: #F6F9FE;
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
        font-size: 14px;
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
        font-size: 18px;
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
  .dialog-box {
    min-height: 400px;
    section {
      .title {
        margin-bottom: 8px;
        font-size: 14px;
      }
      .app-item {
        display: inline-block;
        margin-right: 8px;
        margin-bottom: 8px;
        border: 1px solid #ddd;
        width: 260px;
        height: 50px;
        border-radius: 4px;
        line-height: 48px;
        padding: 0 12px;
        .iconfont {
          height: 30px;
          width: 30px;
          border-radius: 4px;
          display: inline-block;
          text-align: center;
          line-height: 30px;
          background: #F6F9FE;
          margin-right: 8px;
          color: var(--el-color-primary); 
        }
        .btn-icon {
          float: right;
          color: #ccc;
          font-size: 20px;
          transform: translateY(14px);
          cursor: pointer
        }
        .btn-icon:hover {
          color: #ddd;
        }
      }
    } 
    .section-top {
      .text-tip {
        font-size: 12px;
        color: #ccc;
      }
    }
    .section-bottom {
      .app-item {
        background: #f4f4f5;
      }
    }
  }
}  
</style>
<style lang="scss">
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
</style>
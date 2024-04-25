<template>
  <div class="main-container">
    <div class="main-title">
      <span>{{ name }}</span>
      <div class="btn-box">
        <el-button>操作1</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </div>
    <div class="main-box">
      <div class="sub-section">
        <div class="sub-title">基本信息</div>
        <div class="sub-main">
          <div class="img-box">
            <img src="" alt="文件缩略图">
          </div>
          <div class="content-box">
            <el-descriptions
              :column="2"
            >
              <el-descriptions-item
                v-for="item in layout"
                :label="item.label"
                :span="item.span"
              >
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>
      <div class="sub-section">
        <div class="sub-title">流程处理</div>
        <ProcessRecord
        >
        </ProcessRecord>
      </div>
      <div class="sub-section">
        <div class="sub-title">历史版本</div>
      </div>
    </div>
  </div>
</template>
<script>
import ProcessRecord from '@/components/process/processRecord.vue'
export default {
  name: 'deliverableDetail',
  components: { ProcessRecord },
  data () {
    return {
      name: '交付物查看示例',
      layout: [
        {
          label: '交付内容',
          key: 'name',
          span: 1,
        },
        {
          label: '交付物状态',
          key: 'status',
          span: 1,
        },
        {
          label: '所属项目',
          key: 'project',
          span: 1,
        },
        {
          label: '签批人',
          key: 'user1',
          span: 1,
        },
        {
          label: '提交人',
          key: 'user2',
          span: 1,
        },
        {
          label: '签批时间',
          key: 'date1',
          span: 1,
        },
        {
          label: '提交时间',
          key: 'date2',
          span: 1,
        },
      ]
    }
  },
  methods: {
    goBack () {
      history.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.main-container {
  .main-title {
    font-size: var(--el-font-size-large);
    font-weight: 600;
    .btn-box {
      float: right;
    }
  }
  .main-box {
    .sub-section {
      .sub-title {
        font-size: var(--el-font-size-medium);
        color: #333;
        font-weight: bold;
        padding: 4px 12px;
        margin: 16px 0;
        position: relative;
        background: var(--el-border-color-extra-light);
      }
      .sub-title::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: var(--el-color-primary-light-3);
      }
      .sub-main {
        .img-box {
          width: 280px;
          height: 160px;
          background: #ccc;
          display: inline-block;
          vertical-align: top;
          margin-right: 20px;
        }
        .content-box {
          width: calc(100% - 300px);
          height: 160px;
          display: inline-block;
          padding: 0 16px;
          :deep(.el-descriptions__label) {
            width: 108px;
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>

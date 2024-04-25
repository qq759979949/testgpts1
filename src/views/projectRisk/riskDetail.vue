<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2023-10-30 08:42:38
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-03-11 17:19:38
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\projectRisk\riskDetail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="main-box" v-loading="Data.isLoading">
    <div class="topDetail" ref="topArea">
      <div class="topTitle">
        <div class="title">{{ Data.projectObj?.projectShortName }} -- {{ Data.projectObj?.projectName }}</div>
      </div>
      <div class="description-box">
        <!-- <objectInfo :detailLayout="item.items" :column="3" :infoTitle="item.groupName" v-for="(item, index) in Data.infoDatas" :key="index"></objectInfo> -->
        <FormDetail ref="form" labelWidth="200px" :formList="Data.infoDatas" v-model:submitData="Data.submitData"></FormDetail>
        <div class="file">
          <span class="labelCss">附件：</span>
          <el-form-item :required="false" style="width: 100%">
            <div v-for="(item, index) in Data.fileArray" :key="index" class="uploadFile">
              <el-link type="primary" @click="handlePreview(item)">{{ item.fileName }}</el-link>
            </div>
          </el-form-item>
        </div>
      </div>
    </div>
    <div class="bottomProcess" :style="{ height: `calc(100vh - ${Data.computedHeight}px)`, overflowY: 'scroll' }">
      <div class="line-title">流程处理</div>
      <div class="sub-box">
        <ProcessRecord :oid="Data.processOid"></ProcessRecord>
      </div>
    </div>
  </div>
</template>

<script setup>
// import objectInfo from '@/components/objectInfo/objectInfo.vue';
import ProcessRecord from '@/components/process/processRecord.vue';
import { useCommonHandler } from '@/hooks';
import { useResizeObserver } from '@vueuse/core';
// const router = useRouter();
const route = useRoute();
const topArea = ref();
const Data = reactive({
  isLoading: false,
  infoDatas: [],
  riskOid: route.query.riskOid,
  processOid: '',
  projectObj: JSON.parse(sessionStorage.getItem('currentProject')),
  fileArray: [],
  computedHeight: null,
  submitData: {},
});
// 获取文件详情
const getRiskDetail = () => {
  window.$api.projectRiskApi.getRiskDetails({ oid: Data.riskOid }).then((res) => {
    if (res.success) {
      Data.fileArray = res.data.secondaryFileNames.map((item, index) => {
        const obj = {};
        obj.oid = res.data.secondaryContentOids[index];
        obj.fileName = item;
        return obj;
      });
    } else {
      window.$message.error(res.message);
    }
  });
};
// 获取详情
const getRiskLayout = () => {
  Data.isLoading = true;
  window.$api.projectRiskApi.getInfoLayout({ oid: Data.riskOid }).then((res) => {
    if (res.success) {
      // Data.infoDatas = res.data.map((item) => {
      //   item.items = item.items.map((i) => {
      //     // i.label = i.label;
      //     i.value = i.displayValue;
      //     return i;
      //   });
      //   return item;
      // });
      // Data.fileArray = res.data.secondaryFileNames.map((item, index) => {
      //   const obj = {};
      //   obj.oid = res.data.secondaryContentOids[index];
      //   obj.fileName = item;
      //   return obj;
      // });
      let datas = res.data.map((item) => {
        item.groupName = '';
        item.items = item.items.map((i) => {
          i.label = i.label + '：';
          i.value = i.displayValue;
          i.filedType = 'DISPLAY';
          i.required = false;
          return i;
        });
        return item;
      });
      // let datas = res.data;
      datas.forEach((v) => {
        v.items.forEach((e) => {
          Data.submitData[e.name] = '';
        });
      });
      Data.infoDatas = window.$formatData(datas, Data.submitData);
      Data.infoDatas.forEach((item) => {
        item.list = item.list.map((el) => {
          el.maxSpan = el.length;
          return el;
        });
      });
      Data.isLoading = false;
    } else {
      window.$message.error(res.message);
      Data.isLoading = false;
    }
  });
};
// 查看附件
const handlePreview = (item) => {
  window.$api.fileApi.downloadContent({ oid: item.oid }).then((res) => {
    useCommonHandler.download(res, item.fileName);
  });
};
// 获取路由
const queryRoute = () => {
  window.$api.processApi.queryProcessHistory({ oid: Data.riskOid, queryAll: false }).then((res) => {
    if (res.success) {
      Data.processOid = res.data.length > 0 ? res.data[0].processOid : '';
    } else {
      window.$message.error(res.message);
    }
  });
};
onMounted(() => {
  getRiskDetail();
  getRiskLayout();
  queryRoute();
  useResizeObserver(topArea, (entries) => {
    const entry = entries[0];
    const { height } = entry.contentRect;
    Data.computedHeight = `${height + 154}`;
  });
});
</script>

<style lang="scss" scoped>
.main-box {
  .topDetail {
    background-color: #fff;
    padding: 16px 16px 0 16px;
  }
  .topTitle {
    display: flex;
    justify-content: flex-start;
    .title {
      font-size: 20px;
      font-weight: 550;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
      padding-bottom: 10px;
      // padding-left: 20px;
    }
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 12px;
  }
  .description-box {
    :deep(.desc-row) {
      color: #333;
    }
    :deep(.desc-label) {
      color: #666;
    }
    :deep(.desc-label::after) {
      content: '：';
    }
  }
  .file {
    display: flex;
    .labelCss {
      width: 220px;
      display: inline-block;
      text-align: left;
      color: #666;
      font-weight: 550;
      padding: 0 12px 0 20px;
      font-size: 14px;
    }
  }
  .line-title {
    font-size: 16px;
    font-weight: bold;
    padding: 12px;
    // margin-top: 20px;
    border-bottom: 1px solid #ddd;
  }
  .sub-box {
    padding: 12px;
  }
  .bottomProcess {
    background-color: #fff;
    margin: 16px 16px 0 16px;
    // padding: 16px;
    // height: calc(100vh - 630px);
    // overflow-y: scroll;
    // padding: 0 40px;
    // margin-left: -40px;
  }
  .uploadFile {
    margin-right: 20px;
  }
  :deep(.demo-ruleForm .row-value1) {
    color: #000;
  }
}
</style>

<template>
  <div v-if="Data.tableList.length > 0" v-loading="Data.loading">
    <div class="configuration">
      <div class="product-list" v-for="(item, index) in Data.tableList" :key="index">
        <div class="product">
          <p class="product-name">{{ item.configType }}</p>
          <div class="file">
            <div class="image">
              <el-image style="width: 200px; height: 100px" :src="item.fileUrl" v-if="item.fileUrl !== ''"></el-image>
              <el-empty v-else image="" />
            </div>
          </div>
        </div>
        <div class="content">
          <p class="order-number">
            <span class="order-title">订货号:</span>
            <el-tooltip :content="item.primaryConfig" placement="top">
              <span class="content-item">{{ item.primaryConfig }}</span>
            </el-tooltip>
          </p>
          <el-divider />
          <div v-for="(itm, idx) in item.configValues" :key="idx">
            <p class="config-number">
              <span class="order-title other">
                <el-tooltip :content="itm.configName" placement="top">
                  <span class="content-item">{{ itm.configName }}</span>
                </el-tooltip>
              </span>
              <span :class="itm.same ? 'compare' : ''">{{ itm.configValue }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-empty description="暂无数据" v-else />
</template>

<script setup>
const api = window.$api;
const Data = reactive({
  tableList: [],
  oid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  dataList: [],
  imageUrl: [],
  loading: false,
});
onMounted(() => {
  handleQuearyData();
});
// 查询
const handleQuearyData = () => {
  api.reviewApi.hasConfigItems({ oid: Data.oid }).then((res) => {
    if (res.data) {
      getConfigItemsByProject();
    } else {
      emit('update:tableList', []);
    }
  });
};
const getConfigItemsByProject = () => {
  Data.loading = true;
  api.reviewApi.findConfigItemsByProject({ oid: Data.oid }).then((res) => {
    if (res.success) {
      Data.tableList = res.data.filter((item) => item.view === 'true');
      emit('update:tableList', Data.tableList);
      // 和第一项对比,不同标红
      if (Data.tableList.length > 0) {
        let firstArray = Data.tableList[0].configValues;
        Data.tableList.slice(1).map((item) => {
          firstArray.forEach((element, eleIndex) => {
            element.index = eleIndex + 1;
            item.configValues.map((item, index) => {
              item.index = index + 1;
              if (element.index === item.index && element.configValue === item.configValue) {
                item.same = false;
              } else if (element.index === item.index && element.configValue !== item.configValue) {
                item.same = true;
              }
            });
          });
        });
      }
      Data.loading = false;
      handleDown();
    } else {
      window.$message.error(res.message);
      Data.loading = false;
    }
  });
};
// 文件下载
const handleDown = () => {
  Data.tableList = Data.tableList.map((v) => {
    if (v.contentFileOid) {
      api.targetApi.downloadContent({ oid: v?.contentFileOid, download: false }).then((result) => {
        let blob = new Blob([result], { type: 'image/jpeg,image/png' });
        const imageUrl = URL.createObjectURL(blob);
        v.fileUrl = imageUrl ? imageUrl : '';
      });
    } else {
      v.fileUrl = '';
    }
    return v;
  });
};
const emit = defineEmits(['update:tableList']);
defineExpose({ Data });
</script>

<style lang="less" scoped>
.compare {
  color: red;
}
.configuration {
  display: flex;
  justify-content: center;
  align-items: top;
  padding-top: 20px;
}
.product-list {
  border-radius: 10px;
  border: 1px solid #d3d3d3;
  width: 463px;
  padding-bottom: 10px;
  .product {
    text-align: center;
    font-size: 16px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 500;
    color: #333333;
    .product-name {
      background: #386bd7;
      text-align: center;
      cursor: pointer;
      margin: auto;
      width: 136px;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 400;
      font-size: 16px;
      color: #ffffff;
    }
    .file {
      padding: 10px 0;
    }
    .image {
      border: 1px solid #d3d3d3;
      width: 240px;
      height: 135px;
      padding: 15px 10px 15px 10px;
      margin: 10px auto 10px auto;
    }
  }
  .content {
    padding: 5px 20px 5px 30px;
  }
}
.product-list:nth-of-type(even) {
  margin: 0 40px;
}
.order-number {
  display: flex;
  .order-title {
    flex: 1;
  }
  .content-item {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 140px;
  }
}
.config-number {
  display: flex;
  border-bottom: 1px solid #d3d3d3;
  margin-top: 8px;
  padding: 5px 0;
  .order-title {
    flex: 1;
  }
  .other {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 50px;
  }
}
:deep(.el-col) {
  padding: 0;
}
:deep(.el-table td) {
  .el-table__cell div {
    height: 40px;
    line-height: 40px;
  }
  .el-table__cell {
    height: 40px;
    line-height: 40px;
  }
}
:deep(.el-table--border .el-table__cell) {
  border-right: 1px solid #ebeef5 !important;
}
:deep(.el-divider--horizontal) {
  margin-bottom: 10px;
}
:deep(.el-empty) {
  width: 100%;
  height: 100px;
}
:deep(.el-empty__image) {
  height: 100px;
}
:deep(.el-empty__description) {
  margin-top: 3px;
}
</style>

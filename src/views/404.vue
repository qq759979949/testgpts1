<template>
  <div class="undeveloped">
    <div class="title">
      <div class="icon_title2">
        <el-icon size="30">
          <svg><use xlink:href="#icon-sf-list"></use></svg>
        </el-icon>
      </div>
    </div>
    <div class="exception-page">
      <div class="img">
        <img src="~@/assets/images/svg/undeveloped.svg" />
      </div>
      <div class="content">
        <h1>404</h1>
        <div class="desc">抱歉，你访问的页面不存在或仍在开发中</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.undeveloped {
  height: calc(100vh - 120px);
  background-color: #fff;
  padding: 10px;
  margin: 0 16px;
  .title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .el-input {
      width: 226px;
    }
  }
  .icon_title2 {
    display: flex;
  }
  .exception-page {
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    flex-direction: column;
    height: calc(100% - 100px);
    .img {
      zoom: 1;
      img {
        max-width: 430px;
      }
    }
    .content {
      text-align: center;
      margin-top: 40px;
      h1 {
        color: #434e59;
        font-size: 72px;
        font-weight: 600;
        line-height: 72px;
        margin-bottom: 24px;
      }
      .desc {
        color: #000;
        font-size: 20px;
        line-height: 28px;
        margin-bottom: 16px;
      }
    }
  }
}
</style>

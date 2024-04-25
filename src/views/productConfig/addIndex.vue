<template>
  <div class="add_index" v-loading="Data.loading">
    <div class="btn_box">
      <el-button type="primary" @click="cutFun" v-permission="'/plmProject/EditConfiguration'">{{ $intl('Add configuration').d('裁剪配置') }}</el-button>
      <el-button :loading="refreshLoad" @click="refresh" v-permission="'/plmProject/EditConfiguration'">{{ $intl('Delete Configuration').d('重新加载') }}</el-button>
    </div>
    <el-scrollbar @scroll="handScroll">
      <div class="table_box">
        <table class="mailTable" cellspacing="0" cellpadding="0">
          <tr class="tr_item" v-for="(item, index) in Data.contentData" :key="index">
            <td class="column">
              <div class="first_row">
                <span class="check">
                  <el-checkbox v-if="item.configSet?.required === '否'" v-model="item.ischeck" @change="checkFun(item)"></el-checkbox>
                </span>
                <span class="first_value">{{ item.configName }}</span>
              </div>
            </td>
            <template v-for="(i, d) in Data.indexArr" :key="d">
              <td class="td_item" :class="{ isTwo: d === 0 && left > 0 }" v-if="item.configName === '增删订货号及配置'">
                <span class="add_css">
                  <el-icon v-if="d === Data.indexArr.length - 1" size="20" color="#386BD7" @click="addRowData"><CirclePlus /></el-icon>
                  <el-icon v-else-if="d > 0 && d !== Data.indexArr.length - 1" size="20" color="#386BD7" @click="removeRow(d)"><Remove /></el-icon>
                </span>
              </td>
              <td class="td_item" :class="{ isTwo: d === 0 && left > 0 }" v-else-if="item.configName === '是否显示'">
                <span class="add_css">
                  <el-checkbox v-model="item['configValue_' + i]" v-if="d > 0 && d !== Data.indexArr.length - 1"></el-checkbox>
                </span>
              </td>
              <td class="td_item" :class="{ isTwo: d === 0 && left > 0 }" v-else-if="item.configName === '主要配置'">
                <el-input v-if="d !== Data.indexArr.length - 1" v-model="item['configValue_' + d]" type="textarea" placeholder="请输入" />
              </td>
              <td class="td_item" :class="{ isTwo: d === 0 && left > 0 }" v-else-if="item.configName === '配置类型'">
                <span v-if="d !== Data.indexArr.length - 1">{{ d === 0 ? '基本机型' : '当前项目机型' }}</span>
              </td>
              <td class="td_item" :class="{ isTwo: d === 0 && left > 0 }" v-else-if="item.configName === '产品介绍'">
                <template v-if="d !== Data.indexArr.length - 1">
                  <el-upload
                    :class="{ uploadVisible: item['configValue_' + d]?.length > 0 }"
                    class="upload_css"
                    action="#"
                    list-type="picture-card"
                    accept="image/jpg, image/jpeg, image/png"
                    v-model:file-list="item['configValue_' + d]"
                    v-if="item['configValue_' + d]?.length === 0 || (item['configValue_' + d] && item['configValue_' + d][0].name)"
                    :auto-upload="true"
                    :before-upload="beforeAvatarUpload"
                    :on-change="(UploadFile, UploadFiles) => fileChange(UploadFile, UploadFiles, item, d)"
                  >
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">点击或将图片拖拽到这里上传</div>
                    <div class="upload_tips">支持扩展名：jpg、jpeg、png</div>
                    <template #file="{ file }">
                      <div>
                        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                        <span class="el-upload-list__item-actions">
                          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file.url)">
                            <el-icon><zoom-in /></el-icon>
                          </span>
                          <span class="el-upload-list__item-delete" @click="handleRemove(item, d)">
                            <el-icon><Delete /></el-icon>
                          </span>
                        </span>
                      </div>
                    </template>
                  </el-upload>
                  <div class="upload_css" v-else>
                    <div class="look_img" style="width: 146px; height: 146px">
                      <img :src="item['configValue_' + d]" alt="" />
                      <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(item['configValue_' + d])">
                          <el-icon><zoom-in /></el-icon>
                        </span>
                        <span class="el-upload-list__item-delete" @click="handleRemove(item, d)">
                          <el-icon><Delete /></el-icon>
                        </span>
                      </span>
                    </div>
                  </div>
                </template>
              </td>
              <td class="td_item" :class="{ isTwo: d === 0 && left > 0, diffClass: item.diffClass[d] }" v-else>
                <template v-if="d !== Data.indexArr.length - 1">
                  <div v-if="item?.configSet?.writeMode === '下拉选择'">
                    <el-select v-model="item['configValue_' + i]" :clearable="true" style="width: 100%">
                      <el-option v-for="(item, index) in item.configSet.enumValue" :key="index" :label="item" :value="item" />
                    </el-select>
                  </div>
                  <div v-else-if="item?.configSet?.writeMode === '手工填写'">
                    <el-input v-model="item['configValue_' + i]" placeholder="请输入内容" />
                  </div>
                </template>
              </td>
            </template>
          </tr>
        </table>
      </div>
    </el-scrollbar>
    <div class="footer">
      <div class="actionRow">
        <el-button @click="goback">
          {{ $intl('cancel').d('取消') }}
        </el-button>
        <el-button @click="onSubmit" type="primary">
          {{ $intl('save').d('保存') }}
        </el-button>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogVisible" :title="'图片预览'">
    <img w-full width="100%" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script setup name="addConfig">
import { uniqueFunc } from '@/utils/utils';
const Data = reactive({
  loading: false,
  contentData: [
    // {
    //   configName: '1111',
    //   configValue: '',
    //   configSet: {
    //     writeMode: '',
    //     required: '',
    //     enumValue: '',
    //     configOrder: '',
    //   },
    // },
  ],
  indexArr: [], // 数据循环暂存数组

  /**主要配置 */
  mainConfig: '',
  /**上传 */
  fileList: [],
  isSingle: true,

  /**动态上传 */
  activeFileList: [],

  projectOid: JSON.parse(sessionStorage.getItem('currentProject'))?.oid,
  /**用户 */
  userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),
});

const api = window.$api;
const route = useRoute();
const router = useRouter();
/**上传方法 */
const fileChange = (UploadFile, UploadFiles, item, index) => {
  Data.fileList = UploadFiles;
  if (UploadFiles.length === 1) {
    item['configValue_' + index] = UploadFiles;
  } else {
    item['configValue_' + index] = UploadFiles.splice(0, 1);
  }
};

const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const handlePictureCardPreview = (url) => {
  dialogImageUrl.value = url;
  dialogVisible.value = true;
};
const handleRemove = (data, index) => {
  data['configValue_' + index] = [];
  initDataArr.value[index].contentFileOid = '';
};

/**上传图片限制 */
const beforeAvatarUpload = (rawFile) => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.onload = function (event) {
      var txt = event.target.result;
      var img = document.createElement('img');
      img.src = txt;
      // img.onload = function () {
      //   /**判断图片大小 */
      //   if (img.width > 196 || img.height > 110) {
      //     window.$message.error('图片尺寸最大为196*110');
      //     return reject(false);
      //   }
      // };
    };
    reader.readAsDataURL(rawFile);
    if (rawFile.type !== 'image/png' && rawFile.type !== 'image/jpg' && rawFile.type !== 'image/jpeg') {
      window.$message.error('图片仅支持jpg、jpeg、png格式!');
      return reject(false);
    } else if (rawFile.size / 1024 / 1024 > 20) {
      window.$message.error('图片大小不能超过20M!');
      return reject(false);
    }
  });
};

// 横向滚动条
const left = ref(null);
const handScroll = (val) => {
  left.value = val.scrollLeft;
};

onMounted(() => {
  Data.loading = true;
  queryConfigData();
});

const initDataArr = ref([]);

const refreshLoad = ref(false);
const refresh = () => {
  Data.loading = true;
  refreshLoad.value = true;
  Data.contentData = [];
  // queryConfigData();
  api.configApi.reLoadConfigItem({ oid: Data.projectOid }).then((res) => {
    if (res.success) {
      handImgFun(res.data);
    } else {
      window.$message.error(res.message);
    }
    refreshLoad.value = false;
    Data.loading = false;
  });
};

// 查询数据
const queryConfigData = async () => {
  let datas = [];
  await api.configApi.findConfigItemsByProject({ oid: Data.projectOid }).then((res) => {
    if (res.success) {
      datas = res.data;
    } else {
      window.$message.error(res.message);
    }
    refreshLoad.value = false;
  });

  handImgFun(datas);
};

const handImgFun = async (datas) => {
  /**获取图片 */
  let hasFile = datas.filter((e) => e.contentFileOid);
  if (hasFile.length === 0) {
    datas = datas.map((v) => {
      v.fileUrl = '';
      return v;
    });
    handData(datas);
  } else {
    datas = datas.map(async (v) => {
      if (v.contentFileOid) {
        await api.commonApi.downloadContent({ oid: v?.contentFileOid, download: false }).then((result) => {
          let blob = new Blob([result], { type: 'image/jpeg,image/png' });
          const imageUrl = URL.createObjectURL(blob);
          v.fileUrl = imageUrl;
        });
      } else {
        v.fileUrl = '';
      }
      return v;
    });
    const arr = await Promise.all(datas);
    handData(arr);
  }
};

/**处理数据 */
const handData = (data) => {
  Data.indexArr = [];
  initDataArr.value = data;
  /**默认数据处理 */
  let defaultArr = [
    { configName: '增删订货号及配置' },
    { configName: '是否显示' },
    { configName: '主要配置' },
    { configName: '配置类型' },
    { configName: '产品介绍', configSet: { writeMode: '上传图片' } },
  ];

  data.forEach((el, ix) => {
    if (Data.contentData.length === 0) {
      el.configValues.forEach((v) => {
        let obj = {};
        obj.configName = v.configName;
        obj['configValue_' + ix] = v.writeMode === '上传图片' ? [] : v?.configValue || '';
        obj.checkId = v.configLibraryOid;
        obj.valueOid = v.configValueOid;
        obj.ischeck = false;
        obj.configSet = {
          writeMode: v.writeMode,
          required: v.required,
          enumValue: v.enumValue ? v.enumValue.split(',') : [],
          configOrder: v.configOrder,
        };
        obj.diffClass = [];
        Data.contentData.push(obj);
      });

      let defaultObj = {};
      defaultArr.forEach((item) => {
        if (item.configName === '是否显示') {
          item['configValue_' + ix] = el?.view === 'true' ? true : false;
        } else if (item.configName === '主要配置') {
          item['configValue_' + ix] = el?.primaryConfig ? el?.primaryConfig : '';
        } else if (item.configName === '产品介绍') {
          defaultObj['configValue_' + ix] = el?.fileUrl ? [el?.fileUrl] : [];
        } else {
          item['configValue_' + ix] = '';
        }
        Object.assign(item, defaultObj);
      });
      Data.contentData = [...defaultArr, ...Data.contentData];
    } else {
      Data.contentData = Data.contentData.map((m) => {
        if (m.configName === '是否显示') {
          m['configValue_' + ix] = el?.view === 'true' ? true : false;
        } else if (m.configName === '主要配置') {
          m['configValue_' + ix] = el?.primaryConfig ? el?.primaryConfig : '';
        } else if (m.configName === '产品介绍') {
          m['configValue_' + ix] = el?.fileUrl ? [el?.fileUrl] : [];
        } else {
          m['configValue_' + ix] = '';
        }
        el.configValues.forEach((v) => {
          if (m.configName === v.configName) {
            m['configValue_' + ix] = v.writeMode === '上传图片' ? [] : v?.configValue || '';
          }
        });
        m.diffClass = [];
        return m;
      });
    }

    Data.indexArr.push(ix);
  });
  Data.indexArr.push(data.length);
  Data.loading = false;
  Data.contentData.forEach((e, ix) => {
    Data.indexArr.forEach((v) => {
      if (e['configValue_' + Data.indexArr[v]] && e['configValue_' + Data.indexArr[0]] !== e['configValue_' + Data.indexArr[v]]) {
        e.diffClass.push('diffClass');
      } else {
        ix > 4 && e?.diffClass.push('');
      }
      return e;
    });
  });
};

// 添加产品配置
const addRowData = () => {
  Data.indexArr.push(Data.indexArr.length);
  Data.contentData = Data.contentData.map((v) => {
    v['configValue_' + (Data.indexArr.length - 2)] = v.configSet?.writeMode === '上传图片' ? [] : '';
    return v;
  });
};
// 移除
const removeRow = (index) => {
  Data.indexArr = Data.indexArr.slice(0, -1);
  Data.contentData = Data.contentData.map((v) => {
    // 第一列不会被替换
    if (Data.indexArr.length === 2) {
      delete v['configValue_' + (Data.indexArr.length - 1)];
    } else {
      // 删除中间的一条的时候，所有的索引都往前移
      Data.indexArr.forEach((el, ix) => {
        if (ix >= index && ix !== Data.indexArr.length - 1) {
          v['configValue_' + (ix === index ? ix : ix - 1)] = v['configValue_' + (ix === index ? ix + 1 : ix)];
        }
        if (ix === Data.indexArr.length - 1) {
          delete v['configValue_' + ix];
        }
      });
    }
    return v;
  });
};

//check 选择
const checkSelectData = ref([]);
const checkFun = (item) => {
  if (item.ischeck) {
    checkSelectData.value.push(item);
  } else {
    checkSelectData.value = checkSelectData.value.filter((v) => v.checkId !== item.checkId);
  }
};

// 裁剪
const cutData = ref([]);
const cutFun = () => {
  if (checkSelectData.value.length === 0) return window.$message.warning('请选择裁剪数据！');
  cutData.value = uniqueFunc(checkSelectData.value, 'checkId');
  Data.contentData = Data.contentData.filter((el) => cutData.value.every((v) => v.checkId !== el.checkId));
};

// 提交
const onSubmit = () => {
  let newIndexArr = Data.indexArr.slice(0, -1);
  let arr = [];
  let fileArr = [];

  newIndexArr.forEach((el, ix) => {
    let obj = {};
    let configValueArr = [];
    Data.contentData.forEach((v) => {
      if (v.configName === '是否显示') {
        obj.view = ix === 0 ? 'true' : v['configValue_' + ix] ? 'true' : 'false';
      } else if (v.configName === '主要配置') {
        obj.primaryConfig = v['configValue_' + ix];
      } else if (v.configName === '配置类型') {
        obj.configType = ix === 0 ? '基本机型' : '当前项目机型';
      } else if (v.configName === '产品介绍') {
        if (v['configValue_' + ix][0]?.name) {
          v['configValue_' + ix][0].name = ix + 1 + '&&&' + v['configValue_' + ix][0]?.name;
          obj.fileName = v['configValue_' + ix][0].name;
          fileArr = [...fileArr, ...v['configValue_' + ix]];
          obj.imgStatus = 'add';
        } else {
          if (initDataArr.value[el]?.contentFileOid) {
            obj.imgStatus = 'update';
          } else {
            obj.imgStatus = 'delete';
          }
          obj.fileName = '';
        }
      } else if (v.configName !== '增删订货号及配置') {
        let configObj = {};
        configObj.configName = v.configName;
        configObj.configValue = v['configValue_' + ix];
        configValueArr.push(configObj);
        obj.configValues = configValueArr;
        obj.configItemOid = initDataArr.value[ix]?.configItemOid ? initDataArr.value[ix]?.configItemOid : '';
      }
    });
    arr.push(obj);
  });

  // let deleteArr = checkSelectData.value.length > 0 ? checkSelectData.value.map((e) => e.valueOid) : [];

  let dataObj = {
    projectOid: Data.projectOid,
    actualCreator: Data.userInfo.username,
    creator: Data.userInfo.thirdPartUser,
    // deleteItemValueOids: deleteArr,
    configItems: arr,
  };
  console.log(cutData.value, '453------------');
  if (cutData.value.length > 0) {
    dataObj['deleteItemValueOids'] = cutData.value.map((e) => e.valueOid);
  }

  let param = new FormData();
  param.append('formData', JSON.stringify(dataObj));
  if (fileArr.length > 0) {
    fileArr.forEach((v) => {
      param.append(v.name, v.raw);
    });
  }
  Data.loading = true;
  api.configApi.saveConfigItemValues(param).then((res) => {
    if (res.success) {
      window.$message.success('保存成功');
      // Data.contentData.forEach((v) => (v.ischeck = false));
      // goback();
    } else {
      window.$message.error(res.message);
    }
    Data.loading = false;
  });
};

/**取消 */
const goback = () => {
  window.$navTagStore.removeTag(route, router);
  window.$navTagStore.removeCacheTag(route.name);
};
</script>

<style lang="less" scoped>
.add_index {
  background-color: #fff;
  margin: 0 20px;
  padding: 20px;
  min-height: calc(100vh - 165px);
  .btn_box {
    margin-bottom: 8px;
  }
  .table_box {
    // position: relative;
    // overflow: hidden;
    // overflow-x: auto;
    // height: 680px;
    .mailTable {
      border-top: 1px solid #dedede;
      // border-left: 1px solid #dedede;
      .tr_item {
        td {
          width: 450px;
          min-width: 450px;
          height: 35px;
          // line-height: 35px;
          box-sizing: border-box;
          padding: 0 10px;
          border-bottom: 1px solid #dedede;
          border-right: 1px solid #dedede;
        }
        .td_item {
          text-align: center;
          padding: 6px 45px;
          .el-textarea {
            // padding: 0 45px;
            margin: 8px 0;
          }
          .upload_css {
            width: 270px;
            height: 150px;
            display: inline-block;
            margin: 10px 0;
            :deep(.el-upload-list) {
              width: 100%;
              height: 100%;
              justify-content: center;
              .el-upload {
                width: 100%;
                height: 100%;
                flex-direction: column;
                .el-upload-dragger {
                  height: 100%;
                  padding: 0px;
                  .el-upload__text {
                    height: 24px;
                    line-height: 24px;
                  }
                  .upload_tips {
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                    font-weight: 400;
                    color: #999999;
                  }
                }
              }
            }
            .look_img {
              width: 146px;
              height: 146px;
              overflow: hidden;
              background-color: var(--el-fill-color-blank);
              border: 1px solid var(--el-border-color);
              border-radius: 6px;
              box-sizing: border-box;
              width: var(--el-upload-list-picture-card-size);
              height: var(--el-upload-list-picture-card-size);
              margin: 0 8px 8px 0;
              padding: 0;
              display: inline-flex;
              position: relative;
              // cursor: pointer;
              img {
                width: 100%;
                height: 100%;
                object-fit: contain;
              }
              .el-upload-list__item-actions {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                cursor: default;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                color: #fff;
                opacity: 0;
                font-size: 20px;
                background-color: var(--el-overlay-color-lighter);
                transition: opacity var(--el-transition-duration);
                .el-upload-list__item-delete {
                  position: static;
                  font-size: inherit;
                  color: inherit;
                  margin-left: 1rem;
                }
                span {
                  cursor: pointer;
                }
                &:hover {
                  opacity: 1;
                  span {
                    display: inline-flex;
                  }
                }
              }
            }
          }
          .uploadVisible {
            :deep(.el-upload-list) {
              .el-upload--picture-card {
                display: none;
              }
            }
          }
          .add_css {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .el-icon {
              cursor: pointer;
            }
          }
        }
        .diffClass {
          :deep(.el-textarea) {
            .el-textarea__inner {
              color: red;
            }
          }
          :deep(.el-input) {
            .el-input__inner {
              color: red;
            }
          }
        }
        .column {
          background-color: #f6f6f6;
          color: #393c3e;
          width: 180px;
          min-width: 180px;
          .first_row {
            display: flex;
            align-items: center;
            .check {
              min-width: 20px;
              :deep(.el-checkbox) {
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
    td:nth-child(1) {
      position: sticky;
      left: 0;
      width: 180px;
      min-width: 180px;
      z-index: 2;
      border-left: 1px solid #dedede;
    }
    td:nth-child(2) {
      position: sticky;
      left: 180px;
      width: 450px;
      min-width: 450px;
      z-index: 2;
      background: #fff;
    }
    .isTwo {
      box-shadow: 3px 6px 10px #d3d3d3;
    }
  }
  .footer {
    position: fixed;
    z-index: 10;
    width: 100%;
    left: 0px;
    // bottom: 108px;
    bottom: 0px;
    box-shadow: 0px -1px 5px 0 rgba(0, 0, 0, 0.08);
    .actionRow {
      text-align: right;
      background: #fff;
      // border-top: 1px solid var(--el-border-color-light);
      padding: 16px 20px 16px 0;
    }
  }
}
:deep(.el-scrollbar) {
  padding-bottom: 10px;
  margin-bottom: 52px;
  .el-scrollbar__bar {
    z-index: 4;
  }
}
</style>

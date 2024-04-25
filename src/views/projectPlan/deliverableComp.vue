<template>
  <section>
    <el-button type="primary" @click="onAdd">新增交付物要求</el-button>
    <el-button @click="edit">编辑</el-button>
    <el-popconfirm
      title="确定移除？"
      @confirm="remove"
    >
      <template #reference>
        <el-button>移除</el-button>
      </template>
    </el-popconfirm>
    <el-button type="primary" @click="save">保存</el-button>
  </section>
  <section class="table-box">
    <el-table :data="Data.list" style="width: 100%" v-loading="Data.tableLoad" @select="tableSelect">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="name" label="交付物要求">
        <template #default="{ row }">
          <!-- <div v-if="row.oid === editOid"> -->
          <div v-if="row.isEdit">
            <div class="deleverName">
              <span style="color: red; margin-right: 4px">*</span>
              <!-- <el-input class="edit-input" v-model="Data.deliverName"></el-input> -->
              <el-input class="edit-input" v-model="row.name"></el-input>
            </div>
          </div>
          <div v-else>
            <div v-if="row.oid">{{ row.name }}</div>
            <div class="deleverName" v-else>
              <span style="color: red; margin-right: 4px">*</span>
              <!-- <el-input class="edit-input" v-model="Data.deliverName"></el-input> -->
              <el-input class="edit-input" v-model="row.name"></el-input>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="deliverableType" label="类型">
        <template #default="{ row }">
          <!-- <div v-if="row.oid === editOid"> -->
          <div v-if="row.isEdit">
            <div class="deleverName">
              <span style="color: red; margin-right: 4px">*</span>
              <el-select v-model="row.deliverableType">
                <el-option v-for="item in deliverTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </div>
          <div v-else>
            <div v-if="row.oid">{{ viewData(row.deliverableType) }}</div>
            <div class="deleverName" v-else>
              <span style="color: red; margin-right: 4px">*</span>
              <el-select v-model="row.deliverableType">
                <el-option v-for="item in deliverTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="subjectName" label="交付物">
        <template #default="{ row, $index }">
          <div v-if="row.oid">
            <el-link type="primary" :underline="false" @click="fileDetailFun(row)">
              {{ row.subjectName }}
              <span v-if="row.isEdit" style="margin-left: 20px">
                <el-icon @click="uploadClick($index)"><Upload /></el-icon>
              </span>
            </el-link>
            <!-- <span v-else>
              {{ row.subjectName }}
              <span>
                <el-icon><Upload /></el-icon>
              </span>
            </span> -->
          </div>
          <div class="deliver" v-else>
            <span v-if="row.subjectName">
              {{ row.subjectName }}
              <span>
                <el-icon @click="uploadClick($index)" color="#386bd7" style="margin-left: 20px"><Upload /></el-icon>
              </span>
            </span>
            <el-button v-else type="primary" @click="uploadClick($index)">上传</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="isCut" label="是否裁剪">
        <template #default="{ row }">
          <!-- <div v-if="row.oid === editOid || !row.oid"> -->
          <div v-if="row.isEdit || !row.oid">
            <el-select v-model="row.isCut">
              <el-option value="是" />
              <el-option value="否" />
            </el-select>
          </div>
          <div v-else>
            {{ row.isCut }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="subjectState" label="状态">
        <template #default="{ row }">
          {{ row.subjectState }}
        </template>
      </el-table-column>
    </el-table>
  </section>
  <!-- 添加随签对象弹框 -->
  <addObjectDialog
    :title="'添加交付物'"
    :isShow="Data.addObjectDialog"
    :moduleType="'planDeliver'"
    v-model:close="Data.addObjectDialog"
    @confirm="addObjectDialogConfirm"
  ></addObjectDialog>
</template>

<script setup>
import addObjectDialog from '@/views/projectFiles/modules/addObjectDialog.vue';

const props = defineProps({
  oid: String,
});
watch(
  () => props.oid,
  (val) => {
    if (val) {
      getDeliverData();
    } else {
      editOid.value = '';
      selectData.value = [];
      Data.addIndex = 0;
    }
  }
);
onMounted(() => {
  getDeliverData()
})
const api = window.$api;
const Data = reactive({
  tableLoad: false,
  list: [],
  deliverName: '',
  addIndex: 0,
  addObjectDialog: false,
  userInfo: JSON.parse(window.$Cookies.get('userInfo') || ''),
});

const onAdd = () => {
  Data.deliverName = '';
  deliverTypeValue.value = '';
  // if (Data.addIndex !== 0) return;
  Data.addIndex++;
  Data.list.push({
    name: '',
    subjectName: '',
    subjectState: '',
    deliverableType: '',
    isCut: '是',
    deliverableOid: '',
  });
};
const router = useRouter();
// 类型
const deliverTypeValue = ref('');
const deliverTypeOptions = ref([
  { label: '文档', value: 'wt.doc.WTDocument' },
  { label: '部件', value: 'wt.part.WTPart' },
  { label: '图纸', value: 'wt.epm.EPMDocument' },
  { label: '更改通告', value: 'wt.change2.WTChangeOrder2' },
]);
// 交付物要求类型展示数据
const viewData = (val) => {
  return deliverTypeOptions.value.filter((v) => v.value === val)[0]?.label;
};
const getDeliverData = () => {
  Data.tableLoad = true;
  api.planApi.getDeliverableByObject({ oid: props.oid }).then((res) => {
    if (res.success) {
      res.data.forEach((v) => {
        if (v.isCut === 'true') {
          v.isCut = '是';
        } else if (v.isCut === 'false') {
          v.isCut = '否';
        }
      });
      Data.list = res.data;
      let arr = []
      res.data.forEach(item => {
        arr.push(item.name)
      })
      emit('updateDeliver', arr);
    } else {
      window.$message.error(res.message);
    }
    Data.tableLoad = false;
  });
};

const fileDetailFun = (item) => {
  const aim = router.resolve({ name: 'fileDetail', query: { oid: item.subjectOid, foldOid: item.foldOid } });
  window.open(aim.href, '_blank')
};

/**点击上传数据索引 */
const isIndex = ref(null);
const uploadClick = (idx) => {
  parmasObj.value = {};
  isIndex.value = idx;
  Data.addObjectDialog = true;
};

// 创建类型
const createType = ref(''); // 创建弹框里面的tab类型
const parmasObj = ref({});
const addObjectDialogConfirm = (val, type) => {
  console.log(val, 199);
  let deliver = '';
  if (type === 'linkFile') {
    deliver = val.map((v) => v.name).join(',');
    parmasObj.value = val[0];
  } else if (type === 'uploadFile') {
    parmasObj.value = val;
    deliver = parmasObj.value.attributes.name;
  }
  // 遍历数据回显数据
  Data.list.forEach((e, i) => {
    if (i === isIndex.value) {
      e.subjectName = deliver;
      e.type = type;
      e.accessDialogObj = parmasObj.value;
    }
  });
  createType.value = type;
  Data.addObjectDialog = false;
};
const selectData = ref([]);
const tableSelect = (val) => {
  selectData.value = val;
};

/**编辑 */
const editOid = ref('');
// const editDeliverName = ref('');
const edit = () => {
  console.log(selectData.value, 228);
  Data.list.forEach((e) =>
    selectData.value.forEach((v) => {
      if (e.oid === v.oid) {
        e.isEdit = true;
      }
    }),
  );
  // if (selectData.value.length !== 1) return window.$message.warning('请选择一条数据编辑！');
  // editOid.value = selectData.value[0].oid;
  // Data.deliverName = selectData.value[0].name;
  // deliverTypeValue.value = selectData.value[0].deliverableType;
};

// 移除
const remove = () => {
  Data.tableLoad = true;

  let isCreatOrEdit = Data.list.some((v) => !v.oid || v.isEdit);
  if (isCreatOrEdit) {
    Data.list = Data.list.filter((e) => selectData.value.every((m) => m.oid !== e.oid));
    Data.tableLoad = false;
  } else {
    let str = selectData.value.map((v) => v.oid).join(',');
    api.planApi.deleteDeliverable({ oids: str }).then((res) => {
      if (res.success) {
        window.$message.success('删除成功');
        getDeliverData();
      } else {
        window.$message.error(res.message);
      }
      Data.addIndex = 0;
      editOid.value = '';
      selectData.value = [];
    });
  }
};

/**保存 */
const save = () => {
  let isInput = Data.list.some((e) => !(e.name && e.deliverableType) && e.isEdit);
  if (isInput) return window.$message.error('请填写必填数据！');
  Data.tableLoad = true;
  let newArr = Data.list.filter((v) => v.isEdit || !v.oid);
  let linkFile = {};
  let uploadFile = {};
  let parmasArr = [];
  let parmasObj = new FormData();
  newArr.forEach((e, i) => {
    let commonParmas = {
      activityOid: props.oid,
      deliverableName: e.name,
      deliverableType: e.deliverableType,
      operateUser: Data.userInfo.username,
      wcUser: Data.userInfo.thirdPartUser,
      deliverableOid: e.oid,
    };
    if (!e?.type || e?.type === 'linkFile') {
      linkFile = {
        ...commonParmas,
        objectOid: e?.accessDialogObj?.oidOrVid ? e?.accessDialogObj?.oidOrVid : '',
        operateUser: Data.userInfo.username,
      };
      parmasArr.push(linkFile);
    } else if (e?.type === 'uploadFile') {
      uploadFile = {
        ...commonParmas,
        docType: e?.accessDialogObj.type,
        docName: e?.accessDialogObj['attributes']['name'],
        folderOid: e?.accessDialogObj['attributes']['folder.id'],
        // file: e?.accessDialogObj['files'],
        fileName: i + '&&&' + e?.accessDialogObj['attributes']['name'],
        smallDocType: e?.accessDialogObj['attributes']['SmallDocType'],
      };
      parmasArr.push(uploadFile);
      parmasObj.append(uploadFile.fileName, e?.accessDialogObj.files);
    }
  });
  parmasObj.append('formData', JSON.stringify(parmasArr));
  api.planApi.batchCreateDeliverable(parmasObj).then((res) => {
    if (res.success) {
      window.$message.success('保存成功');
      getDeliverData();
    } else {
      window.$message.error(res.message);
    }
    Data.addIndex = 0;
    Data.tableLoad = false;
  });
};
/**
 * emit输出
 */
const emit = defineEmits(['update:close', 'confirm', 'updateDeliver']);

// const onEdit = (val, row) => {
//   Data.editIndex = val;
//   Data.tempName = row.name;
// };
// const onDelete = (id) => {
//   let delIndex = Data.list.findIndex((item) => item.id === id);
//   Data.list.splice(delIndex, 1);
// };
// const onCancel = () => {
//   if (!Data.list[Data.editIndex].id) {
//     Data.list.pop();
//   }
//   Data.editIndex = -1;
// };
// const onConfirm = () => {
//   Data.list[Data.editIndex].name = Data.tempName;
//   Data.editIndex = -1;
// };
// const onCheck = () => {};
</script>

<style lang="less" scoped>
.deliver {
  :deep(.el-button) {
    height: 24px;
    background: #386bd7;
    border-radius: 2px;
    padding: 0 9px;
  }
}
.table-box {
  margin-top: 20px;
  .upload-container {
    height: 25px;
    line-height: 27px;
  }
  .edit-input {
    // margin-left: -6px;
    :deep(.el-input__wrapper) {
      // padding-left: 6px;
    }
    :deep(.el-input__inner) {
      // height: 21.5px;
    }
  }
  .deleverName {
    display: flex;
    align-items: center;
  }
}
</style>

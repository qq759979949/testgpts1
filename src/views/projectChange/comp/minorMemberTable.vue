<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-10 16:12:07
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-11 11:54:08
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\projectChange\comp\attribute.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="minorMemberTable" v-loading="Data.minorLoading">
    <div class="btnFunc" v-if="isEdit">
      <el-button type="primary" @click="saveCheck" :loading="Data.isLoading">校验</el-button>
      <el-button @click="add">添加</el-button>
      <el-button @click="deleteData">移除</el-button>
      <!-- <el-button @click="cancelDeleteData">撤销移除</el-button> -->
    </div>
    <levelTable :columns="Data.minorMemberColumns" :tableData="Data.minorMemberTableData" :isCheckBox="true" @selectHandler="selectHandlerPackaging">
      <template #member="scope">
        <div v-if="scope.row.isDelete" class="text-line">{{ scope.row.member }}</div>
        <div v-else>{{ scope.row.member }}</div>
      </template>
      <template #depart="scope">
        <el-select v-model="scope.row.depart" class="m-2" placeholder="请选择" v-if="scope.row.departEdit && isEdit">
          <el-option v-for="item in Data.options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div v-else>{{ scope.row.depart }}</div>
      </template>
      <template v-for="(item, index) in Data.indexList" #[changeColumnName(index)]="scope" :key="index">
        <el-input
          v-model="scope.row[changeColumnName(index)]"
          @change="changeInput(scope.row, changeColumnName(index))"
          placeholder="请输入"
          oninput="value=value.replace(/[^0-9.]/g,'')"
          v-if="scope.row[`${changeColumnName(index)}Edit`] && isEdit"
        >
          <template #prefix v-if="scope.row[`${changeColumnName(index)}Change`]">
            <div class="input-triangle"></div>
          </template>
        </el-input>
        <div v-else>
          <div class="noChange" v-if="!scope.row[`${changeColumnName(index)}Change`]">{{ scope.row[changeColumnName(index)] }}</div>
          <div class="noChange hasChange" v-else>{{ scope.row[changeColumnName(index)] }}</div>
        </div>
      </template>
    </levelTable>
    <!-- 选择用户 -->
    <selectUser
      v-model:isShow="Data.isShow"
      :title="'添加成员'"
      :defaultProps="Data.defaultProps"
      :searchList="Data.userList"
      ref="selectUserModal"
      :loading="Data.loading"
      :allText="'近期使用'"
      @submit="submitSelected"
      :contentLoading="Data.contentLoading"
    ></selectUser>
  </div>
</template>
<script setup>
import levelTable from '@/views/projectInitiation/components/levelTable.vue';
import selectUser from '@/views/payPacket/components/selectUser.vue';
import { getAllUser } from '@/api/team.js';
const { proxy: that } = getCurrentInstance();
const router = useRouter();
const props = defineProps({
  // 表格是否可编辑
  isEdit: {
    type: Boolean,
    default: false,
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  projectOid: {
    type: String,
    default: '',
  }, // 项目oid
  phaseListMinor: {
    type: Array,
    default: () => [],
  }, // 阶段
  isCreate: {
    type: Boolean,
    default: false,
  }, // 是否为创建页面
});
const Data = reactive({
  minorMemberColumns: [
    {
      label: '',
      dataIndex: '',
      children: [
        {
          label: '成员',
          dataIndex: 'member',
          width: 160,
        },
        {
          label: '部门',
          dataIndex: 'depart',
          width: 160,
        },
      ],
    },
  ],
  minorMemberTableData: [],
  indexList: [], // 计划阶段
  options: [],
  isCheckMinor: false,
  selectData: [],
  isShow: false, //选择成员
  defaultProps: {
    key: 'id',
    label: 'pdcRealName',
    depart: 'department',
  },
  userList: [], //全量用户数据
  userInfo: JSON.parse(window.$Cookies.get('userInfo')),
  minorObj: {},
  loading: false,
  contentLoading: false,
  isLoading: false,
  canChangeList: {},
  minorLoading: false,
});
// 获取配包数据
const getMinorTableData = () => {
  Data.minorLoading = true;
  window.$api.projectChangeApi.queryChangeMemberInfoBuilder({ oid: props.projectOid, primary: 2 }).then((res) => {
    if (res.success) {
      const newData = res.data.map((item) => {
        const obj = {};
        obj.pdcUser = item.centerUser;
        obj.member = `${item.userName}`;
        obj.memberOid = item.memberOid;
        Data.indexList.forEach((i) => {
          obj.depart = item.department.value;
          obj.departEdit = false;
          // obj[`afterChange${i.dataIndex}Edit`] = item[`${i.dataIndex}Percent`].canEdit;
          // obj[`beforeChange${i.dataIndex}Edit`] = item[`${i.dataIndex}Percent`].canEdit;
          // if (item[`${i.dataIndex}Percent`].canEdit) {
          //   Data.minorObj[`afterChange${i.dataIndex}Edit`] = true;
          //   Data.minorObj[`beforeChange${i.dataIndex}Edit`] = true;
          obj[`afterChange${i.dataIndex}Edit`] = Data.canChangeList[`${i.dataIndex}Edit`];
          obj[`beforeChange${i.dataIndex}Edit`] = Data.canChangeList[`${i.dataIndex}Edit`];
          // }
          // Data.minorObj[`afterChange${i.dataIndex}Edit`] = item[`${i.dataIndex}Percent`].canEdit;
          // Data.minorObj[`beforeChange${i.dataIndex}Edit`] = item[`${i.dataIndex}Percent`].canEdit;
          if (obj[`afterChange${i.dataIndex}Edit`] && item[`${i.dataIndex}Percent`].displayValue !== '-') {
            obj[`afterChange${i.dataIndex}`] = item[`${i.dataIndex}Percent`].value;
            obj[`beforeChange${i.dataIndex}`] = item[`${i.dataIndex}Percent`].value;
          } else {
            obj[`afterChange${i.dataIndex}`] = item[`${i.dataIndex}Percent`].displayValue;
            obj[`beforeChange${i.dataIndex}`] = item[`${i.dataIndex}Percent`].displayValue;
          }
        });
        return obj;
      });
      Data.minorMemberTableData = newData;
      Data.minorLoading = false;
    } else {
      Data.minorLoading = false;
      window.$message.error(res.message);
    }
  });
};
// 获取配包各部门
const getDepart = () => {
  window.$api.payPacketApi.getSecondPackageWeightAndAmount({ oid: props.projectOid }).then((res) => {
    if (res.success) {
      Data.options = res.data.map((item) => {
        let obj = {};
        obj.label = item.department;
        obj.value = item.department;
        return obj;
      });
    }
  });
};
// 保存校验
const saveCheck = () => {
  const departs = Data.minorMemberTableData.map((item) => {
    return item.depart;
  });
  const params = {
    oid: props.projectOid,
    departments: departs.join(','),
  };
  window.$api.projectChangeApi.checkSecondMember(params).then((res) => {
    if (res.success) {
      let isCondition = true;
      let isFill = true;
      Data.isLoading = true;
      Data.indexList.forEach((i) => {
        Data.minorMemberTableData.forEach((it) => {
          if (typeof it[`afterChange${i.dataIndex}`] === 'undefined' || it[`afterChange${i.dataIndex}`] === '') {
            isFill = false;
          }
          if (it.depart === '') {
            isFill = false;
          }
        });
        let nameList = [];
        Data.minorMemberTableData.forEach((v) => {
          if (!nameList.includes(v.depart)) {
            nameList.push(v.depart);
            let newArr = Data.minorMemberTableData.filter((el) => v.depart === el.depart);
            if (newArr.length > 0) {
              let obj = {};
              obj[`${i.dataIndex}`] = newArr
                .map((item) => {
                  return Number(item[`afterChange${i.dataIndex}`]);
                })
                .filter((it) => !Number.isNaN(it));
              for (let i in obj) {
                if (obj[i].length !== 0) {
                  if (obj[i].reduce((accumulator, currentValue) => accumulator + currentValue) !== 100) {
                    isCondition = false;
                  }
                }
              }
            }
          }
        });
        // obj[`${i.dataIndex}`] = Data.minorMemberTableData.map((item) => {
        //   return Number(item[`afterChange${i.dataIndex}`]);
        // });
        // for (let i in obj) {
        //   if (obj[i].reduce((accumulator, currentValue) => accumulator + currentValue) !== 100) {
        //     isCondition = false;
        //   }
        // }
      });
      if (!isFill) {
        Data.isLoading = false;
        window.$message.error('请完善变更后的数据');
      } else {
        if (!isCondition) {
          Data.isLoading = false;
          window.$message.error('请检查各部门的权重');
        } else {
          Data.isLoading = false;
          window.$message.success('校验成功');
          Data.isCheckMinor = true;
        }
      }
    } else {
      window.$message.error(res.message);
    }
  });
};
// 移除数据
const deleteData = () => {
  if (Data.selectData.length > 0) {
    Data.selectData.forEach((it) => {
      if (it.memberOid) {
        Data.minorMemberTableData = Data.minorMemberTableData.map((item) => {
          if (item.member === it.member) {
            item.isDelete = true;
            Data.indexList.forEach((i) => {
              if (item[`afterChange${i.dataIndex}Edit`] === true) {
                item[`afterChange${i.dataIndex}`] = '-';
                item[`afterChange${i.dataIndex}Edit`] = false;
              }
              // item.departEdit = false; // 部门不可编辑
              // item[`afterChange${i.dataIndex}`] = '-';
              // item[`afterChange${i.dataIndex}Edit`] = false;
            });
          }
          return item;
        });
      } else {
        let newArr = [];
        Data.minorMemberTableData.forEach((e) => {
          if (e.member === it.member && !e.isDelete) {
          } else {
            newArr.push(e);
          }
        });
        Data.minorMemberTableData = newArr;
      }
    });
  } else {
    window.$message.error('请选择数据！');
  }
};
// 选中数据
const selectHandlerPackaging = (data) => {
  Data.selectData = data;
};
// 取消撤销
// const cancelDeleteData = () => {
//   if (Data.selectData.length > 0) {
//     let newD = Data.selectData.map((item) => {
//       return item.member;
//     });
//     Data.minorMemberTableData = Data.minorMemberTableData.map((item) => {
//       if (newD.includes(item.member)) {
//         // item.departEdit = true; // 部门可编辑
//         delete item.isDelete;
//         Data.indexList.forEach((i) => {
//           item[`afterChange${i.dataIndex}`] = item[`beforeChange${i.dataIndex}`];
//           item[`afterChange${i.dataIndex}Edit`] = item[`beforeChange${i.dataIndex}Edit`];
//         });
//       }
//       return item;
//     });
//   } else {
//     window.$message.error('请选择数据！');
//   }
// };
// 添加配包成员表格
const add = () => {
  Data.isShow = true;
  _getAllUser();
};
//获取全量用户  √
const _getAllUser = () => {
  Data.contentLoading = true;
  let params = {
    id: '',
    pageNo: 1,
    pageSize: 9999,
    thirdPartySystemId: 1,
  };
  getAllUser(params).then((res) => {
    if (res.success && res.data) {
      Data.contentLoading = false;
      Data.userList = res.data.contents
        .map((e) => {
          return {
            pdcUser: e.username, // 中台账号
            pdcRealName: e.realname, // 中文名
            wcUser: e.thirdSystemName, // windChill账号
            department: e.departmentName, // 部门  配包成员表格需要
            id: e.id,
            roleIdList: e.roleIdList, // 权限
          };
        })
        .filter((i) => i.id !== Data.userInfo.id);
    } else {
      Data.contentLoading = false;
      window.$message.error(res.message);
    }
  });
};
// 查询可变更的阶段
const changePhase = (val) => {
  window.$api.projectChangeApi.canChangePhasePercent({ oid: props.projectOid }).then((res) => {
    if (res.success) {
      Data.phaseChangeList = res.data.filter((item) => item.canEdit);
      Data.phaseChangeList = Data.phaseChangeList.map((item) => {
        return item.phaseName;
      });
      Data.indexList = val;
      const newData = Data.indexList.map((item) => {
        if (Data.phaseChangeList.includes(item.label)) {
          Data.canChangeList[`${item.dataIndex}Edit`] = true;
        }
        item.children = [
          {
            label: '变更前(权重)',
            dataIndex: `beforeChange${item.dataIndex}`,
          },
          {
            label: '变更后(权重)',
            dataIndex: `afterChange${item.dataIndex}`,
          },
        ];
        return item;
      });
      Data.minorMemberColumns = [...Data.minorMemberColumns, ...newData];
      if (router.currentRoute.value.name === 'createProjectChange') {
        getMinorTableData();
      }
    } else {
      window.$message.error;
    }
  });
};
// 提交选择的用户
const submitSelected = (userList) => {
  Data.loading = true;
  const newUserList = userList.map((item) => {
    return item.pdcUser;
  });
  let isAddPeople = true;
  Data.minorMemberTableData.forEach((it) => {
    if (!it.isDelete && newUserList.includes(it.pdcUser)) {
      isAddPeople = false;
    }
  });
  if (isAddPeople) {
    let list = userList.map((e) => {
      return {
        pdcUser: e.pdcUser,
        pdcRealName: e.pdcRealName,
        wcUser: e.wcUser,
        department: e.department,
        isPrimary: false,
      };
    });
    let params = new FormData();
    params.append('formData', JSON.stringify(list));
    params.append('oid', props.projectOid);
    params.append('actualUser', Data.userInfo.username);
    window.$api.projectChangeApi.checkAddUserRewards(params).then((res) => {
      if (res.success) {
        const newData = res.data.map((item) => {
          const obj = {};
          obj.member = `${item.userFullName}`;
          obj.depart = '';
          obj.isAdd = true;
          obj.wcUser = item.wcUser;
          obj.pdcUser = item.pdcUser;
          obj.department = item.department;
          obj.pdcRealName = item.userFullName;
          obj.departEdit = true;
          Data.indexList.forEach((i) => {
            obj[`afterChange${i.dataIndex}Edit`] = Data.canChangeList[`${i.dataIndex}Edit`];
            obj[`beforeChange${i.dataIndex}Edit`] = Data.canChangeList[`${i.dataIndex}Edit`];
            obj[`beforeChange${i.dataIndex}`] = '-';
            if (!obj[`afterChange${i.dataIndex}Edit`]) {
              obj[`afterChange${i.dataIndex}`] = '-';
            }
          });
          return obj;
        });
        Data.minorMemberTableData = [...Data.minorMemberTableData, ...newData];
        Data.isShow = false;
        Data.loading = false;
      } else {
        window.$message.error(res.message);
        Data.isShow = false;
        Data.loading = false;
      }
    });
  } else {
    Data.loading = false;
    window.$message.error('不可重复添加成员');
  }
};
onMounted(() => {
  getDepart();
});
watch(
  () => props.tableData,
  (val) => {
    if (val.length === 0) {
      getMinorTableData();
    } else {
      Data.minorMemberTableData = val;
    }
  },
);
watch(
  () => props.isEdit,
  () => {
    if (props.isCreate && !props.isEdit) {
      getMinorTableData();
    }
  },
);
watch(
  () => props.phaseListMinor,
  (val) => {
    changePhase(val);
  },
);
const changeColumnName = (index) => {
  return `afterChangephase${index + 1}`;
};
const changeInput = (scope, name) => {
  scope[`${name}Change`] = true;
};
defineExpose({
  Data,
});
</script>
<style scoped lang="less">
.minorMemberTable {
  .btnFunc {
    margin-bottom: 10px;
  }
  .input-triangle {
    position: absolute;
    top: 3%;
    left: 0px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0px 1px 8px 11px;
    border-color: transparent transparent #f68800 transparent;
    transform: rotate(180deg);
    border-radius: 30%;
  }
  :deep(.el-input-group--prepend > .el-input__wrapper) {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .noChange {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
  }
  .hasChange {
    color: #f02323;
  }
  .text-line {
    text-decoration: line-through;
    text-decoration-color: #333;
    text-decoration-skip-ink: auto;
    text-underline-position: line-through;
  }
}
</style>

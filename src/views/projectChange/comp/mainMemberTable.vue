<!--
 * @Author: wyq ywen@pisx.com
 * @Date: 2024-01-10 16:12:07
 * @LastEditors: wyq ywen@pisx.com
 * @LastEditTime: 2024-04-11 14:14:39
 * @FilePath: \P2023096-PX-SDLG-Frontend\src\views\projectChange\comp\attribute.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="mainMemberTable" v-loading="Data.mainLoading">
    <div class="btnFunc" v-if="isEdit">
      <el-button type="primary" @click="saveCheck" :loading="Data.isLoading">校验</el-button>
      <el-button @click="add">添加</el-button>
      <el-button @click="deleteData">移除</el-button>
      <!-- <el-button @click="cancelDeleteData">撤销移除</el-button> -->
    </div>
    <levelTable :columns="Data.mainMemberColumns" :tableData="Data.mainMemberTableData" :isCheckBox="true" @selectHandler="selectHandlerPackaging">
      <template #member="scope">
        <div v-if="scope.row.isDelete" class="text-line" v-html="scope.row.member"></div>
        <div v-html="scope.row.member" v-else></div>
      </template>
      <template v-for="(item, index) in Data.indexList" #[changeColumnName(index)]="scope" :key="index">
        <el-input
          v-model="scope.row[changeColumnName(index)]"
          @change="changeInput(scope.row, changeColumnName(index))"
          oninput="value=value.replace(/[^0-9.]/g,'')"
          placeholder="请输入"
          v-if="scope.row[`${changeColumnName(index)}Edit`] && isEdit && scope.row[changeColumnName(index)] !== '-'"
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
      :allText="'近期使用'"
      @submit="submitSelected"
      :contentLoading="Data.contentLoading"
      :loading="Data.loading"
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
  phaseListMain: {
    type: Array,
    default: () => [],
  }, // 阶段
  isCreate: {
    type: Boolean,
    default: false,
  }, // 是否为创建页面
});
const Data = reactive({
  mainMemberColumns: [
    {
      label: '',
      dataIndex: '',
      children: [
        {
          label: '成员(角色)',
          dataIndex: 'member',
          width: 160,
        },
      ],
    },
  ],
  mainMemberTableData: [],
  indexList: [], // 计划阶段
  isCheckMain: false,
  selectData: [],
  isShow: false, //选择成员
  // 用户列表的属性格式
  defaultProps: {
    key: 'id',
    label: 'pdcRealName',
    depart: 'department',
  },
  userList: [], //全量用户数据
  userInfo: JSON.parse(window.$Cookies.get('userInfo')),
  loading: false,
  contentLoading: false,
  isLoading: false,
  phaseChangeList: [],
  canChangeList: {},
  mainLoading: false,
});
// 获取阶段
// const getPhaseColumns = () => {
//   window.$api.payPacketApi.getPhaseNames({ oid: props.projectOid }).then((res) => {
//     if (res.success) {
//       Data.indexList = res.data;
//       const newData = res.data.map((item) => {
//         item.dataIndex = item.label;
//         item.label = item.name;
//         item.children = [
//           {
//             label: '变更前(权重)',
//             dataIndex: `beforeChange${item.dataIndex}`,
//           },
//           {
//             label: '变更后(权重)',
//             dataIndex: `afterChange${item.dataIndex}`,
//           },
//         ];
//         return item;
//       });
//       Data.mainMemberColumns = [...Data.mainMemberColumns, ...newData];
//       if (router.currentRoute.value.name === 'createProjectChange') {
//         getPrimaryTableData();
//       }
//     } else {
//       that.$message.error(res.message);
//     }
//   });
// };
// 获取主包数据
const getPrimaryTableData = () => {
  Data.mainLoading = true;
  window.$api.projectChangeApi.queryChangeMemberInfoBuilder({ oid: props.projectOid, primary: 1 }).then((res) => {
    if (res.success) {
      const newData = res.data.map((item) => {
        const obj = {};
        obj.pdcUser = item.centerUser;
        obj.member = `${item.userName}` + '<br/>' + `${item.userRole ? item.userRole : ''}`;
        obj.memberOid = item.memberOid;
        Data.indexList.forEach((i) => {
          obj[`afterChange${i.dataIndex}Edit`] = Data.canChangeList[`${i.dataIndex}Edit`];
          obj[`beforeChange${i.dataIndex}Edit`] = Data.canChangeList[`${i.dataIndex}Edit`];
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
      Data.mainMemberTableData = newData;
      Data.mainLoading = false;
    } else {
      Data.mainLoading = false;
      window.$message.error(res.message);
    }
  });
};
// 保存校验
const saveCheck = () => {
  let isCondition = true;
  let isFill = true;
  Data.isLoading = true;
  Data.indexList.forEach((i) => {
    let obj = {};
    Data.mainMemberTableData.forEach((it) => {
      if (typeof it[`afterChange${i.dataIndex}`] === 'undefined' || it[`afterChange${i.dataIndex}`] === '') {
        isFill = false;
      }
    });
    obj[`${i.dataIndex}`] = Data.mainMemberTableData
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
  });
  if (!isFill) {
    Data.isLoading = false;
    window.$message.error('请完善变更后的权重');
  } else {
    if (!isCondition) {
      Data.isLoading = false;
      window.$message.error('权重相加需满足等于100！');
    } else {
      Data.isLoading = false;
      window.$message.success('校验成功');
      Data.isCheckMain = true;
    }
  }
};
// 移除数据
const deleteData = () => {
  if (Data.selectData.length > 0) {
    Data.selectData.forEach((it) => {
      if (it.memberOid) {
        Data.mainMemberTableData = Data.mainMemberTableData.map((item) => {
          if (item.member === it.member) {
            item.isDelete = true;
            Data.indexList.forEach((i) => {
              if (item[`afterChange${i.dataIndex}Edit`] === true) {
                item[`afterChange${i.dataIndex}`] = '-';
                item[`afterChange${i.dataIndex}Edit`] = false;
              }
            });
          }
          return item;
        });
      } else {
        // Data.mainMemberTableData = Data.mainMemberTableData.filter((e) => e.member !== it.member);
        let newArr = [];
        Data.mainMemberTableData.forEach((e) => {
          if (e.member === it.member && !e.isDelete) {
          } else {
            newArr.push(e);
          }
        });
        Data.mainMemberTableData = newArr;
      }
      // let newD = Data.selectData.map((item) => {
      //   return item.member;
      // });
    });
  } else {
    window.$message.error('请选择数据！');
  }
};
// 取消撤销
// const cancelDeleteData = () => {
//   if (Data.selectData.length > 0) {
//     let newD = Data.selectData.map((item) => {
//       return item.member;
//     });
//     Data.mainMemberTableData = Data.mainMemberTableData.map((item) => {
//       if (newD.includes(item.member)) {
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
// 添加 主包成员表格
const add = () => {
  Data.isShow = true;
  _getAllUser();
};
// 提交选择的用户
const submitSelected = (userList) => {
  Data.loading = true;
  const newUserList = userList.map((item) => {
    return item.pdcUser;
  });
  let isAddPeople = true;
  Data.mainMemberTableData.forEach((it) => {
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
        isPrimary: true,
      };
    });
    let params = new FormData();
    params.append('formData', JSON.stringify(list));
    params.append('oid', props.projectOid);
    params.append('actualUser', Data.userInfo.username);
    window.$api.projectChangeApi.checkAddUserRewards(params).then((res) => {
      if (res.success) {
        const newData = res.data.map((item) => {
          item.userRole = item.roleNames ? item.roleNames.join('\n') : '';
          const obj = {};
          obj.member = `${item.userFullName}` + '<br/>' + `${item.userRole}`;
          obj.isAdd = true;
          obj.wcUser = item.wcUser;
          obj.pdcUser = item.pdcUser;
          obj.department = item.department;
          obj.pdcRealName = item.userFullName;
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
        Data.mainMemberTableData = [...Data.mainMemberTableData, ...newData];
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
onMounted(() => {
  // getPhaseColumns();
});
watch(
  () => props.tableData,
  (val) => {
    if (val.length === 0) {
      getPrimaryTableData();
    } else {
      Data.mainMemberTableData = val;
    }
  },
);
watch(
  () => props.isEdit,
  () => {
    if (props.isCreate && !props.isEdit) {
      getPrimaryTableData();
    }
  },
);
watch(
  () => props.phaseListMain,
  (val) => {
    changePhase(val);
    // }
  },
);
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
      Data.mainMemberColumns = [...Data.mainMemberColumns, ...newData];
      if (router.currentRoute.value.name === 'createProjectChange') {
        getPrimaryTableData();
      }
    } else {
      window.$message.error;
    }
  });
};
// 选中数据
const selectHandlerPackaging = (data) => {
  Data.selectData = data;
};
const changeColumnName = (index) => {
  return `afterChangephase${index + 1}`;
};
const changeInput = (scope, name) => {
  scope.isEdit = true;
  scope[`${name}Change`] = true;
};
defineExpose({
  Data,
});
</script>
<style scoped lang="less">
.mainMemberTable {
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

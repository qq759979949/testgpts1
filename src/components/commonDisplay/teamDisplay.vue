<template>
  <div class="section-container">
    <div class="role" v-for="(item, i) in showData" :key="item.id">
      <div class="roleName">
        <i class="iconfont ExpendIcon" @click="item.isExpand = !item.isExpand" :class="item.isExpand ? 'icon-yihangyige1' : 'icon-yihangyige'"></i>
        <span>{{ item.memberTypeName }}</span>
      </div>
      <transition name="slide-fade">
        <div class="userList clearfix" v-show="item.isExpand">
          <template v-for="user in item.projectUserBean" :key="user.userOid">
            <el-popover
              placement="top" 
              :width="220"
              trigger="click"
              v-if="!user.type"
              :ref="'popover_' + item.memberType + '_' + user.userOid"
            >
              <template #reference>
                <div 
                  class="user" 
                >
                  <img class="avatar" src="../../assets/img/avatar.jpg" alt="" srcset="">
                  <div class="main-info">
                    <div class="name">{{ user.name }}</div>
                    <div class="dep">{{ user.department }}</div>
                  </div>
                  <div class="right-role">
                    <div class="role">
                      {{ user.role }}
                    </div>
                    <div class="roleType">
                      {{ user.roleType }}
                    </div>
                  </div>
                </div>
              </template>
              <div class="popover-container">
                <div class="box-top">
                  <div>
                    <img class="avatar" src="../../assets/img/avatar.jpg" alt="" srcset="">
                    <span>{{ user.name }}</span>
                  </div>
                </div>
                <div class="box-bottom">
                  <div>
                    <span>部门：</span>{{ user.department }}
                  </div>
                  <div>
                    <span>邮箱：</span> {{ user.email }}
                  </div>
                  <div>
                    <span>主/配包：</span> {{ user.role }}
                  </div>
                  <div>
                    <span>成员类型：</span> {{ user.roleType }}
                  </div>
                  <div>
                    <span>项目分工：</span> {{ user.work }}
                  </div>
                </div>
              </div>
            </el-popover>
            <div 
              v-else
              class="group-box" 
            >
              <img class="avatar" src="../../assets/img/wenjianjia.png" alt="" srcset="">
              <div class="group-info" @click="viewGroup(user.userOid)">
                {{ user.name }}
              </div>
            </div>
          </template>
        </div>
      </transition>  
    </div>
  </div>
  <el-dialog
    title="用户组"
    :size="1080"
    v-model="isGroupMemberDialog"
    class="group-dialog"
  >
    <div class="header-box">
      <span class="header-text">共{{ groupMembers.length }}个对象</span>
      <el-input
        style="width:224px"
        :suffix-icon="Search"
        v-model="groupSearchVal"
        placeholder="请输入"/>
    </div>
    <div class="table-container">
      <PiTable
        :columns="groupColumns"
        :data="groupMembers_filter"
        :isShowSetting="false">
      </PiTable>
    </div>
  </el-dialog>
</template>

<script>
import * as _ from 'lodash'
import PiTable from '@/components/pdcCustom/PiTable.vue'
export default {
  name: 'teamDisplay',
  components: {
    PiTable
  },
  props: {
    source: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      showData: [],
      groupSearchVal: '',
      groupColumns: [
        {
          title: '名称',
          dataIndex: 'name',
          width: 200,
        },
        {
          title: '账号',
          dataIndex: 'userOid',
          idth: 180,
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          idth: 400,
        },
        {
          title: '部门',
          dataIndex: 'department',
          idth: 200,
        }
      ],
      groupMembers: [],
      groupSearchVal: '',
      isGroupMemberDialog: false
    }
  },
  watch: {
    source: {
      handler (val) {
        const data = _.cloneDeep(val)
        data.forEach(item => {
          item.isExpand = true
        })
        this.showData = data
      },
      immediate: true
    }
  },
  computed: {
    groupMembers_filter () {
      return this.groupMembers.filter(el => el.name.indexOf(this.groupSearchVal) > -1)
    },
  },
  methods: {
    viewGroup () {
      // 调接口查group
      this.groupSearchVal = ''
      this.isGroupMemberDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.section-container {
  .role {
    .roleName {
      font-size: var(--el-font-size-medium);
      line-height: 30px;
      font-weight: 600;
      margin-bottom: 6px;
      user-select: none;
      .ExpendIcon {
        font-size: var(--el-font-size-extra-small);
        margin-right: 12px;
        position: relative;
        top: -1px;
        cursor: pointer;
        font-weight: normal;
      }
    }
    .userList {
      .user {
        display: inline-flex;
        width: 250px;
        height: 66px;
        line-height: 20px;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        padding: 9px 12px 9px 20px;
        margin-right: 20px;
        margin-bottom: 16px;
        cursor: pointer;
        &:hover {
          border-color: var(--el-color-primary);
          .icon-btn {
            display: block;
          }
        }
        &.active {
          border-color: var(--el-color-primary);
          box-shadow: 0px 0px 12px var(--el-color-primary-light-5);
        }
        .avatar {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          margin-top: 5px;
        }
        .main-info {
          flex: 1;
          .name {
            
          }
          .dep {
            // float: right;
            color: #666;
          }
        }
        .right-role {
          font-size: var(--el-font-size-extra-small);
          text-align: center;
          line-height: 22px;
          .role {
            background-color: rgba(0, 179, 104, 0.1);
            height: 22px;
            padding: 0 5px;
            color: #00B368;
            border-radius: 8px;
          }
          .roleType {
            margin-top: 2px;
            background-color: rgba(56, 107, 215, 0.1);
            padding: 0 5px;
            color: #386BD7;
            height: 22px;
            border-radius: 8px;
          }
        }
        .icon-btn {
          float: right;
          display: none;
          transform: translateY(2px);
        }
      }
      .group-box {
        display: inline-flex;
        width: 250px;
        height: 66px;
        line-height: 20px;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        padding: 9px 12px 9px 12px;
        margin-right: 20px;
        margin-bottom: 16px;
        background: #FFFBE6;
        vertical-align: top;
        cursor: pointer;
        &:hover {
          border-color: #FFC53D;
          .icon-btn {
            display: block;
          }
        }
        &.active {
          border-color: #FFC53D;
          box-shadow: 0px 0px 12px var(--el-color-primary-light-5);
        }
        .avatar {
          width: 30px;
          height: 30px;
          margin-right: 10px;
          margin-top: 8px;
        }
        .group-info {
          flex: 1;
          line-height: 44px;
        }
        .btn-box {
          height: 100%;
          padding-top: 12px;
          .icon {
            font-size: var(--el-font-size-base);
          }
        }
      }
      .addBtn {
        width: 66px;
        height: 66px;
        display: inline-block;
        vertical-align: top;
        line-height: 66px;
        border-radius: 4px;
        border: 1px dashed var(--el-border-color);
        text-align: center;
        color: #666;
        cursor: pointer;
        .icon-jia {
          font-size: var(--el-font-size-extra-large);
        }
        &:hover {
          border-color: var(--el-color-primary);
        }
      }
    }
  }
}
.popover-container {
  padding: 2px 4px;
  .box-top {
    border-bottom: 1px dashed #ddd;
    padding: 2px 0 8px 0;
    display: flex;
    justify-content: space-between;
    .avatar {
      display: inline-block;
      vertical-align: middle;
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
    .func-btn {
      margin-top: 5px;
      cursor: pointer;
      .icon {
        font-size: var(--el-font-size-base);
      }
    }
  }
  .box-bottom {
    font-size: var(--el-font-size-extra-small);
    margin-top: 8px;
    div {
      margin-bottom: 4px;
      span {
        color: #999;
        width: 60px;
        display: inline-block;
      }
    }
  }
}
</style>
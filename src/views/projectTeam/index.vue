<template>
  <div class="projectTeam page_common">
    <el-affix :offset="100" v-if="isComponents === false">
      <div class="affixContain">
        <h3 class="MainTitle" v-if="isActionVisible">{{ $intl('teamList').d('团队列表') }}</h3>
        <div class="actionRow mb8 headerTitle">
          <div v-if="isActionVisible">
            <el-button v-permission="'/plmProject/EditPTeam'" type="primary" :loading="copyLoading" @click="showCopy">
              {{ $intl('copyOtherProject').d('从其他项目复制') }}
            </el-button>
            <el-button @click="showResource" :loading="loadLoading">{{ $intl('btn.peopleSearch').d('人员负载检索') }}</el-button>
            <el-button @click="showImportDialog" v-permission="'/plmProject/EditPTeam'">导入</el-button>
            <el-button @click="onExport" v-permission="'/plmProject/EditPTeam'">导出</el-button>
            <el-button @click="editRole" v-permission="'/plmProject/EditPTeam'">角色编辑</el-button>
            <el-dropdown class="ml12" trigger="click">
              <el-button>
                {{ $intl('btn.more').d('更多') }}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-button class="permissionBtnCss" command="e" @click="showAuthEdit" v-permission="'/plmProject/EditPTeam'">
                    {{ $intl('btn.permissionEdit').d('权限编辑') }}
                  </el-button>
                  <el-button class="permissionBtnCss" command="f" @click="showMemberChange">{{ $intl('btn.memberChange').d('成员变更记录') }}</el-button>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <el-input v-if="isActionVisible || isShowSearch" style="float: right; width: 224px" clearable :suffix-icon="Search" v-model="searchVal" placeholder="请输入搜索关键词" />
        </div>
      </div>
    </el-affix>
    <div class="affixContain" v-else>
      <h3 class="MainTitle" v-if="isActionVisible">{{ $intl('teamList').d('团队列表') }}</h3>
      <div class="actionRow mb8 headerTitle">
        <div v-if="isActionVisible">
          <el-button v-permission="'/plmProject/EditPTeam'" type="primary" :loading="copyLoading" @click="showCopy">{{ $intl('copyOtherProject').d('从其他项目复制') }}</el-button>
          <el-button @click="showResource" :loading="loadLoading">{{ $intl('btn.peopleSearch').d('人员负载检索') }}</el-button>
          <el-button @click="showImportDialog" v-permission="'/plmProject/EditPTeam'">导入</el-button>
          <el-button @click="onExport" v-permission="'/plmProject/EditPTeam'">导出</el-button>
          <el-button @click="editRole" v-permission="'/plmProject/EditPTeam'">角色编辑</el-button>
          <el-dropdown class="ml12" trigger="click">
            <el-button>
              {{ $intl('btn.more').d('更多') }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-button class="permissionBtnCss" command="e" @click="showAuthEdit" v-permission="'/plmProject/EditPTeam'">
                  {{ $intl('btn.permissionEdit').d('权限编辑') }}
                </el-button>
                <el-button class="permissionBtnCss" command="f" @click="showMemberChange">{{ $intl('btn.memberChange').d('成员变更记录') }}</el-button>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <el-input v-if="isActionVisible || isShowSearch" style="float: right; width: 224px" :suffix-icon="Search" clearable v-model="searchVal" placeholder="请输入搜索关键词" />
    </div>
    <div class="roleList" v-loading="loading">
      <template v-for="item in roleList_filter" :key="item.id">
        <div class="role" v-if="!isActionVisible ? item.members?.length : true">
          <div class="roleName">
            <i class="iconfont ExpendIcon" @click="item.isExpand = !item.isExpand" :class="item.isExpand ? 'icon-yihangyige1' : 'icon-yihangyige'"></i>
            <span>{{ item.roleName }}</span>
          </div>
          <transition name="slide-fade">
            <div class="userList clearfix" v-show="item.isExpand">
              <template v-for="user in item.members" :key="user.userIduserId">
                <el-popover placement="top" :width="220" trigger="click" v-if="!user.userGroup" :ref="'popover_' + item.roleId + '_' + user.memberId">
                  <template #reference>
                    <div class="user" :class="{ active: activedRole === item.roleId && activedMember === user.memberId }" @click="userClicked(user, item)">
                      <img class="avatar" src="../../assets/img/avatar.jpg" alt="" srcset="" />
                      <div class="main-info">
                        <div class="name">{{ user.realname }}</div>
                        <div class="dep">{{ user.department }}</div>
                      </div>
                      <div class="right-role">
                        <div class="role">
                          {{ packageType[user.packageType] }}
                        </div>
                        <div class="roleType">
                          {{ memberType[user.memberType] }}
                        </div>
                      </div>
                    </div>
                  </template>
                  <div class="popover-container">
                    <div class="box-top">
                      <div>
                        <img class="avatar" src="../../assets/img/avatar.jpg" alt="" srcset="" />
                        <span>{{ user.name }}</span>
                      </div>
                      <div class="func-btn" v-if="isActionVisible && isManager">
                        <el-space>
                          <el-tooltip content="替换">
                            <span class="iconfont icon-biangeng icon" @click="onReplace(user, item)"></span>
                          </el-tooltip>
                          <el-tooltip content="成员维护">
                            <span class="iconfont icon-bianji icon" @click="onEdit(user, item)"></span>
                          </el-tooltip>
                          <el-popconfirm placement="bottom-end" @confirm="deleteUser(user.memberId)" title="确认删除？">
                            <template #reference>
                              <span class="iconfont icon-shanchu1 icon"></span>
                            </template>
                          </el-popconfirm>
                        </el-space>
                      </div>
                    </div>
                    <div class="box-bottom">
                      <div>
                        <span>部门：</span>
                        {{ user.department }}
                      </div>
                      <div>
                        <span>邮箱：</span>
                        {{ user.email }}
                      </div>
                      <div>
                        <span>主/配包：</span>
                        {{ packageType[user.packageType] }}{{ user.packageType === 3 || !user.packageType ? '' : '成员' }}
                      </div>
                      <div>
                        <span>成员类型：</span>
                        {{ memberType[user.memberType] }}{{ user.memberType === 4 || !user.memberType ? '' : '成员' }}
                      </div>
                      <div>
                        <span>项目分工：</span>
                        {{ user.projectDuty }}
                      </div>
                    </div>
                  </div>
                </el-popover>
                <div v-else class="group-box" :class="{ active: activedRole === item.roleId && activedMember === user.userId }" @click="userClicked(user, item)">
                  <img class="avatar" src="../../assets/img/wenjianjia.png" alt="" srcset="" />
                  <div v-if="user.userGroupName.length > 16" class="group-info-overflow" @click="viewGroup(user)">
                    <el-tooltip :content="user.userGroupName" placement="top">
                      {{ user.userGroupName }}
                    </el-tooltip>
                  </div>
                  <div v-else class="group-info" @click="viewGroup(user)">
                    {{ user.userGroupName }}
                  </div>
                  <div class="btn-box" v-if="isActionVisible && isManager">
                    <el-space v-if="item.roleName !== '专业技术委员会成员' && item.roleName !== '专业技术委员会主任'">
                      <el-tooltip content="替换">
                        <!-- <span class="iconfont icon-biangeng icon" @click="onReplace(user, item.memberId)"></span> -->
                        <span class="iconfont icon-biangeng icon" @click="onReplace(user, item)"></span>
                      </el-tooltip>
                      <el-popconfirm placement="bottom-end" @confirm="deleteUser(user.memberId)" title="确认删除？">
                        <template #reference>
                          <span class="iconfont icon-shanchu1 icon"></span>
                        </template>
                      </el-popconfirm>
                    </el-space>
                  </div>
                </div>
              </template>
              <div class="addBtn" v-if="isActionVisible && isManager" @click="addUser(item)">
                <i class="iconfont icon-jia"></i>
              </div>
            </div>
          </transition>
        </div>
      </template>
    </div>
    <div
      class="context-menu"
      v-click-outside="onClickOutside1"
      v-show="showMenu1"
      :style="{
        top: menuPosition1.top,
        left: menuPosition1.left,
        zIndex: menuPosition1.zIndex,
      }"
    >
      <div class="menu-row" @click="goWindowProject">在新窗口打开页面</div>
    </div>
    <teamSelectedDialog
      :title="$intl('addMember').d('添加成员')"
      :allText="$intl('userList').d('用户列表')"
      v-model:isShow="isAddUserDialog"
      :departmentList="deptList"
      @submit="addUserConfirm"
      :btnLoading="btnLoading"
      :diaglogWidth="800"
      :isright="['产品开发类项目', '制造技术类项目', '信息技术类项目'].includes(projectType)"
      ref="addDialog"
      :showApply="true"
    >
      <template #top>
        <div class="roleRow mb16">
          <span>{{ $intl('role').d('角色') }}：</span>
          <el-select style="width: 420px" @change="changeSelectRole" v-model="currentRoleId">
            <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
          </el-select>
        </div>
      </template>
    </teamSelectedDialog>
    <editAuthDialog v-model:isShow="isEditAuth" @close="closeAuthDialog" :roleList="roleList"></editAuthDialog>
    <TransferBox
      v-model:isShow="isEditRole"
      :allList="allRoleList"
      :checkedList="editRoleList"
      :dataProps="{ key: 'roleId', label: 'roleName' }"
      @confirm="confirmRoleEdit"
    ></TransferBox>
    <teamSelectedDialog
      v-model:isShow="isReplaceDialog"
      :diaglogWidth="800"
      :isright="['产品开发类项目', '制造技术类项目', '信息技术类项目'].includes(projectType)"
      :btnLoading="btnLoading"
      :isSingle="true"
      :departmentList="deptList"
      :userInfo="activeObj"
      @submit="confirmReplace"
      title="替换成员"
    >
      <template #top>
        <div class="roleRow mb10">
          <span class="mr12">{{ $intl('role').d('角色') }}：</span>
          <el-select style="width: 272px" v-model="currentRoleId" disabled>
            <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
          </el-select>
        </div>
      </template>
    </teamSelectedDialog>
    <teamSelectedDialog
      v-model:isShow="isEditDialog"
      :diaglogWidth="600"
      :isright="['产品开发类项目', '制造技术类项目', '信息技术类项目'].includes(projectType)"
      :changeDisabled="true"
      :userInfo="activeObj"
      :btnLoading="btnLoading"
      @submit="confirmEdit"
      title="成员维护"
    >
      <template #top>
        <div class="roleRow mb10 ml10">
          <span class="row-label">{{ $intl('role').d('角色') }}：</span>
          <el-input v-model="currentRoleName" style="width: 272px" disabled></el-input>
        </div>
      </template>
    </teamSelectedDialog>
    <el-drawer title="复制其他项目团队" v-model="isCopyDrawer" :size="1000" class="drawerCopyOther">
      <div class="projectSearch">
        <div class="projectList">项目列表</div>
        <el-input style="width: 224px" v-model="projectSearchVal" :suffix-icon="Search" clearable placeholder="请输入搜索关键词" />
      </div>
      <div class="table-container">
        <PiTable :columns="projectColumns" :data="project_filter" singleSelect @selectionChange="changeSelect" :pagination="true" :isShowSetting="false">
          <template #projectName="scope">
            <el-link
              style="display: inline-block; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
              type="primary"
              @contextmenu.prevent.native="openMenuProject($event, scope.row)"
              :underline="false"
            >
              {{ scope.row.projectName }}
            </el-link>
          </template>
        </PiTable>
      </div>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelCopy">取消</el-button>
          <el-button type="primary" :loading="copyLoading" @click="confirmCopy">确认</el-button>
        </div>
      </template>
    </el-drawer>
    <el-drawer title="人员负载检索" v-model="isResourceDrawer" :size="1080" class="drawerCopyOther">
      <div class="projectSearch">
        <div class="projectList">人员列表</div>
        <el-input style="width: 220px" v-model="resourceSearchVal" clearable :suffix-icon="Search" placeholder="请输入搜索关键词" />
      </div>
      <div class="table-container">
        <PiTable :columns="resourceColumns" :data="membersList_filter" :pagination="true" :isShowSetting="false">
          <template #packageType="{ row }">
            <div v-html="row.packageType"></div>
          </template>
          <template #memberType="{ row }">
            <div v-html="row.memberType"></div>
          </template>
        </PiTable>
      </div>
      <!-- <template #footer>
        <div style="flex: auto">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="confirmClick">确认</el-button>
        </div>
      </template> -->
    </el-drawer>
    <el-dialog :title="currentGroupName" :size="1080" v-model="isGroupMemberDialog" class="group-dialog">
      <div class="header-box">
        <span class="header-text">共{{ groupMembers.length }}个对象</span>
        <el-input style="width: 224px" :suffix-icon="Search" v-model="groupSearchVal" placeholder="请输入" />
      </div>
      <div class="table-container">
        <PiTable :columns="groupColumns" :data="groupMembers_filter" :pagination="true" :isShowSetting="false"></PiTable>
      </div>
    </el-dialog>
    <el-dialog v-model="isMemberChange" :diaglogWidth="1080" class="group-dialog" title="成员变更记录">
      <div class="header-box">
        <span class="header-text">共{{ changeList.length }}个对象</span>
        <el-input style="width: 224px" :suffix-icon="Search" v-model="changeSearchVal" placeholder="请输入" />
      </div>
      <div class="table-container">
        <PiTable :columns="changeColumns" :data="changeList_filter" :pagination="true" height="500px" :isShowSetting="false">
          <template #userInfo="{ row }">{{ row.operationName }} ({{ row.operationUser }})</template>
          <template #operationResult="{ row }">
            <div v-html="row.operationResult"></div>
          </template>
        </PiTable>
      </div>
    </el-dialog>
    <UploadDialog title="导入团队" v-model:isShow="importDialogFlag" :isSingle="true" :singleFile="true" @submit="uploadSubmit"></UploadDialog>
  </div>
</template>

<script>
import { Search } from '@element-plus/icons-vue';
import { shallowRef } from 'vue';
import teamSelectedDialog from './teamSelectedDialog.vue';
import editAuthDialog from './editAuthDialog.vue';
import TransferBox from './transferBox.vue';
import PiTable from '@/components/pdcCustom/PiTable.vue';
import UploadDialog from '@/components/uploadDialog.vue';
import { useCommonHandler } from '@/hooks';
import * as _ from 'lodash';
import {
  listMember,
  removeMember,
  // roleList,
  memberChangeLog,
  addMember,
  editMember,
  replaceMember,
  getAllRoles,
  getAllDepartment,
  exportExcel,
  importExcel,
  bindProjectRole,
  listGroupUser,
  copyTeam,
  memberLoadFactor,
} from '@/api/team';
import { getProjectList } from '@/api/project';
export default {
  name: 'projectTeam',
  components: {
    teamSelectedDialog,
    TransferBox,
    editAuthDialog,
    PiTable,
    UploadDialog,
  },
  props: {
    isActionVisible: {
      type: Boolean,
      default: true,
    },
    //团队搜索框是否显示
    isShowSearch: {
      type: Boolean,
      default: false,
    },
    // 是否作为组件
    isComponents: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      Search: shallowRef(Search),
      searchVal: '',
      roleList: [
        // {
        //   roleName: '质量评审',
        //   roleId: '929345846907719680',
        //   members: [
        //     {
        //       userId: 1,
        //       username: 'ywen',
        //       realname: '文雅晴',
        //       department: 'IT研究所',
        //       email: '1234567@pisx.com',
        //       memberId: 13,
        //       memberType: 1,
        //       packageType: 1,
        //       projectDuty: '123',
        //       userGroup: false
        //     },
        //     {
        //       memberId: 14,
        //       userGroupId: 3123,
        //       userGroupName: '项目过程管控组',
        //       userGroup: true,
        //       groupMemberList: [
        //         {
        //           department: '运营',
        //           email: '',
        //           groupId: 12,
        //           image: '',
        //           realname: '梁爽',
        //           userId: 21331,
        //           username: 'sliang'
        //         }
        //       ]
        //     }
        //   ]
        // }
      ],
      allRoleList: [],
      allGroupList: [],
      allUserList: [],
      deptList: [],
      isAddUserDialog: false,
      copyLoading: false,
      loadLoading: false,
      selectProjectId: '',
      activedMember: '',
      activedRole: '',
      projectColumns: [
        {
          title: '项目名称',
          dataIndex: 'projectName',
        },
        {
          title: '重要度等级',
          dataIndex: 'importantLevel',
          width: 80,
        },
        {
          title: '项目经理',
          dataIndex: 'projectManager',
          width: 80,
        },
        {
          title: '所属研究所',
          dataIndex: 'projectGroupReference',
          width: 100,
        },
        {
          title: '米型',
          dataIndex: 'type',
          width: 120,
        },
        {
          title: '项目类型',
          dataIndex: 'projectType',
          width: 160,
        },
      ],
      projectSearchVal: '',
      projectList: [],
      selectProjectVal: [],
      isEditRole: false,
      isEditAuth: false,
      isCopyDrawer: false,
      currentRoleId: '', // 当前roleId
      currentRoleName: '', // 当前roleName
      currentGroupName: '',
      loading: false,
      isResourceDrawer: false,
      editRoleList: [],
      isReplaceDialog: false,
      isEditDialog: false,
      resourceColumns: [
        {
          title: '姓名',
          dataIndex: 'realname',
          width: 100,
        },
        {
          title: '工号',
          dataIndex: 'username',
          width: 100,
        },
        {
          title: '部门',
          dataIndex: 'department',
        },
        {
          title: '主/配包成员',
          dataIndex: 'packageType',
          width: 110,
        },
        {
          title: '成员类型',
          dataIndex: 'memberType',
          width: 110,
        },
        {
          title: '参与项目',
          dataIndex: 'participatingCount',
          width: 90,
        },
        {
          title: '参与项目经理',
          dataIndex: 'projectManagerCount',
          width: 110,
        },
        {
          title: '参与核心成员',
          dataIndex: 'coreMemberCount',
          width: 110,
        },
        {
          title: '参与一般成员',
          dataIndex: 'commonMemberCount',
          width: 110,
        },
        {
          title: '参与支持成员',
          dataIndex: 'otherMemberCount',
          width: 110,
        },
      ],
      membersList: [],
      resourceSearchVal: '',
      changeSearchVal: '',
      changeList: [],
      changeColumns: [
        {
          title: '操作时间',
          dataIndex: 'updateTime',
          width: 160,
        },
        {
          title: '操作',
          dataIndex: 'operationType',
          width: 60,
        },
        {
          title: '操作人',
          dataIndex: 'userInfo',
          width: 130,
        },
        {
          title: '操作说明',
          dataIndex: 'operationResult',
        },
      ],
      groupColumns: [
        {
          title: '名称',
          dataIndex: 'realname',
          width: 200,
        },
        {
          title: '账号',
          dataIndex: 'username',
          idth: 180,
        },
        {
          title: '邮箱',
          dataIndex: 'email',
        },
        {
          title: '部门',
          dataIndex: 'department',
          idth: 200,
        },
      ],
      isMemberChange: false,
      groupMembers: [],
      isGroupMemberDialog: false,
      groupSearchVal: '',
      memberType: {
        1: '核心',
        2: '一般',
        3: '支持',
        4: '其他',
      },
      packageType: {
        1: '主包',
        2: '配包',
        3: '其他',
      },
      activeObj: {},
      changeLogPage: 1,
      importDialogFlag: false,
      btnLoading: false,
      isManager: false,
      projectType: '', //项目类型
      projectOid: '',
      projectId: '',
      username: JSON.parse(window.$Cookies.get('userInfo')).username,
      menuPosition1: {
        top: 0,
        left: 0,
      },
      selectProject: [],
      showMenu1: false,
    };
  },
  created() {},
  mounted() {
    if (this.$route.query.oid) {
      this.projectOid = this.$route.query.oid;
      this.projectType = this.$route.query.projectType;
      this.projectId = this.$route.query.id;
    } else {
      this.projectOid = JSON.parse(sessionStorage.getItem('currentProject')).oid;
      this.projectType = JSON.parse(sessionStorage.getItem('currentProject')).type;
      this.projectId = JSON.parse(sessionStorage.getItem('currentProject')).id;
    }
    let singleProjectRole = JSON.parse(localStorage.getItem('singleProjectRole')) || ['a:a:a'];
    let buttonListRole = JSON.parse(localStorage.getItem('buttonList')) || ['a:a:a'];
    if (singleProjectRole.includes('/plmProject/EditPTeam') || buttonListRole.includes('/plmProject/EditPTeam')) {
      this.isManager = true;
    }
    // this.isManager = singleProjectRole.includes('/plmProject/EditPTeam') ? true : false; // 通过项目内的权限控制是否能编辑团队下的角色
    this.getProjectTeam();
    this.getDeptInfo();
  },
  computed: {
    groupMembers_filter() {
      return this.groupMembers.filter((el) => el.realname.indexOf(this.groupSearchVal) > -1 || el.username.indexOf(this.groupSearchVal) > -1);
    },
    membersList_filter() {
      return this.membersList.filter((el) => el.realname.indexOf(this.resourceSearchVal) > -1 || el.username.indexOf(this.resourceSearchVal) > -1);
    },
    changeList_filter() {
      return this.changeList.filter(
        (el) => el.operationResult.indexOf(this.changeSearchVal) > -1 || el.operationUser.indexOf(this.changeSearchVal) > -1 || el.operationName.indexOf(this.changeSearchVal) > -1,
      );
    },
    project_filter() {
      return this.projectList.filter(
        (el) => (el.projectName?.indexOf(this.projectSearchVal) > -1 || el.projectManager?.indexOf(this.projectSearchVal) > -1) && el.id !== this.projectId,
      );
    },
    roleList_filter() {
      const arr = [];
      const copyList = _.cloneDeep(this.roleList);
      if (this.searchVal) {
        copyList.forEach((role) => {
          if (role.roleName && role.roleName.includes(this.searchVal.trim())) {
            arr.push(role);
          } else {
            if (Array.isArray(role.members)) {
              const membersArr = [];
              role.members.forEach((member) => {
                if (member.realname) {
                  if (member.realname.includes(this.searchVal.trim())) {
                    membersArr.push(member);
                  }
                } else {
                  if (member.userGroup.includes(this.searchVal.trim())) {
                    membersArr.push(member);
                  }
                }
              });
              if (membersArr.length > 0) {
                role.members = membersArr;
                arr.push(role);
              }
            }
          }
        });
        return arr;
      } else {
        // console.log(this.roleList, 600);
        return this.roleList;
      }
    },
  },
  methods: {
    getProjectTeam() {
      this.loading = true;
      listMember({ projectId: this.projectId }).then((res) => {
        this.loading = false;
        if (res.success) {
          res.data.forEach((item) => {
            item.isExpand = true;
          });
          this.roleList = res.data;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    // 右键项目
    openMenuProject(event, item) {
      this.selectProject = [];
      this.selectProject.push(item);
      // if (event.pageY < 560) {
      this.menuPosition1.top = event.pageY - event.offsetY + 32 + 'px';
      this.menuPosition1.left = event.pageX + 'px';
      this.menuPosition1.zIndex = 10000;
      // } else {
      // projectData.menuPosition.top = event.pageY - event.offsetY - 292 + 'px';
      // projectData.menuPosition.left = event.pageX + 'px';
      // }
      this.showMenu1 = true;
    },
    async goWindowProject() {
      if (this.selectProject.length === 1) {
        let params = {
          projectOid: this.selectProject[0].oid,
          userName: this.username,
        };
        window.$api.commonApi.getProjectPermission(params).then((res) => {
          if (res.success) {
            if (res.data.length > 0) {
              window.open(`http://${window.location.host}/#/project/detail?oid=${this.selectProject[0].oid}&isNewWin=true`, '_blank');
            } else {
              window.$message.error('暂无该项目的权限');
            }
          }
        });
      } else {
        this.$message.error('请至少选择一个项目');
      }
    },
    onClickOutside1() {
      this.showMenu1 = false;
    },
    async getDeptInfo() {
      const params = {
        pageNo: 1,
        pageSize: 9999,
      };
      const departRes = await getAllDepartment(params);
      this.deptList = [];
      const parseChild = (list) => {
        list.forEach((item) => {
          const obj = {
            id: item.id,
            name: item.departmentName,
          };
          this.deptList.push(obj);
          if (item.children) {
            parseChild(item.children);
          }
        });
      };
      departRes.data.forEach((item) => {
        const obj = {
          id: item.id,
          name: item.departmentName,
        };
        this.deptList.push(obj);
        if (item.children) {
          parseChild(item.children);
        }
      });
    },
    onExport() {
      const params = {
        projectId: this.projectId,
      };
      exportExcel(params).then((res) => {
        if (res.status === 200) {
          const url = window.URL.createObjectURL(new Blob([res.data], { type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8` }));
          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = url;
          let patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*');
          let contentDisposition = decodeURI(res.headers['content-disposition']);
          let result = patt.exec(contentDisposition);
          let fileName = result[1];
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
        } else {
          this.$message.warning();
        }
      });
    },
    showImportDialog() {
      this.importDialogFlag = true;
    },
    uploadSubmit(file) {
      let data = new FormData();
      data.append('file', file[0].raw);
      data.append('projectId', this.projectId);
      importExcel(data).then((result) => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
          const res = JSON.parse(fileReader.result);
          // 后台信息
          if (res.success) {
            this.$notify({
              type: 'success',
              title: '确认：导入结果',
              message: res.data.join('<br/>'),
              dangerouslyUseHTMLString: true,
              customClass: 'width-notify',
              duration: 8000,
            });
            this.importDialogFlag = false;
            this.getProjectTeam();
          } else {
            this.$message.warning(res.message);
          }
        };
        fileReader.readAsText(result);
      });
    },
    userClicked(user, role) {
      this.activedRole = role.roleId;
      this.activedMember = user.memberId;
    },
    addUser(role) {
      this.isAddUserDialog = true;
      this.currentRoleId = role.roleId;
      this.currentRoleName = role.roleName;
      // console.log(this.$refs, 639);
      this.$nextTick(() => {
        this.$refs.addDialog.setProjectDuty(this.currentRoleName);
      });
    },
    addUserConfirm(selectData, form, isApply) {
      if (form && (form.packageType === 1 || form.packageType === 2) && !form.projectDuty) {
        this.$message.warning('团队成员为主包成员、配包成员时，项目分工必填');
      } else if (form) {
        // 有form是用户
        const membersArr = [];
        selectData.forEach((item) => {
          const membersInfo = {
            department: item.desc,
            email: item.email,
            image: item.image,
            memberType: form.memberType,
            packageType: form.packageType,
            projectDuty: form.projectDuty,
            userGroup: false,
            userId: item.id,
            realname: item.realname,
            username: item.username,
          };
          membersArr.push(membersInfo);
        });
        if (membersArr.length === 0) {
          return this.$message.warning('请选择最少一条！');
        }
        // if (membersArr.some((e) => e.memberType === null || e.packageType === '')) {
        //   return this.$message.warning('主/配包 和 成员类型必选！');
        // } // 去掉主 配包  ，成员类型 ，已改成后端校验
        this.btnLoading = true;
        const params = {
          projectId: this.projectId,
          roleId: this.currentRoleId,
          roleName: this.currentRoleName,
          members: membersArr,
        };
        addMember(params).then((res) => {
          if (res.success) {
            this.$message.success('操作成功！');
            if (!isApply) {
              this.isAddUserDialog = false;
              this.btnLoading = false;
              useCommonHandler._getRoleNamesByUserName(this.projectOid, this.username);
              this.getProjectTeam();
            } else {
              this.getProjectTeam();
              this.$refs.addDialog.emptySelect();
              this.btnLoading = false;
            }
          } else {
            this.btnLoading = false;
            this.$message.warning(res.message);
          }
        });
      } else {
        // 没有form 是group
        const membersArr = [];
        selectData.forEach((item) => {
          const membersInfo = {
            userGroup: true,
            userGroupId: item.id,
            userGroupName: item.name,
          };
          membersArr.push(membersInfo);
        });
        const params = {
          projectId: this.projectId,
          roleId: this.currentRoleId,
          roleName: this.currentRoleName,
          members: membersArr,
        };
        if (membersArr.length === 0) {
          return this.$message.warning('请选择最少一条！');
        }
        addMember(params).then((res) => {
          if (res.success) {
            this.$message.success('操作成功！');
            if (!isApply) {
              this.isAddUserDialog = false;
              this.getProjectTeam();
            } else {
              this.getProjectTeam();
              this.$refs.addDialog.emptySelect();
              this.isAddUserDialog = false;
            }
          } else {
            this.$message.warning(res.message);
            this.isAddUserDialog = false;
          }
        });
      }
    },
    changeSelectRole(val) {
      const obj = this.roleList.find((item) => item.roleId === val);
      this.currentRoleName = obj.roleName;
      this.$refs.addDialog.setProjectDuty(this.currentRoleName);
    },
    closeUpdate() {
      // 关闭要刷新列表
      this.getProjectTeam();
    },
    deleteUser(id) {
      removeMember({
        memberId: id,
      }).then((res) => {
        if (res.success) {
          this.$message.success('操作成功');
          this.getProjectTeam();
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    async editRole() {
      const params = {
        projectId: this.projectId,
        type: 2,
      };
      const res = await getAllRoles(params);
      this.allRoleList = res.data;
      const arr = [];
      this.allRoleList.forEach((item) => {
        if (item.bound) {
          arr.push(item);
        }
      });
      arr.sort((a, b) => a.order - b.order);
      this.editRoleList = arr;
      this.isEditRole = true;
    },
    confirmRoleEdit(roles) {
      roles.forEach((item, index) => {
        item.bound = true;
        item.order = index;
      });
      bindProjectRole(roles, this.projectId).then((res) => {
        if (res.success) {
          this.$message.success('操作成功');
          this.isEditRole = false;
          this.getProjectTeam();
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    showCopy() {
      // 获取项目列表
      this.copyLoading = true;
      this.selectProjectId = '';
      this.projectSearchVal = '';
      getProjectList({}).then((res) => {
        this.copyLoading = false;
        if (res.success) {
          this.projectList = res.data;
          this.isCopyDrawer = true;
        }
      });
    },
    changeSelect(val) {
      this.selectProjectId = val?.id;
    },
    cancelCopy() {
      this.isCopyDrawer = false;
    },
    confirmCopy() {
      if (!this.selectProjectId) {
        this.$message.warning('请选择项目！');
      } else {
        const params = {
          targetProjectId: this.projectId,
          sourceProjectId: this.selectProjectId,
        };
        this.copyLoading = true;
        copyTeam(params).then((res) => {
          this.copyLoading = false;
          if (res.success) {
            this.$message.success('操作成功');
            this.isCopyDrawer = false;
            this.getProjectTeam();
          } else {
            this.$message.warning(res.message);
          }
        });
      }
    },
    confirmEdit(list, form) {
      this.btnLoading = true;
      if ((form.packageType === 1 || form.packageType === 2) && !form.projectDuty) {
        this.$message.warning('团队成员为主包成员、配包成员时，项目分工必填');
      } else {
        const params = {
          id: this.activeObj.memberId,
          memberType: form.memberType,
          packageType: form.packageType,
          projectDuty: form.projectDuty,
          userId: this.activeObj.userId,
        };
        editMember(params).then((res) => {
          if (res.success) {
            this.$message.success('操作成功！');
            this.isEditDialog = false;
            useCommonHandler._getRoleNamesByUserName(this.projectOid, this.username);
            this.getProjectTeam();
            this.btnLoading = false;
          } else {
            this.$message.warning(res.message);
          }
        });
      }
    },
    onEdit(user, role) {
      this.activeObj = user;
      this.isEditDialog = true;
      this.currentRoleName = role.roleName;
      this.$refs[`popover_${this.activedRole}_${user.memberId}`][0].hide();
    },
    onReplace(user, role) {
      this.isReplaceDialog = true;
      this.activeObj = user;
      this.currentRoleName = role.roleName;
      this.currentRoleId = role.roleId;
      this.$refs[`popover_${this.activedRole}_${user.memberId}`][0].hide();
    },
    confirmReplace(selectData, form) {
      this.btnLoading = true;
      if (form && (form.packageType === 1 || form.packageType === 2) && !form.projectDuty) {
        this.$message.warning('团队成员为主包成员、配包成员时，项目分工必填');
      } else if (form) {
        // 有form是用户
        if (!selectData) {
          return this.$message.warning('请选择替换用户！');
        }
        const params = {
          roleId: this.currentRoleId,
          roleName: this.currentRoleName,
          memberType: form.memberType,
          packageType: form.packageType,
          projectDuty: form.projectDuty,
          projectId: this.projectId,
          userId: selectData,
        };
        replaceMember(params, this.activeObj.memberId).then((res) => {
          if (res.success) {
            this.$message.success('操作成功');
            this.isReplaceDialog = false;
            useCommonHandler._getRoleNamesByUserName(this.projectOid, this.username);
            this.getProjectTeam();
            this.btnLoading = false;
          } else {
            this.$message.warning(res.message);
          }
        });
      } else {
        this.btnLoading = true;
        // 没有form 是group
        if (!selectData) {
          return this.$message.warning('请选择替换用户组！');
        }
        const params = {
          roleId: this.currentRoleId,
          roleName: this.currentRoleName,
          projectId: this.projectId,
          userGroupId: selectData,
        };
        replaceMember(params, this.activeObj.memberId).then((res) => {
          if (res.success) {
            this.$message.success('操作成功');
            this.isReplaceDialog = false;
            useCommonHandler._getRoleNamesByUserName(this.projectOid, this.username);
            this.getProjectTeam();
            this.btnLoading = false;
          } else {
            this.$message.warning(res.message);
          }
        });
      }
    },
    viewGroup(group) {
      const params = {
        groupId: group.userGroupId,
      };
      this.currentGroupName = group.userGroupName;
      this.loading = true;
      listGroupUser(params).then((res) => {
        this.loading = false;
        if (res.data) {
          this.groupMembers = res.data;
          this.isGroupMemberDialog = true;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    showResource() {
      this.resourceSearchVal = '';
      const params = {
        projectId: this.projectId,
        pageNo: 1,
        pageSize: 9999,
      };
      this.loadLoading = true;
      memberLoadFactor(params).then((res) => {
        this.loadLoading = false;
        if (res.success) {
          const list = res.data.records;
          this.membersList = list;
          this.isResourceDrawer = true;
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    showAuthEdit() {
      this.isEditAuth = true;
    },
    closeAuthDialog() {
      this.isEditAuth = false;
    },
    showMemberChange() {
      const params = {
        projectId: this.projectId,
      };
      this.loading = true;
      memberChangeLog(params).then((res) => {
        this.loading = false;
        if (res.success) {
          this.isMemberChange = true;
          this.changeList = res.data ? res.data : [];
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
@import '@/assets/commonCss/common.less';
.projectTeam {
  padding-top: 0 !important;
  .MainTitle {
    font-weight: bold;
    margin-bottom: 8px;
  }
  .context-menu {
    position: fixed;
    z-index: 21;
    width: 160px;
    padding: 20px 12px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
    font-size: var(--el-font-size-small);
    .menu-row {
      margin-bottom: 12px;
      cursor: pointer;
    }
    .menu-row:hover {
      color: var(--el-color-primary);
    }
    .menu-row:last-child {
      margin-bottom: 0;
    }
  }

  .affixContain {
    padding-top: 20px;
    padding-bottom: 10px;
    background-color: #fff;
  }

  .headerTitle {
    display: flex;
    justify-content: space-between;
  }

  .roleList {
    min-height: 300px;
  }
  .role {
    .roleName {
      font-size: var(--el-font-size-medium);
      line-height: 30px;
      font-weight: 600;
      margin-bottom: 6px;
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
            line-height: 20px;
            padding: 0 5px;
            color: #00b368;
            border-radius: 8px;
            width: 64px;
          }
          .roleType {
            margin-top: 2px;
            background-color: rgba(56, 107, 215, 0.1);
            padding: 0 5px;
            line-height: 20px;
            color: #386bd7;
            height: 22px;
            border-radius: 8px;
            width: 64px;
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
        min-width: 250px;
        height: 66px;
        line-height: 20px;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        padding: 9px 12px 9px 12px;
        margin-right: 20px;
        margin-bottom: 16px;
        background: #fffbe6;
        vertical-align: top;
        cursor: pointer;
        &:hover {
          border-color: #ffc53d;
          .icon-btn {
            display: block;
          }
        }
        &.active {
          border-color: #ffc53d;
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
        .group-info-overflow {
          flex: 1;
          line-height: 44px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          margin-right: 5px;
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
        margin-bottom: 16px;
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
:deep(.group-dialog) {
  min-height: 480px;
  .header-box {
    text-align: right;
    margin-bottom: 10px;
    .header-text {
      margin-right: 12px;
    }
  }
}
:deep(.roleRow) {
  .row-label {
    width: 100px;
    display: inline-block;
  }
}
</style>
<style lang="scss">
.drawerCopyOther {
  .el-drawer__header {
    margin-bottom: 0px !important;
    padding-bottom: 13px;
  }
  .projectSearch {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .projectList {
      font-size: var(--el-font-size-medium);
      color: #333;
    }
  }
  .table-container {
    height: calc(100% - 42px);
  }
}
.memberChangeDialog {
  .memberChange {
    float: right;
    padding-bottom: 10px;
  }
}
.width-notify {
  --el-notification-width: 480px;
  word-wrap: break-word;
}
</style>

<template>
  <div class="edit-auth">
    <el-dialog
      v-model="isShowDialog"
      title="权限编辑"
      width="800"
      @close="close"
    >
      <div class="main-container">
        <div class="top-box">
          <span>角色：</span>
          <el-select
            v-model="roleVal"
            @change="changeRole"
          >
            <el-option
              v-for="item in roleList"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-select>
          <div class="tip-box"><span>已选权限</span><span class="grey">（共{{selectArr.length}}个）</span></div>
        </div>
        <div class="pi-table">
          <el-table
            :data="authList"
            ref="authTable"
            row-key="groupId"
            v-loading="isLoading"
            @selection-change="handleSelectionChange"
            style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="groupName" label="权限类别"/>
            <el-table-column prop="menuDesc" label="权限内容"/>
          </el-table>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirm" :loading="btnLoading">确定</el-button>
          <el-button type="primary" @click="submit" :loading="btnLoading">应用</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import {
  getMenuAuthList,
  bindProjectMenuGroup
} from '@/api/team'
export default {
  name: 'editAuthDialog',
  props: {
    isShow: {
      type: Boolean
    },
    roleList: {
      type: Array
    }
  },
  data () {
    return {
      authList: [],
      isShowDialog: false,
      roleVal: '',
      selectArr: [],
      isLoading: false,
      btnLoading: false,
    }
  },
  watch: {
    isShow (val) {
      this.isShowDialog = val
      if (val) {
        if (!this.roleVal && this.roleList.length > 0) {
          this.roleVal = this.roleList[0].roleId
          const params = {
            projectId: JSON.parse(sessionStorage.getItem('currentProject')).id,
            roleId: this.roleVal,
            type: 2
          }
          this.isLoading = true
          getMenuAuthList(params).then(res => {
            this.isLoading = false
            if (res.success) {
              this.authList = res.data
              this.selectArr = []
              this.authList.forEach(item => {
                if (item.bound) {
                  this.selectArr.push(item)
                  this.$nextTick(() => {
                    this.$refs.authTable.toggleRowSelection(item, true)
                  })
                }
              })
            }
          })
        } else if (this.roleVal) {
          const params = {
            projectId: JSON.parse(sessionStorage.getItem('currentProject')).id,
            roleId: this.roleVal,
            type: 2
          }
          this.isLoading = true
          getMenuAuthList(params).then(res => {
            this.isLoading = false
            if (res.success) {
              this.authList = res.data
              this.selectArr = []
              this.authList.forEach(item => {
                if (item.bound) {
                  this.selectArr.push(item)
                  this.$nextTick(() => {
                    this.$refs.authTable.toggleRowSelection(item, true)
                  })
                }
              })
            }
          })
        }
      }
    }
  },
  methods: {
    confirm () {
      this.btnLoading = true;
      const params = {
        roleId: this.roleVal,
        menuGroupList: this.selectArr
      }
      this.isLoading = true
      bindProjectMenuGroup(params, JSON.parse(sessionStorage.getItem('currentProject')).id).then(res => {
        this.isLoading = false
        if (res.success) {
          this.$message.success('操作成功！')
          this.$emit('close')
          this.$emit('update:isShow', false)
          this.btnLoading = false;
        } else {
          this.$message.error(res.message);
          this.btnLoading = false;
        }
      })
    },
    close () {
      this.$emit('update:isShow', false)
    },
    submit () {
      this.btnLoading = true;
      const params = {
        roleId: this.roleVal,
        menuGroupList: this.selectArr
      }
      this.isLoading = true
      bindProjectMenuGroup(params, JSON.parse(sessionStorage.getItem('currentProject')).id).then(res => {
        this.isLoading = false
        if (res.success) {
          this.$message.success('操作成功！')
          this.btnLoading = false;
        } else {
          this.$message.error(res.message);
          this.btnLoading = false;
        }
      })
    },
    handleSelectionChange (val) {
      this.selectArr = val
    },
    changeRole (val) {
      const params = {
        projectId: JSON.parse(sessionStorage.getItem('currentProject')).id,
        roleId: val,
        type: 2
      }
      this.isLoading = true
      getMenuAuthList(params).then(res => {
        this.isLoading = false
        if (res.success) {
          this.authList = res.data
          this.selectArr = []
          this.authList.forEach(item => {
            if (item.bound) {
              this.selectArr.push(item)
              this.$nextTick(() => {
                this.$refs.authTable.toggleRowSelection(item, true)
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.main-container {
  min-height: 320px;
}
.edit-auth {
  .top-box {
    margin: 10px 0 12px 0;
    .tip-box {
      float: right;
      .grey {
        color: #999;
      }
    }
  }
}
</style>
<style lang="scss">
.pi-table {
  .el-table {
    --el-table-header-bg-color: #f6f6f6;
    --el-table-header-text-color: #333;
  }
}
</style>
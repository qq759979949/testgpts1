import router from '@/router';
const api = window.$api;
const userInfo = JSON.parse(window.$Cookies.get('userInfo') || '');
const useDetailHandler = {
  /**
   * 文件右键以及详情操作菜单权限方法
   * @param {*} type 类型
   * @param {*} disbaleData 数据对象
   * @param {*} isManage 是否是管理员
   * @param {*} username 当前用户
   * @param {*} projectTypeStatus 项目类型
   * @returns
   */

  actionMenuDisabledFun(type, disbaleData, isManage, username, projectTypeStatus) {
    switch (type) {
      case 'edit':
        if (disbaleData?.isCheckout || (disbaleData?.displayState !== '正在工作' && disbaleData?.displayState !== '重新工作')) {
          return true;
        }
        break;
      case 'download':
        break;
      case 'startApprove':
        if (disbaleData?.isCheckout || (disbaleData?.displayState !== '正在工作' && disbaleData?.displayState !== '重新工作') || projectTypeStatus) {
          return true;
        }
        break;
      case 'delete':
        if (disbaleData?.isCheckout) {
          return true;
        } else {
          if (isManage) {
            if (
              disbaleData?.displayState !== '正在工作' &&
              disbaleData?.displayState !== '重新工作' &&
              disbaleData?.displayState !== '已发布' &&
              disbaleData?.displayState !== '废止'
            ) {
              return true;
            } else {
              return false;
            }
          } else {
            if (disbaleData?.displayState !== '正在工作' && disbaleData?.displayState !== '重新工作') {
              return true;
            } else {
              return false;
            }
          }

          // return false;
        }
        // if (disbaleData?.isCheckout || (disbaleData?.displayState !== '正在工作' && disbaleData?.displayState !== '重新工作')) {
        //   return true;
        // }
        break;
      case 'revise':
        if (disbaleData?.isCheckout || disbaleData?.displayState !== '已发布') {
          return true;
        }
        break;
      case 'copy':
        return true;
        break;
      case 'move':
        if (disbaleData?.isCheckout || (disbaleData?.displayState !== '正在工作' && disbaleData?.displayState !== '重新工作')) {
          return true;
        }
        break;
      case 'checkIn':
        if (!disbaleData?.isCheckout) {
          return true;
        }
        break;
      case 'checkOut':
        if (disbaleData?.isCheckout || (disbaleData?.displayState !== '正在工作' && disbaleData?.displayState !== '重新工作')) {
          return true;
        }
        break;
      case 'revokeCheckout':
        if (disbaleData?.isCheckout) {
          if (isManage) {
            return false;
          } else {
            if (username === disbaleData?.actualLockUser) {
              return false;
            } else {
              return true;
            }
          }
        } else {
          return true;
        }
      // break;
      case 'setState':
        if (disbaleData?.isCheckout) {
          return true;
        }
        break;
      case 'revokeTask':
        return true;
        break;
      case 'approve':
        if (disbaleData?.isCheckout || (disbaleData?.displayState !== '正在工作' && disbaleData?.displayState !== '重新工作')) {
          return true;
        }
        break;
      case 'rename':
        if (disbaleData?.isCheckout || (disbaleData?.displayState !== '正在工作' && disbaleData?.displayState !== '重新工作')) {
          return true;
        }
        break;

      default:
        break;
    }
  },

  /**
   * 判断当前用户是否是管理员
   */
  async checkUser(name) {
    let isManage = null;
    await api.commonApi.getGroupNamesByUserName({ userName: name }).then((res) => {
      if (res.success) {
        if (res.data.includes('站点管理员')) {
          isManage = true;
        } else {
          isManage = false;
        }
      }
    });
    return isManage;
  },

  /**
   * 检出方法
   * @param {*} checkData 被检出数据
   */
  async checkOutFun(checkData, callback, loadFun) {
    await window.$ElMessageBox
      .confirm('确定要检出勾选数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(async () => {
        let parmasStr = checkData.map((e) => e.oid).join(',');
        await api.fileApi.checkoutObj({ oids: parmasStr, actualLockUser: userInfo.username }).then((res) => {
          if (res?.success) {
            window.$message.success('检出成功！');
            callback && callback();
          } else {
            window.$message.error(res.message);
          }
        });
      })
      .catch(() => {
        /**取消的时候把load去掉 */
        loadFun && loadFun();
      });
  },

  /**
   * 修订方法
   * @param {*} dataArr 被修订数据
   * @param {*} type 是否需要二次弹框
   */
  async revise(dataArr, type, callback) {
    if (type) {
      await window.$ElMessageBox
        .confirm('是否确定修订该交付物！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(async () => {
          await this.reviseApiFun(dataArr);
          callback && callback();
        })
        .catch(() => {});
    } else {
      await this.reviseApiFun(dataArr);
      callback && callback();
    }
  },
  async reviseApiFun(dataArr) {
    let parmasStr = dataArr.map((e) => e.oid).join(',');
    await api.fileApi.reviseObj({ oids: parmasStr }).then((res) => {
      if (res?.success) {
        window.$message.success('修订成功！');
      } else {
        window.$message.error(res.message);
      }
    });
  },

  /**
   * 删除文件
   * @param {*} deleteData
   * @returns
   */
  async delete(deleteData, callback) {
    let isAdmin = await this.checkUser(userInfo.username);
    let parmasStr = deleteData.map((e) => e.oid).join(',');
    await window.$ElMessageBox
      .confirm('确定要删除勾选的数据？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(async () => {
        await api.fileApi.deleteDocument({ oids: parmasStr, isAdmin: isAdmin ? 'true' : 'false' }).then((res) => {
          if (!res?.success) return window.$message.error(res.message);
          callback && callback();
        });
      })
      .catch(() => {
        callback && callback('cancel');
      });
  },

  /**
   * 启动流程
   * @param {*} approveData
   */
  goApprove(approveData) {
    api.commonApi.checkStarProcess({ oid: approveData.oid, processTemplate: 'SDLG_DocWF' }).then((res) => {
      if (res.success) {
        window.$ElMessageBox
          .confirm('是否启动文档签审？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(() => {
            router.push({ name: 'fileApprove', query: { oid: approveData.oid } });
          })
          .catch(() => {
            console.log(212);
          });
      } else {
        window.$message.error(res.message);
      }
    });
  },
};
export default useDetailHandler;

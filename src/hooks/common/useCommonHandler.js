import { ElMessage } from 'element-plus';

const $api = window.$api;

const useCommonHandler = {
  /**
   * 下载权限
   * @param {*} objOid
   * @param {*} oid
   * @param {*} fileName
   */
  downloadPermissions(objOid, oid, fileName) {
    $api.commonApi
      .getDownloadPermissions({ oid: objOid })
      .then((res) => {
        if (res.success) {
          $api.detailApi.downloadFile({ oid }).then((res) => {
            this.download(res, fileName);
          });
        } else {
          ElMessage.error(res.msg || '当前账号没有下载权限！');
        }
      })
      .catch(() => {
        ElMessage.error('服务器错误');
      });
  },
  /**
   * 下载
   * @res 接口返回的数据流
   * @fileName {string} 要下载的附件的名称（含后缀名）
   */
  download(res, fileName) {
    let dotIndex = fileName.lastIndexOf('.'); //找到后缀名的.
    let name = fileName.substring(0, dotIndex); //文件名
    let type = fileName.substring(dotIndex + 1, fileName.length); //文件类型
    const types = {
      txt: 'text/plain;',
      zip: 'application/zip',
      pdf: 'application/pdf',
      xls: 'application/vnd.ms-excel;',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
      doc: 'application/msword;',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;',
    };

    const blob = new Blob([res], { type: types[fileName[1]] }); //生成下载链接
    const link = document.createElement('a'); //创建标签
    link.href = URL.createObjectURL(blob); //复制下载路径
    link.download = name + '.' + type; //下载的文件名
    document.body.appendChild(link); //插入dom树
    link.click(); //点击下载
    document.body.removeChild(link); //移出dom树
  },

  /*
    列表状态的颜色和对应的背景色
  */
  getColor(state) {
    let bgcolor = '';
    let colors = '';
    switch (state) {
      case '正在工作':
      default:
        bgcolor = '#eaf4ff';
        colors = '#287bff';
        break;
      case '提交审阅':
        bgcolor = '#FEF5EF';
        colors = '#F4AB7C';
        break;
      case '正在审阅':
        bgcolor = '#FEF5EF';
        colors = '#F4AB7C';
        break;
      case '已发布':
        bgcolor = '#E6FAF2';
        colors = '#14D17F';
        break;
      case '已批准':
        bgcolor = '#E6FAF2';
        colors = '#14D17F';
        break;
      case '重新工作':
        bgcolor = '#FFF8E6';
        colors = '#F9C128';
        break;
    }
    return `background-color:${bgcolor};color:${colors}`;
  },
  /*
    获取在当前项目中的角色  oid:当前项目oid , 用户名
  */
  _getRoleNamesByUserName(oid, username) {
    let params = {
      projectOid: oid,
      userName: username,
    };
    window.$api.commonApi.getRoleNamesByUserName(params).then((res) => {
      if (res.success) {
        let currentProjectRole = res?.data;
        localStorage.setItem('currentProjectRole', JSON.stringify(currentProjectRole));
      } else {
        localStorage.setItem('currentProjectRole', JSON.stringify(['空']));
        window.$message.error(res.message);
      }
    });
  },
};
export default useCommonHandler;

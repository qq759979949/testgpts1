import axios from 'axios';
import { rsaDecryptByPublicKey, rsaPublicData } from '@/utils/rsa.js';
import Aes from '@/utils/aes.js';
import { useUserStore } from '@/stores';
import { ElMessage } from 'element-plus';
// import Cookies from 'js-cookie';

const request = axios.create({
  timeout: 300000, // 请求超时,
});
const fileRequest = axios.create({
  timeout: 300000, // 请求超时,
});
// 异常拦截处理器
const errorHandler = (error) => {
  ElMessage({
    message: error.message,
    type: 'error',
  });
  return Promise.reject(error);
};

let showMsg = true;

/**
  // 用于存储pending的请求的数组（处理多条相同请求）
  const pendingRequest = new Map();
  // 生成request的唯一key
  const generateRequestKey = (config = {}) => {
    // 通过url，method，params，data生成唯一key，用于判断是否重复请求
    // params为get请求参数，data为post请求参数
    const { url, method, params, data } = config;
    return [url, method, Qs.stringify(params), Qs.stringify(data)].join('&');
  };
  // 将重复请求添加到pendingRequest中
  const addPendingRequest = (config) => {
    const key = generateRequestKey(config);
    const controller = new AbortController();
    config.signal = controller.signal;
    if (!pendingRequest.has(key)) {
      // 如果当前请求不在等待中，将其添加到等待中
      pendingRequest.set(key, controller);
    }
  };
  // 取消重复请求
  const removePendingRequest = (config) => {
    const key = generateRequestKey(config);
    if (pendingRequest.has(key)) {
      // 如果当前请求在等待中，取消它并将其从等待中移除
      const abortController = pendingRequest.get(key);
      if (abortController) {
        abortController.abort();
      }
      pendingRequest.delete(key);
    }
  };
*/

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  /**
    //取消重复请求的问题
    removePendingRequest(config);
    addPendingRequest(config);
   */
  if (config.url == '/oauth/login') {
    // 只有登录接口加密
    let randomKey = Aes.randomString(32);
    let paramsData = Aes.encryptAes(JSON.stringify(config.data), randomKey);
    let encrypttoken = rsaPublicData(randomKey);
    config.data = paramsData;
    config.headers['encrypttoken'] = encrypttoken;
    config.headers['encrypt'] = true;
  }
  //携带平台系统标识
  config.headers['System-Name'] = 'Pi-Diginn'; // 要改成一样才能公用token
  const userStore = useUserStore();
  config.headers.Authorization = userStore.authorToken || window.$Cookies.get('Admin-Token') || undefined;
  return config;
}, errorHandler);

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    /**
     * removePendingRequest(response.config);
     */
    const headers = response.headers;
    headers['content-disposition'] && sessionStorage.setItem('downloadName', headers['content-disposition']); //批量下载的文件名
    headers['refresh-token'] && window.$Cookies.set('Admin-Token', headers['refresh-token']); //替换新的token
    const data = response.data;
    // console.log(data, 49);
    // 解密data
    if (response.headers.encrypt === 'true') {
      let AesKey = rsaDecryptByPublicKey(response.headers.encrypttoken);
      response.data = Aes.decryptAes(data.data, AesKey);
    }
    //token过期自动退出登录
    if (data.code == 401 && showMsg) {
      if (showMsg) {
        ElMessage({
          message: data.message.includes('Token') ? '请重新登录！' : data.message,
          type: 'error',
        });
        showMsg = false;
        setTimeout(() => {
          showMsg = true;
        }, 3000);
      }
      const userStore = useUserStore();
      userStore.logout();
      return;
    } else if (data.code == 500 && data.message?.includes('503')) {
      data.message = '503 服务器在重启，请稍后再试！';
      data.exception = '503 服务器在重启，请稍后再试！';
    }
    return data;
  },
  (error) => {
    if (error.response && error.response.data) {
      if (showMsg) {
        const code = error.response.status;
        const msg = error.response.data.message;
        window.$message.error(`Code: ${code}, Message: ${msg}`);
        showMsg = false;
        setTimeout(() => {
          showMsg = true;
        }, 3000);
      }
    } else {
      //取消接口的情况无需把错误抛出
      error.code !== 'ERR_CANCELED' && window.$message.error(`${error}`);
    }
    return Promise.reject(error);
  },
);

fileRequest.interceptors.request.use(function (config) {
  if (config.url == '/oauth/login') {
    // 只有登录接口加密
    let randomKey = Aes.randomString(32);
    let paramsData = Aes.encryptAes(JSON.stringify(config.data), randomKey);
    let encrypttoken = rsaPublicData(randomKey);
    config.data = paramsData;
    config.headers['encrypttoken'] = encrypttoken;
    config.headers['encrypt'] = true;
  }

  //携带平台系统标识
  config.headers['System-Name'] = 'Pi-Diginn'; // 要改成一样才能公用token
  const userStore = useUserStore();
  config.headers.Authorization = userStore.authorToken || window.$Cookies.get('Admin-Token') || undefined;
  return config;
}, errorHandler);
fileRequest.interceptors.response.use(
  function (response) {
    const headers = response.headers;
    headers['refresh-token'] && window.$Cookies.set('Admin-Token', headers['refresh-token']); //替换新的token
    const data = response.data;
    // 解密data
    if (response.headers.encrypt === 'true') {
      let AesKey = rsaDecryptByPublicKey(response.headers.encrypttoken);
      response.data = Aes.decryptAes(data.data, AesKey);
    }
    // if (data.code === 401) {
    //   location.href = "/#/login";
    //   return;
    // }
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      if (showMsg) {
        const code = error.response.status;
        const msg = error.response.data.message;
        window.$message.error(`Code: ${code}, Message: ${msg}`);
        showMsg = false;
        setTimeout(() => {
          showMsg = true;
        }, 3000);
      }
    } else {
      //取消接口的情况无需把错误抛出
      error.code !== 'ERR_CANCELED' && window.$message.error(`${error}`);
    }
    return Promise.reject(error);
  },
);

export { request, fileRequest };

/**
 * post请求
 * @param {string} url
 * @param {object} data
 * @param {object} params
 * @param {object} headers
 */
export function post(url, params, headers) {
  return request({
    method: 'post',
    url,
    data: params,
    headers: headers || {
      'Content-Type': 'application/json;charset=UTF-8',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

/**
 * 导出常用
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function upload(url, params) {
  return request({
    method: 'post',
    url,
    data: params,
    responseType: 'blob',
    headers: {
      'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
    },
  });
}
// get导出
export function getExport(url, params) {
  return request({
    method: 'get',
    url,
    data: params,
    responseType: 'blob',
  });
}

/**
 * 下载常用
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function download(url, params, headers) {
  return request({
    method: 'post',
    url,
    data: params,
    responseType: 'blob',
    headers: headers || {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 * 文件预览常用
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function filePreview(url, params) {
  return request({
    method: 'post',
    url,
    data: params,
    responseType: 'blob',
  });
}

/**
 * get请求
 * @param {string} url
 * @param {object} params
 * @param {object} headers
 */
export function get(url, params, headers) {
  return request({
    method: 'get',
    url,
    params: params,
    headers: headers || {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * put请求
 * @param {string} url
 * @param {object} data
 * @param {object} params
 */
export function put(url, params) {
  return request({
    method: 'put',
    url,
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

/**
 * 删除请求
 * @param {string} url
 * @param {object} params
 */
export function _delete(url, params) {
  return request({
    method: 'delete',
    url,
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}

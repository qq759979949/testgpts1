import { PLM_BASE_URL } from '@/api/url';
import { post, get } from '@/utils/request';

const loginApi = {
  login(parameter) {
    return post('/oauth/login', parameter);
  },

  getOauthUser(parameter) {
    return get('/api/v1/oauth2/oauth2Login', parameter);
  },

  getTokenByUsername(parameter) {
    return get('/api/v1/wechat/getToken', parameter);
  },

  Oauthlogout(parameter) {
    return post('/oauth/logoutUserOauth', parameter);
  },

  logout(parameter) {
    return get('/oauth/logout', parameter);
  },

  getIntegrationUser(parameter) {
    return post(`${PLM_BASE_URL}/fdprincipal/getIntegrationUser`, parameter);
  },
  // 获取用户菜单权限
  findMenuByUser(parameter) {
    return get(`/oauth/user/findMenuByUser`, parameter);
  },
  // 获取用户按钮权限
  findButtonByUser(parameter) {
    return get(`/oauth/user/findButtonByUser`, parameter);
  },

  // 根据token获取用户登录信息
  loginByToken(parameter) {
    return get(`/oauth/loginByToken`, parameter);
  },
  // 单点登录未获取token时获取的数据http://192.168.3.230:9100/oauth/iam/getLoginUrl
  getLoginUrl(parameter) {
    return get(`/oauth/iam/getLoginUrl`, parameter);
  },
};
export default loginApi;

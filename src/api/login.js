import { PLM_BASE_URL } from '@/api/url';
import { post, get } from '@/utils/request';
export function login(parameter) {
  return post('/oauth/login', parameter);
}

export function getOauthUser(parameter) {
  return get('/api/v1/oauth2/oauth2Login', parameter);
}

export function getTokenByUsername(parameter) {
  return get('/api/v1/wechat/getToken', parameter);
}

export function Oauthlogout(parameter) {
  return post('/oauth/logoutUserOauth', parameter);
}

export function logout(parameter) {
  return get('/oauth/logout', parameter);
}

export function getIntegrationUser(parameter) {
  return post(`${PLM_BASE_URL}/fdprincipal/getIntegrationUser`, parameter);
}

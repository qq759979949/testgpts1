import { PLM_BASE_URL } from '@/api/url'
import { post, get, download, upload, put } from '@/utils/request'
const headers = {
  "Content-Type": "application/x-www-form-urlencoded",
}

export function getRiskListForLibrary(parameter) {
  return post(`${PLM_BASE_URL}/slnrisk/getRiskListForLibrary`, parameter, headers)
}

export function getRisks(parameter) {
  // return post('/project/pipdc/pmgt/risk/getRisks', parameter)
  return post(`${PLM_BASE_URL}/slnrisk/getProjectRiskList`, parameter, headers)
}

export function deleteObj(parameter) {
  // return post('/project/pipdc/pdm/core/deleteObjForAllVersion', parameter)
  return post(`${PLM_BASE_URL}/slnrisk/deleteProjectRisk`, parameter, headers)
}

export function exportProjects(parameter) {
  return download('/project/pipdc/pmgt/project/exportProjects', parameter)
}

export function getRiskType(parameter) {
  return post(`${PLM_BASE_URL}/slnrisk/getRiskType`, parameter, headers)
}

export function getResources(parameter) {
  return post(`${PLM_BASE_URL}/slnrisk/getResources`, parameter, headers)
}

export function pagingSearchUser(parameter) {
  return post(`${PLM_BASE_URL}/fdprincipal/pagingSearchUser`, parameter, headers)
}

export function saveRisk(parameter) {
  // return post('/project/pipdc/pmgt/risk/save', parameter, {'Content-Type':'multipart/form-data'})
  return post(`${PLM_BASE_URL}/fdform/createObject`, parameter, headers)
}
export function saveEditRisk(parameter) {
  // return post('/project/pipdc/pmgt/risk/save', parameter, {'Content-Type':'multipart/form-data'})
  return post(`${PLM_BASE_URL}/fdform/editObject`, parameter, headers)
}
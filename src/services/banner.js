
import { stringify } from 'qs';
import request from '@/utils/request';


export async function getAllBanner() {
  return request('/server/banner/getAllBanner');
}
//
// export async function addOrUpdateAdmin(params) {
//   return request('/server/admin/addOrUpdateAdmin', {
//     method: 'POST',
//     body: params,
//   });
// }
// export async function checkAdminName(params) {
//   return request(`/server/admin/checkAdminName?${stringify(params)}`);
// }
//
// export async function getQueryAdminData(params) {
//   return request(`/server/admin/getAllAdminData?${stringify(params)}`);
// }
//
//
// export async function getAdminById(params) {
//   return request(`/server/admin/getAdminById?${stringify(params)}`);
// }
//

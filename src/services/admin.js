
import { stringify } from 'qs';
import request from '@/utils/request';



export async function addAdmin(params) {
  return request('/server/admin/addOrUpdateAdmin', {
    method: 'POST',
    body: params,
  });
}
export async function checkAdminName(params) {
  return request(`/server/admin/checkAdminName?${stringify(params)}`);
}


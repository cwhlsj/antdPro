import { stringify } from 'qs';
import request from '@/utils/request';


export async function accountLogin(params) {
  return request('/server/admin/login', {
    method: 'POST',
    body: params,
  });
}
//

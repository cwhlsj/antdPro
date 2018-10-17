
import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import {  addAdmin ,checkAdminName} from '@/services/admin';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'admin',

  state: {

  },

  effects: {

    *addOrUpdateAdmin({admin},{call,put}){

      const response=yield call(addAdmin, admin);
      if(response.code===1)
        yield put(routerRedux.push('/admin/adminList'))
    },

    },

  reducers: {

    test(state, { param }) {
      // setAuthority(payload.currentAuthority);
      return {
        ...state,
        ...param
      };
    },
  },
};

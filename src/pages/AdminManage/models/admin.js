import { queryRule, removeRule, addRule, updateRule } from '@/services/api';
import {  addOrUpdateAdmin ,checkAdminName,getQueryAdminData,getAdminById} from '@/services/admin';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import * as routerRedux from 'react-router-redux';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'admin',

  state: {
    data: {
      list: [],
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1
      },
    },
    adminProps:{
      id:undefined,
      name: undefined,
      password: undefined,
      account: undefined,
      phone: undefined,
      email: undefined,
      description: undefined,
      authority: undefined,
      status:undefined
    }
  },

  effects: {

    *deleteAdmin({payload},{call,put}){
      const response=yield call(addOrUpdateAdmin, payload.admin);
      if(response.code===1){

        yield put({
          type:'getQueryAdminData',
          payload:payload.formValues
        })
      }

    },

    *addOrUpdateAdmin({admin},{call,put}){
      const response=yield call(addOrUpdateAdmin, admin);
        if(response.code===1)
          yield put(routerRedux.push('/admin/adminList'))

    },

    *getQueryAdminData({payload},{call,put}){

      const response = yield call(getQueryAdminData, payload);
      const pagination={
        total: response.data.total,
        pageSize: response.data.pageSize,
        current: response.data.pageIndex
      }
      const sendData={
        list: response.data.list,
        pagination:pagination
      }
      yield put({
        type: 'save',
        payload: sendData,
      });
     },

    *getAdminById({payload},{call,put}){

      const response = yield call(getAdminById, payload);

      if(response.code===1){
        yield put({
          type:'updateAdminProps',
          payload:response.data
        })
      }

    },


  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    updateAdminProps(state, action) {
      return {
        ...state,
        adminProps: action.payload,
      };
    },
  },
};

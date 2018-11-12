import { queryRule, removeRule, addRule, updateRule } from '@/services/api';
import {  getAllBanner,editBanner} from '@/services/banner';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import * as routerRedux from 'react-router-redux';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'banner',

  state: {
    data: [],
    adminProps:{
      id:null,
      name: null,
      password: null,
      account: null,
      phone: null,
      email: null,
      description: null,
      authority: null,
      status:null
    }
  },

  effects: {

    *getAllBanner(_,{call,put}){
      const response=yield call(getAllBanner);

      if(response.code===1){
          yield put({
            type:'setBannerData',
            payload:response.data,
          })
        }
    },

    *edit({payload},{call,put}){

      const response=yield call(editBanner,payload);
      if(response.code===1){
          yield put({
            type:'getAllBanner',
          })
        }
    },


  },

  reducers: {
    setBannerData(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    // updateAdminProps(state, action) {
    //   return {
    //     ...state,
    //     adminProps: action.payload,
    //   };
    // },
  },
};

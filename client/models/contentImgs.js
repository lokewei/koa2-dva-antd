import { query, groupList, delImgItem } from '../services/contentImgs'
import { routerRedux } from 'dva/router';
import _ from 'lodash'

export default {
  namespace: 'contentManage/contentImgs',
  state: {
    loading: false,
    optMessage: '',
    messageShowing: false,
    messageType: 'info',
    imageDatas: [], // [{ID, type, file_name, file_origin_name, path}]
    groupDatas: [],
    allChecked: false, // 全选按钮
    currentGroup: 0,
    checkedImgs: {
      /*
      {ID: {
        checked: true|false,
        nameEditing: true|false,
        nameEditingValue:xxx,
        groupChanging: true|false,
        deleting: true|false}
      }
      */
    },
    pagination: {

    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/contentManage/contentImgs') {
          dispatch({
            type: 'init',
            payload: location.query
          })
        }
      })
    }
  },
  effects: {
    *init({ payload }, { put, call }) {
      yield put({ type: 'showLoading' });
      const currentGroup = parseInt(payload.groupId, 10);
      if (!isNaN(currentGroup)) {
        yield put({ type: 'switchGroupSuccess', payload: currentGroup });
      }
      const { data: data } = yield call(query, payload);
      const { data: groupData } = yield call(groupList);
      if (data) {
        yield put({
          type: 'setImageDatas',
          payload: data
        });
      }
      if (groupData) {
        yield put({
          type: 'setGroupDatas',
          payload: groupData
        });
      }
      yield put({ type: 'initSuccess' });
    },
    *checkAll({ payload }, { put }) {
      if (payload === true) {
        yield put({
          type: 'allChecked'
        });
      } else {
        yield put({
          type: 'allUnchecked'
        });
      }
    },
    *queryImgs({ payload }, { put, call }) {
      yield put({ type: 'showLoading' });
      const { data } = yield call(query, payload);
      if (data) {
        yield put({
          type: 'setImageDatas',
          payload: data
        })
      }
      yield put({ type: 'hideLoading' });
    },
    *delImgItem({ payload }, { put, call }) {
      yield put({ type: 'showLoading' });
      const data = yield call(delImgItem, payload);
      if (data) {
        yield put({
          type: 'changeMessageShow',
          payload: {
            showing: true,
            messageType: data.success ? 'success' : 'error',
            message: data.message
          }
        });
      }
      // 重新拉一次图片列表回来
      const { data: imgData } = yield call(query, payload);
      if (data) {
        yield put({ type: 'setImageDatas', payload: imgData });
      }
      yield put({ type: 'hideLoading' });
      yield put({ type: 'changeMessageShow', payload: { showing: false } });
    },
    *switchGroup({ payload }, { put }) {
      yield put(routerRedux.push({
        pathname: '/contentManage/contentImgs',
        query: {
          groupId: payload
        }
      }))
    },
    *createGroup({ payload }, { put }) {
      // yield 
    }
  },
  reducers: {
    allChecked(state) {
      _.forOwn(state.checkedImgs, (record) => {
        record.checked = true;
      })
      return {
        ...state,
        allChecked: true
      }
    },
    allUnchecked(state) {
      _.forOwn(state.checkedImgs, (record) => {
        record.checked = false;
      })
      return {
        ...state,
        allChecked: false
      }
    },
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    changeMessageShow(state, { payload }) {
      const { showing, message, messageType } = payload;
      return {
        ...state,
        messageShowing: showing,
        messageType,
        optMessage: message
      }
    },
    initSuccess(state) {
      return { ...state, loading: false };
    },
    setImageDatas(state, action) {
      const imageDatas = action.payload;
      const checkedImgs = {};
      imageDatas.forEach((record) => {
        const preStat = checkedImgs[record.ID] || {};
        checkedImgs[record.ID] = {
          checked: false,
          nameEditing: false,
          nameEditingValue: record.file_origin_name,
          groupChanging: false,
          deleting: false,
          ...preStat
        }
      });
      return { ...state, checkedImgs, imageDatas };
    },
    delImgItemSuccess(state, action) {
      const id = action.payload;
      // state.imageDatas.for
    },
    setGroupDatas(state, action) {
      const groupDatas = action.payload;
      return { ...state, groupDatas };
    },
    checkImgItem(state, { payload }) {
      state.checkedImgs[payload.ID].checked = payload.checked;
      return {
        ...state
      }
    },
    switchGroupSuccess(state, { payload }) {
      return {
        ...state,
        currentGroup: payload
      }
    }
  }
}

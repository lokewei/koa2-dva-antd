import { query, groupList } from '../services/contentImgs'

export default {
  namespace: 'contentManage/contentImgs',
  state: {
    loading: false,
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
      const data = yield call(query, payload);
      const groupData = yield call(groupList);
      if (data && groupData) {
        yield put({
          type: 'initSuccess',
          payload: {
            data,
            groupData
          }
        })
      }
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
    *query({ payload }, { put, call }) {
      yield put({ type: 'showLoading' });
      const data = yield call(query, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: data
        })
      }
    }
/*    *switchGroup({ payload }, { put, call }) {

    }*/
  },
  reducers: {
    allChecked(state) {
      return {
        ...state,
        allChecked: true
      }
    },
    allUnchecked(state) {
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
    initSuccess(state, action) {
      const { data: { data: imageDatas }, groupData: { data: groupDatas } } = action.payload;
      const checkedImgs = {};
      imageDatas.forEach((record) => {
        checkedImgs[record.ID] = {
          checked: false,
          nameEditing: false,
          nameEditingValue: record.file_origin_name,
          groupChanging: false,
          deleting: false
        }
      });
      return { ...state, checkedImgs, imageDatas, groupDatas, loading: false };
    },
    switchGroup(state, { payload }) {
      return {
        ...state,
        currentGroup: payload
      }
    }
  }
}

import { query, create, update, remove } from '../services/contents'

export default {
  namespace: 'contentManage/contents',
  state: {
    list: [],
    loading: false,
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    conditions: {},
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/contentManage/contents') {
          dispatch({
            type: 'query',
            payload: location.query
          })
        }
      })
    }
  },
  effects: {
    *query({ payload }, { put, call }) {
      yield put({ type: 'showLoading' });
      yield put({ type: 'setConditions', payload });
      const data = yield call(query, payload);
      if (data) {
        yield put({
          type: 'setListDatas',
          payload: {
            list: data.data,
            pagination: data.page
          }
        })
      }
      yield put({ type: 'hideLoading' });
    },
    *'delete'({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const result = yield call(remove, payload);
      if (result && result.success) {
        const conditions = yield select((state) => state['contentManage/contents'].conditions);
        const data = yield call(query, conditions);
        if (data && data.success) {
          yield put({
            type: 'setListDatas',
            payload: {
              list: data.data
            }
          })
        }
      }
      yield put({ type: 'hideLoading' });
    },
    *create({ payload }, { call, put, select }) {
      yield put({ type: 'hideModal' })
      yield put({ type: 'showLoading' })
      const result = yield call(create, payload)
      if (result && result.success) {
        const conditions = yield select((state) => state['contentManage/contents'].conditions);
        const data = yield call(query, conditions);
        if (data && data.success) {
          yield put({
            type: 'setListDatas',
            payload: {
              list: data.data
            }
          })
        }
      }
      yield put({ type: 'hideLoading' });
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' })
      yield put({ type: 'showLoading' })
      const id = yield select((state) => state['contentManage/contents'].currentItem.type_id)
      const newRecord = { ...payload, type_id: id }
      const result = yield call(update, newRecord)
      if (result && result.success) {
        const conditions = yield select((state) => state['contentManage/contents'].conditions);
        const data = yield call(query, conditions);
        if (data && data.success) {
          yield put({
            type: 'setListDatas',
            payload: {
              list: data.data
            }
          })
        }
      }
      yield put({ type: 'hideLoading' });
    }
  },
  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    showModal(state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },
    hideModal(state) {
      return { ...state, modalVisible: false }
    },
    setConditions(state, action) {
      const { payload: conditions } = action;
      return { ...state, conditions };
    },
    setListDatas(state, action) {
      return { ...state, ...action.payload };
    }
  }
}

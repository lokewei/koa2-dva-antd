import { query, create, update, remove } from '../services/contentTypes'

export default {
  namespace: 'contentManage/contentTypes',
  state: {
    list: [],
    loading: false,
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
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
        if (location.pathname === '/contentManage/contentTypes') {
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
    *'delete'({ payload }, { call, put }) {
      yield put({ type: 'showLoading' })
      const data = yield call(remove, { id: payload })
      if (data && data.success) {
        yield put({
          type: 'setListDatas',
          payload: {
            list: data.data,
            pagination: {
              total: data.page.total,
              current: data.page.current
            }
          }
        })
      }
    },
    *create({ payload }, { call, put }) {
      yield put({ type: 'hideModal' })
      yield put({ type: 'showLoading' })
      const data = yield call(create, payload)
      if (data && data.success) {
        yield put({
          type: 'setListDatas',
          payload: {
            list: data.data,
            pagination: {
              total: data.page.total,
              current: data.page.current
            }
          }
        })
      }
    },
    *update({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' })
      yield put({ type: 'showLoading' })
      const id = yield select((state) => state['contentManage/contentTypes'].currentItem.type_id)
      const newUser = { ...payload, id }
      const data = yield call(update, newUser)
      if (data && data.success) {
        yield put({
          type: 'setListDatas',
          payload: {
            list: data.data,
            pagination: {
              total: data.page.total,
              current: data.page.current
            }
          }
        })
      }
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
    setListDatas(state, action) {
      return { ...state, ...action.payload };
    }
  }
}

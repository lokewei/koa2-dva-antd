export default {
  namespace: 'contentManage/contentImgs',
  state: {
    imageDatas: [],
    allChecked: false, // 全选按钮
    pagination: {

    }
  },
  subscriptions: {
    setup({ dispatch }) {

    }
  },
  effects: {
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
    }
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
    }
  }
}

export default {
  namespace: 'contentManage/contentImgs',
  state: {
    imageDatas: [{ID: 1, file_name: 'aaaa', file_origin_name: '小图片.jpg'}],    // [{ID, type, file_name, file_origin_name, path}]
    allChecked: false, // 全选按钮
    checkedImgs: {},   // {ID: true|false}
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

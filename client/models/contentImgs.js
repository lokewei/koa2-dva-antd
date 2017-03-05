import { query, groupList, delImgItem,
  delImgItems, changeGroup, createGroup,
  renameGroup, deleteGroup } from '../services/contentImgs'
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
    indeterminate: false, // 模糊选择
    currentGroup: { ID: 0, group_name: '全部图片', cb_del: 0, count: 0 },
    newGroupName: '',
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
        const currentGroupId = parseInt(payload.groupId, 10);
        if (!isNaN(currentGroupId)) {
          const currentGroup = _.find(groupData, (record) => record.ID === currentGroupId);
          if (!_.isEmpty(currentGroup)) {
            yield put({ type: 'switchGroupSuccess', payload: currentGroup });
          }
        }
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
    *createGroup({ payload }, { put, call }) {
      yield put({ type: 'showLoading' });
      yield call(createGroup, payload);
      const { data: groupData } = yield call(groupList);
      if (groupData) {
        yield put({
          type: 'setGroupDatas',
          payload: groupData
        });
        yield put({
          type: 'changeNewGroupName',
          payload: ''
        })
      }
      yield put({ type: 'hideLoading' });
    },
    *delImgItems({ payload }, { put, call, select }) {
      yield put({ type: 'showLoading' });
      const checkedImgs = yield select((state) => state['contentManage/contentImgs'].checkedImgs);
      const ids = [];
      _.forOwn(checkedImgs, (record, id) => {
        if (record.checked === true) {
          ids.push(id);
        }
      });
      yield call(delImgItems, ids.join());
      yield put({ type: 'hideLoading' });
    },
    *changeGroup({ ids, groupId }, { put, call }) {
      yield put({ type: 'showLoading' });
      yield call(changeGroup, ids, groupId);
      yield put({ type: 'hideLoading' });
    },
    *renameGroup({ id, name }, { put, call }) {
      yield put({ type: 'showLoading' });
      const res = yield call(renameGroup, id, name);
      if (res.success) {
        yield put({ type: 'renameGroupSuccess', id, name })
      }
      yield put({ type: 'hideLoading' });
    },
    *deleteGroup({ id }, { put, call }) {
      yield put({ type: 'showLoading' });
      const res = yield call(deleteGroup, id);
      if (res.success) {
        yield put({
          type: 'delGroupSuccess',
          id
        })
      }
      yield put({ type: 'hideLoading' });
    }
  },
  reducers: {
    allChecked(state) {
      _.forOwn(state.checkedImgs, (record) => {
        record.checked = true;
      })
      return {
        ...state,
        allChecked: true,
        indeterminate: false
      }
    },
    allUnchecked(state) {
      _.forOwn(state.checkedImgs, (record) => {
        record.checked = false;
      })
      return {
        ...state,
        allChecked: false,
        indeterminate: false
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
    delGroupSuccess(state, { id }) {
      _.remove(state.groupDatas, (record) => {
        return record.ID === id
      });
      return state;
    },
    renameGroupSuccess(state, { id, name }) {
      state.groupDatas.forEach((record) => {
        if (record.ID === id) {
          record.group_name = name;
        }
        return record;
      });
      return state;
    },
    setGroupDatas(state, action) {
      const groupDatas = action.payload;
      return { ...state, groupDatas };
    },
    checkImgItem(state, { payload }) {
      state.checkedImgs[payload.ID].checked = payload.checked;
      let checkedCount = 0;
      _.forOwn(state.checkedImgs, (record) => {
        if (record.checked === true) {
          checkedCount++;
        }
      });

      return {
        ...state,
        allChecked: checkedCount === state.imageDatas.length,
        indeterminate: !!checkedCount && (checkedCount < state.imageDatas.length)
      }
    },
    changeNewGroupName(state, { payload }) {
      return {
        ...state,
        newGroupName: payload
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

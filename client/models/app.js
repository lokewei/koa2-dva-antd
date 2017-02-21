import { login, userInfo, logout } from '../services/app'
import { parse } from 'qs'

export default {
  namespace: 'app',
  state: {
    login: false,
    loading: false,
    submitResult: {
      type: 'info',
      message: ''
    },
    user: {
      name: '吴彦祖'
    },
    loginMessageShowing: false,
    loginButtonLoading: false,
    menuPopoverVisible: false,
    siderFold: localStorage.getItem('antdAdminSiderFold') === 'true',
    darkTheme: localStorage.getItem('antdAdminDarkTheme') === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem('navOpenKeys') || '[]') // 侧边栏菜单打开的keys
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'queryUser' })
      window.onresize = () => {
        dispatch({ type: 'changeNavbar' })
      }
    }
  },
  effects: {
    *login({ payload }, { call, put }) {
      yield put({ type: 'showLoginButtonLoading' })
      const data = yield call(login, parse(payload))
      if (data.success) {
        yield put({
          type: 'loginSuccess',
          payload: {
            user: {
              name: payload.username
            }
          }
        });
      } else {
        yield put({
          type: 'loginFail',
          payload: {
            ...data
          }
        })
      }
      yield put({
        type: 'changeLoginMessageShow',
        payload: false
      })
    },
    *queryUser({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(userInfo, parse(payload));
      if (data.success) {
        yield put({
          type: 'loginSuccess',
          payload: {
            user: {
              name: data.user.user_nicename
            }
          }
        })
      }

      yield put({ type: 'hideLoading' });
    },
    *logout({ payload }, { call, put }) {
      const data = yield call(logout, parse(payload))
      if (data.success) {
        yield put({
          type: 'logoutSuccess'
        })
      }
    },
    *switchSider({ payload }, { put }) {
      yield put({
        type: 'handleSwitchSider'
      })
    },
    *changeTheme({ payload }, { put }) {
      yield put({
        type: 'handleChangeTheme'
      })
    },
    *changeNavbar({ payload }, { put }) {
      if (document.body.clientWidth < 769) {
        yield put({ type: 'showNavbar' })
      } else {
        yield put({ type: 'hideNavbar' })
      }
    },
    *switchMenuPopver({
      payload
    }, { put }) {
      yield put({
        type: 'handleSwitchMenuPopver'
      })
    }
  },
  reducers: {
    loginSuccess(state, action) {
      return {
        ...state,
        ...action.payload,
        login: true,
        loginButtonLoading: false,
        loginMessageShowing: true
      }
    },
    logoutSuccess(state) {
      return {
        ...state,
        login: false
      }
    },
    loginFail(state, action) {
      return {
        ...state,
        submitResult: {
          message: action.payload.message,
          type: 'error'
        },
        login: false,
        loginButtonLoading: false,
        loginMessageShowing: true
      }
    },
    changeLoginMessageShow(state, { payload }) {
      return {
        ...state,
        loginMessageShowing: payload
      }
    },
    showLoginButtonLoading(state) {
      return {
        ...state,
        loginButtonLoading: true
      }
    },
    showLoading(state) {
      return {
        ...state,
        loading: true
      }
    },
    hideLoading(state) {
      return {
        ...state,
        loading: false
      }
    },
    handleSwitchSider(state) {
      localStorage.setItem('antdAdminSiderFold', !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold
      }
    },
    handleChangeTheme(state) {
      localStorage.setItem('antdAdminDarkTheme', !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme
      }
    },
    showNavbar(state) {
      return {
        ...state,
        isNavbar: true
      }
    },
    hideNavbar(state) {
      return {
        ...state,
        isNavbar: false
      }
    },
    handleSwitchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible
      }
    },
    handleNavOpenKeys(state, action) {
      return {
        ...state,
        ...action.payload
      }
    }
  }
}

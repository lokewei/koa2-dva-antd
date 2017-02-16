import React from 'react'
import { Router } from 'dva/router'
import App from './routes/app'

const registerModel = (() => {
  const cached = {};
  return (app, model) => {
    if (!cached[model.namespace]) {
      app.model(model);
      cached[model.namespace] = 1;
    }
  }
})();
export default function ({ history, app }) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/dashboard'));
          // app.model(require('./models/dashboard'))
          cb(null, { component: require('./routes/dashboard') })
        })
      },
      childRoutes: [
        {
          path: 'dashboard',
          name: 'dashboard',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/dashboard'));
              // app.model(require('./models/dashboard'))
              cb(null, require('./routes/dashboard'))
            })
          }
        }, {
          path: 'contentManage/contentImgs',
          name: 'contentManage/contentImgs',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/contentImgs'));
              cb(null, require('./routes/contentManage/contentImgs'))
            })
          }
        }, {
          path: 'contentManage/contentTypes',
          name: 'contentManage/contentTypes',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/contentTypes'));
              cb(null, require('./routes/contentManage/contentTypes'))
            })
          }
        }, {
          path: 'contentManage/contents',
          name: 'contentManage/contents',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/contents'));
              cb(null, require('./routes/contentManage/contents'))
            })
          }
        }, {
          path: 'dest/:moduleName',
          name: 'dest/:moduleName',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/contents'));
              cb(null, require('./routes/contentManage/contents'))
            })
          }
        }, {
          path: 'travel',
          name: 'travel',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/travel'));
              cb(null, require('./routes/travel'))
            })
          }
        }, {
          path: 'users',
          name: 'users',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/users'));
              // app.model(require('./models/users'))
              cb(null, require('./routes/users'))
            })
          }
        }, {
          path: '*',
          name: 'error',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/error'))
            })
          }
        }
      ]
    }
  ]

  return <Router history={history} routes={routes} />
}

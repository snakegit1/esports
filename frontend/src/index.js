import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import store, { history } from './store'
import App from './containers/app'

// import './index.css'
import './assets/font-awesome.min.css'
import './assets/style.bundle.css'
import './assets/style_custom.css'

const target = document.querySelector('#app_root')

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>,
  target
)

let prevUser
store.subscribe(() => {
  let ls = window.localStorage
  let currentUser = store.getState().auth.user

  if (!currentUser) ls.removeItem('user')
  if (prevUser !== currentUser) {
    prevUser = currentUser
    if (currentUser) ls.setItem('user', JSON.stringify(currentUser))
  }
})

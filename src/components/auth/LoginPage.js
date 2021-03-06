import React from 'react'
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css'
import '@okta/okta-signin-widget/dist/css/okta-theme.css'
import OktaSignIn from '@okta/okta-signin-widget'
const clientId = '0oam63mn62mKbNSJE356'
export default class LoginPage extends React.Component {
  constructor () {
    super()
    this.state = { user: null }
    this.widget = new OktaSignIn({
      baseUrl: 'https://dev-266258-admin.okta.com',
      clientId: clientId,
      redirectUri: 'http://localhost:3000',
      authParams: {
        responseType: 'id_token'
      }
    })

    this.showLogin = this.showLogin.bind(this)
    this.logout = this.logout.bind(this)
  }

  componentDidMount () {
    this.widget.session.get(response => {
      if (response.status !== 'INACTIVE') {
        this.setState({ user: response.login })
      } else {
        this.showLogin()
      }
    })
  }

  showLogin () {
    Backbone.history.stop()
    this.widget.renderEl(
      { el: '#okta-login-container' },
      response => {
        this.setState({ user: response.claims.email })
      },
      err => {
        console.log(err)
      }
    )
  }

  logout () {
    this.widget.signOut(() => {
      this.setState({ user: null })
      this.showLogin()
    })
  }

  render () {
    return (
      <div>
        {this.state.user ? (
          <div className='container'>
            <div>Welcome, {this.state.user}!</div>
            <button onClick={this.logout}>Logout</button>
          </div>
        ) : null}
        {this.state.user ? null : (
          <div id='okta-login-container' className='login' />
        )}
      </div>
    )
  }
}

import { connect } from 'react-redux'

import { sendResetPassword, authDismissError } from '../actions'
import ResetPassword from '../components/reset_password'

const mapStateToProps = state => ({
  isPending: state.auth.isPending,
  error: state.auth.error,
})

const mapDispatchToProps = dispatch => ({
  dismissError: () => dispatch(authDismissError()),
  sendReset: (email) => dispatch(sendResetPassword({ email }))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPassword)

import React from 'react'

import './register_form_actions.css'

let goToDashboard = () => {
	window.location = '/app/dashboard';
}
const RegisterFormActions = ({ prevFn, nextFn }) => (
	<div className="registration-bottom-actions">
		<button onClick={prevFn} className="btn m-btn--pill btn-lg btn-secondary m-btn m-btn--custom pull-left">
			Previous
		</button>
		<button onClick={nextFn ? nextFn : goToDashboard} className="btn m-btn--pill btn-lg btn-primary m-btn m-btn--custom pull-right">
			{nextFn ? 'Next' : 'Go To Dashboard'}
		</button>
	</div>
)

export default RegisterFormActions;

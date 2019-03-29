import React from 'react'
import { PropTypes } from 'prop-types'

import Modal from './modal'

import './error_modal.css'

let ErrorModal = ({title, errors, dismiss}) => {
  if (!errors || errors.length === 0) return null;

  let items = errors.map((e, i) => (
    <li key={i}>{e.indexOf('token invalid:') === 0 ? 'Youve been signed out. Please login again' : e}</li>
  ))

  return (
    <Modal show={true}>
      <div id="errmod__vp" className="modal-content panel b-a">
        <div className="modal-header">
          <h4 className="modal-title">{ title ? title : 'Uh oh! An error has occurred...' }</h4>
        </div>
        <div className="modal-body">
          <ul>{items}</ul>  
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal" onClick={dismiss}>Dismiss</button>
        </div>
      </div>
    </Modal>
  )
}

ErrorModal.propTypes = {
  title: PropTypes.string,
  errors: PropTypes.array.isRequired,
  dismiss: PropTypes.func.isRequired,
}

export default ErrorModal

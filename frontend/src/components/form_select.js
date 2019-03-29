import React from 'react'
import { PropTypes } from 'prop-types'

import './form_select.css'

const FormSelect = ({ child, value, name, options, multi, onChange }) => {
  let type = (multi ? "checkbox" : "radio")

  let inputs = options.map((e, i) => (
    <span key={i}>
      <input type={type} name={name} value={e.value} checked={e.value === value} onChange={() => {onChange(e.value)}} />
      <label onClick={() => {onChange(e.value)}}>{e.name}</label>
    </span>
  ))

  return (
    <div className="select-toolbar">
      {child}
      {inputs}
    </div>
  )
}

FormSelect.propTypes = {
  options: PropTypes.array.isRequired,
}

export default FormSelect

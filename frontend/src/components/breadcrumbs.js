import React from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'

// import './breadcrumbs.css'
import logo from '../assets/logo_gray.png'

const BreadCrumbs = ({crumbs, name, isAdmin, logout}) => {
  const elems = crumbs.map((e, i) => <li key={i} className={ (i === crumbs.length - 1) ? 'active' : ''}>{e}</li>)

  let logoutHandler = e => {
    e.preventDefault()
    if (window.confirm("Are you sure you want to logout?")) {
      logout()
    }
  }

  return (
    <div id="bc__vp" className="row">
      <header className="m-grid__item m-header">
        <div className="m-container m-container--fluid m-container--full-height">
          <div className="m-stack m-stack--ver m-stack--desktop">
          <img className="logo" alt="EAL logo" src={logo} />
          <ol className="breadcrumb">
            {elems}
          </ol>
          { name ?
          <div className="right">
            <div className="dropdown">
              <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                {name}
                <span className="caret"></span>
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                <li><Link to="/register">Settings</Link></li>
                { isAdmin ? <li><Link to="/admin">Admin</Link></li> : null }
                <li><Link to="/logout" onClick={logoutHandler}>Logout</Link></li>
              </ul>
            </div>
          </div>
          : null }
          </div>
        </div>
      </header>
    </div>
  )
}
BreadCrumbs.propTypes = {
  crumbs: PropTypes.array.isRequired,
  name: PropTypes.string,
  logout: PropTypes.func,
  isAdmin: PropTypes.bool,
}

export default BreadCrumbs

import React from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'

import logo from '../assets/edl_logo_black.png'
import Modal from './modal'

const Header = ({crumbs, view, name, isAdmin, logout}) => {

  const elems = crumbs.map((e, i) => <li key={i} className={ (i === crumbs.length - 1) ? 'm-menu__item m-menu__item--active' : 'm-menu__item'}><Link to="#" className="m-menu__link"><span className="m-menu__item-here"></span><span className="m-menu__link-text">{e}</span></Link></li>)
  const sidebar_btn = document.getElementById('m_aside_header_menu_mobile_toggle');
  const sidebar     = document.getElementById('m_header_menu');
  const active_class = 'm-aside-header-menu-mobile--on';
  const close_btn   = document.getElementById('m-aside-header-menu-mobile-close');

  let hasClass = ( elem, klass ) => {
   return (" " + elem.className + " " ).indexOf( " "+klass+" " ) > -1;
  }

  const ComingSoon = ({dismiss}) => (
    <Modal show={true}>
      <div id="csmod__vp" className="modal-content panel b-a">
        <div className="modal-header">
          <h4 className="modal-title">Coming Soon!</h4>
        </div>
        <div className="modal-body">
          Thanks for your patience.
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-default" data-dismiss="modal" onClick={dismiss}>Okay</button>
        </div>
      </div>
    </Modal>
  )
  let state = { comingSoon: false }

  let logoutHandler = e => {
    e.preventDefault()
    if (window.confirm("Are you sure you want to logout?")) {
      logout()
    }
  }

  let showSidebar = e => {
    e.preventDefault()

    if (!hasClass(sidebar,active_class)) {
      sidebar.classList.add(active_class);
    }else{
      sidebar.classList.remove(active_class);
    }

  }
  //
  // window.addEventListener("click", function(e){
  //   if (!document.getElementById('m_aside_header_menu_mobile_toggle').contains(e.target) && hasClass(document.getElementById('m_header_menu'),'m-aside-header-menu-mobile--on')) {
  //     if (document.getElementById('m_header_menu').contains(e.target)){
  //
  //     } else{
  //       document.getElementById('m_header_menu').classList.remove('m-aside-header-menu-mobile--on');
  //     }
  //   }
  // });


  let showComingSoon = e => {
    e.preventDefault()
    this.setState({ comingSoon: true })
  }

  let hideComingSoon = e => {
    if (e) e.preventDefault()
    this.setState({ comingSoon: false })
  }

  return (
    <div id="header" className="">
    { state.comingSoon  }
      <header className="m-grid__item m-header">
        <div className="m-header__top">
          <div className="m-container m-container--responsive m-container--xxl m-container--full-height m-page__container">
            <div className="m-stack m-stack--ver m-stack--desktop">
              <div className="m-stack__item m-brand">
                <div className="m-stack m-stack--ver m-stack--general m-stack--inline">
                  <div className="m-stack__item m-stack__item--middle m-brand__logo">
                    <Link to="/" className="m-brand__logo-wrapper">
                      <img className="logo" alt="EAL logo" width="230px" src={logo} />
                    </Link>
                  </div>
                  <div className="m-stack__item m-stack__item--middle m-brand__tools">
                    <Link to="#" onClick={showSidebar} id="m_aside_header_menu_mobile_toggle" className="m-brand__icon m-brand__toggler m--visible-tablet-and-mobile-inline-block">
                			<span></span>
                		</Link>
                    <a id="m_aside_header_topbar_mobile_toggle" href="javascript:;" className="m-brand__icon m--visible-tablet-and-mobile-inline-block">
				              <i className="flaticon-more"></i>
			              </a>
                  </div>
                </div>
              </div>
              { name ?
              <div className="m-stack__item m-stack__item--fluid m-header-head">
                <div className="m-topbar m-stack m-stack--ver m-stack--general">
                  <div className="m-stack__item m-topbar__nav-wrapper">
                    <ul className="m-topbar__nav m-nav m-nav--inline">
                      <li className="m-nav__item m-topbar__user-profile m-topbar__user-profile--img m-dropdown m-dropdown--medium m-dropdown--arrow m-dropdown--header-bg-fill m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light">
                        <Link to="#" className="m-nav__link m-dropdown__toggle">
                          <span className="m-topbar__userpic m--padding-right-10">
                            <i className="fa fa-user-circle-o" aria-hidden="true"></i>
                          </span>
                          <span className="m-topbar__username dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            {name}
                          </span>
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                            { name ? <li><Link to="/dashboard">Dashboard</Link></li> : null }
                            { name ? <li><Link to="/register">Settings</Link></li> : null }
                            { isAdmin ? <li><Link to="/admin">Admin</Link></li> : null }
                            { name ? <li><Link to="/logout" onClick={logoutHandler}>Logout</Link></li> : null }
                          </ul>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              : null }
            </div>
          </div>
        </div>
        <div className="m-header__bottom">
          <div className="m-container m-container--responsive m-container--xxl m-container--full-height m-page__container">
            <div className="m-stack m-stack--ver m-stack--desktop">
              <div className="m-stack__item m-stack__item--middle m-stack__item--fluid">

                <button id="m-aside-header-menu-mobile-close" className="m-aside-header-menu-mobile-close  m-aside-header-menu-mobile-close--skin-light " id="m_aside_header_menu_mobile_close_btn"><i className="fa fa-times-circle" aria-hidden="true"></i></button>

                <div id="m_header_menu" className="m-header-menu m-aside-header-menu-mobile m-aside-header-menu-mobile--offcanvas  m-header-menu--skin-dark m-header-menu--submenu-skin-light m-aside-header-menu-mobile--skin-light m-aside-header-menu-mobile--submenu-skin-light">
                  { view == 'dashboard' ?
                  <ul className="m-menu__nav m-menu__nav--submenu-arrow ">
                    {elems}
                    <li className="m-menu__item">
                      <Link to="/schedule" rel="noopener noreferrer" className="m-menu__link">
                        <span className="m-menu__link-text">Schedule</span>
                      </Link>
                    </li>
                    <li className="m-menu__item">
                      <Link to="/stats" rel="noopener noreferrer" className="m-menu__link">
                        <span className="m-menu__link-text">Stats</span>
                      </Link>
                    </li>
                    <li className="m-menu__item">
                      <Link to="/rules" target="_blank" rel="noopener noreferrer" className="m-menu__link">
                        <span className="m-menu__link-text">Rules</span>
                      </Link>
                    </li>
                  </ul>
                  : view == 'schedule' ?
				  <ul className="m-menu__nav m-menu__nav--submenu-arrow ">
                    <li className="m-menu__item">
                      <Link to="/dashboard" rel="noopener noreferrer" className="m-menu__link">
                        <span className="m-menu__link-text">Dashboard</span>
                      </Link>
                    </li>
                    {elems}
                    <li className="m-menu__item">
                      <Link to="/stats" rel="noopener noreferrer" className="m-menu__link" onClick={this.showComingSoon}>
                        <span className="m-menu__link-text">Stats</span>
                      </Link>
                    </li>
                    <li className="m-menu__item">
                      <Link to="/rules" target="_blank" rel="noopener noreferrer" className="m-menu__link">
                        <span className="m-menu__link-text">Rules</span>
                      </Link>
                    </li>
                  </ul>
                  : view == 'stats' ?
				  <ul className="m-menu__nav m-menu__nav--submenu-arrow ">
                    <li className="m-menu__item">
                      <Link to="/dashboard" rel="noopener noreferrer" className="m-menu__link">
                        <span className="m-menu__link-text">Dashboard</span>
                      </Link>
                    </li>
                    <li className="m-menu__item">
                      <Link to="/schedule" rel="noopener noreferrer" className="m-menu__link">
                        <span className="m-menu__link-text">Schedule</span>
                      </Link>
                    </li>
                    {elems}
                    <li className="m-menu__item">
                      <Link to="/rules" target="_blank" rel="noopener noreferrer" className="m-menu__link">
                        <span className="m-menu__link-text">Rules</span>
                      </Link>
                    </li>
                  </ul>
                  :
				  null }
                </div>
              </div>
              { view == 'dashboard' ?
                <div className="m-stack__item m-stack__item--middle m-dropdown m-dropdown--arrow m-dropdown--large text-sm-right m-dropdown--mobile-full-width m-dropdown--align-right m-dropdown--skin-light m-header-search m-header-search--expandable m-header-search--skin-">
                  <a href="https://overtone.app/dashboard" target="_blank" className="btn btn-outline-metal m-btn m-btn--pill m-btn--icon">
                    <span>
                      <i className="fa fa-comment" aria-hidden="true"></i>
                      <span>Open Chat</span>
                    </span>
                  </a>
                </div>
              : null }
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

Header.propTypes = {
  crumbs: PropTypes.array.isRequired,
  name: PropTypes.string,
  logout: PropTypes.func,
  isAdmin: PropTypes.bool,
  fetchUnscheduledMatch: PropTypes.func,
  unscheduleMatch: PropTypes.array,
}

export default Header

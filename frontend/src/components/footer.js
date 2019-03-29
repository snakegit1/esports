import React from 'react'

const Footer = () => {
  return (
    <div id="footer" className="m-grid__item m-footer ">
      <div className="m-container m-container--responsive m-container--xxl m-container--full-height m-page__container">
        <div className="m-footer__wrapper">
          <div className="m-stack m-stack--flex-tablet-and-mobile m-stack--ver m-stack--desktop">
            <div className="m-stack__item m-stack__item--left m-stack__item--middle m-stack__item--last">
              <span className="m-footer__copyright">
					     Esportsleague.gg &copy; {(new Date()).getFullYear()}
    					</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer

import React from 'react'
import { PropTypes } from 'prop-types'
import { Link } from 'react-router-dom'

import './saved_card.css'

let SavedCard = ({ card, forgetCard }) => (
  <div id="sc__vp">
    <div className="row">
      <div className="col-xs-12 text-center">
        Payment Source: <strong>{card.brand}</strong> ending in <i>{card.last4}</i> expiring {card.exp_month}/{card.exp_year}
      </div>
      <div className="col-xs-12 text-center">
        <Link to="/register" onClick={forgetCard}>Change payment method</Link>
      </div>
    </div>
  </div>
)

SavedCard.propTypes = {
  card: PropTypes.object.isRequired,
  forgetCard: PropTypes.func.isRequired,
}

export default SavedCard

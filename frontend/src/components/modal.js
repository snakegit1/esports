import React from "react";
import { PropTypes } from 'prop-types'

//
// Modal is a no-frills modal component that relies on the bootstrap css classes
// (e.g. modal-open and modal-backdrop) but without requiring the bootstrap
// js or jquery.
//
// NOTE: this component requires that there is a div with the id
// 'app__modal-backdrop' attached directly to the page's body element.
//

class Modal extends React.Component {
  componentWillUnmount() {
    document.body.classList.remove('modal-open');
    document.getElementById('app__modal-backdrop').classList.remove('modal-backdrop', 'in');
  }

  render() {
    const { show, children } = this.props;
    var styles = { display: 'block' };
    var classes = 'modal fade modal-open in';

    if (!show) return null;

    document.body.classList.add('modal-open');
    document.getElementById('app__modal-backdrop').classList.add('modal-backdrop', 'in');

    return (
      <div className={classes} id="editModal" tabIndex="-1" role="dialog" aria-hidden="true" style={styles}>
        <div className="modal-dialog" role="document">
          { children }
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default Modal;

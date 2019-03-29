import React from 'react'

class PortletFooter extends React.Component {
  render() {
    return (
      <div className="m-portlet__foot m-portlet__foot--fit">
        <div className="m-form__actions">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default PortletFooter;

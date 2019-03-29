import React from 'react'

class PortletHeader extends React.Component {
  render() {
    return (
      <div className="m-portlet__head">
        { this.props.children }
      </div>
    );
  }
}

export default PortletHeader;

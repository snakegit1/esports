import React from 'react'

class PortletHeader extends React.Component {
  render() {
    return (
      <div className="m-portlet__head-caption">
        <div className="m-portlet__head-title">
          <h3 className="m-portlet__head-text">
            { this.props.children }
			    </h3>
        </div>
      </div>
    );
  }
}

export default PortletHeader;

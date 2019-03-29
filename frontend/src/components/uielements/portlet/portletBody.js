import React from 'react'

class PortletBody extends React.Component {
  render() {
    return (
      <div className={"m-portlet__body clearfix " + (this.props.padding === false ? 'm-portlet__body--no-padding' : '')}>
        {this.props.children}
      </div>
    );
  }
}

export default PortletBody;

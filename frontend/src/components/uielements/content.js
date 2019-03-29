import React from 'react'

class ContentWrapper extends React.Component {
  render() {
    return (
      <div className="m-grid__item m-grid__item--fluid m-grid m-grid--hor-desktop m-grid--desktop m-body">
        { this.props.subheader ?
          <div className="m-subheader">
          	<div className="d-flex align-items-center">
           		<div className="mr-auto">
           			<h3 className="m-subheader__title ">{ this.props.subheader }</h3>
    			 		</div>
          	</div>
          </div>
        : null }
        <div className="m-content clearfix">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default ContentWrapper;

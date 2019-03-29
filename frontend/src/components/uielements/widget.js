import React from 'react'


class Widget extends React.Component {
  render() {
    const widgetId = this.props.id;
    return (
      <div id={ widgetId ? widgetId:'' } className="m-widget14">
      {
        this.props.title || this.props.description ?
        <div className="m-widget14__header m--margin-bottom-10">
          <h3 className="m-widget14__title">
  			    { this.props.title }
  	      </h3>
          <span className="m-widget14__desc">
        		{ this.props.description }
        	</span>
        </div>
        : null
      }
      {this.props.children}
      </div>
    );
  }
}

export default Widget;

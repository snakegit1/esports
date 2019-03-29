import React from 'react'

class Portlet extends React.Component {
  componentWillMount(){
    //console.log(this.props.padding === false);
  }
  render() {
    const portletId = this.props.id;
    return (
      <div  id={ portletId ? portletId:'' } className={"m-portlet "}>
        {this.props.children}
      </div>
    );
  }
}

export default Portlet;

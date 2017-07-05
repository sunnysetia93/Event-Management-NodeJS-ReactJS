import React from 'react';


export default class CommonButton extends React.Component {

	render() {
		return (

            <button 
                className="btn btn-primary"
                 onClick={this.props.onButtonClick}> 
                 {this.props.label} 
            </button>
			
		);
	}
}
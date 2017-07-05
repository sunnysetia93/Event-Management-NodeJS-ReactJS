import React from "react";
import CommonButton from "./common-button";

export default class CommonHeader extends React.Component{


    render(){ return (
        <div className="row" style={{marginTop:"20px"}}>

            <h1 className="col-md-8">{this.props.title} </h1>
            <CommonButton 
                className="col-md-4" 
                label={this.props.buttonLabel} 
                onButtonClick={this.props.onButtonClick} 
            />
        </div>
    )}


}



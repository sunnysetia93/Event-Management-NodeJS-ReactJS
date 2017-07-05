import React from 'react';
import HostingTable from './hosting-table.jsx';
import CommonHeader from "../Common/common-header";
import axios from "axios";


export default class EventDashboard extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {events:[]}
    }

    componentDidMount()
    {
        var url = "http://localhost:8888/api/events";
        var config = {};

        config.headers = {
            "Authorization" : "Bearer xx",
            "Content-Type" : "application/x-www-form-urlencoded"
        }

        axios.get(url,config).then(function(response)
        {
            console.log(response);
            this.setState({events:response.data});
        }.bind(this))
    }

    render()
    {
        return (
            <div>
            <CommonHeader 
                    title="My Events"
                    buttonLabel="Create Event"
                    onButtonClick={function(){console.log("This should trigger the Create Event UI")}}
                /><br/>
                <HostingTable events={this.state.events}/>
            </div>
        )
    }
}
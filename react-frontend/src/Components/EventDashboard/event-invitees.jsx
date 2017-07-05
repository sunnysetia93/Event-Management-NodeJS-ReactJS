import React from 'react';
import HostingTable from './hosting-table.jsx';
import CommonHeader from "../Common/common-header";
import axios from "axios";


export default class EventInvitees extends React.Component
{

    constructor(props)
    {
        super(props);
        this.state = {events:[],eventId:0}
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event)
    {
        this.setState({eventId:event.target.value});
    }

    componentDidMount()
    {
        var url = "http://localhost:8888/api/events/6/invitees/";
        var config = {};

        config.headers = {
            "Authorization" : "Bearer 25ohFoc2GAjCykdeS7FQ",
            "Content-Type" : "application/x-www-form-urlencoded"
        }

        axios.get(url,config).then(function(response)
        {
            console.log(response);
            // this.setState({events:response.data});
        }.bind(this))
    }

    render()
    {
        return (
            <div>
            <input value={this.state.eventId} onChange={this.handleChange}/>
            {/*<CommonHeader 
                    title="My Events"
                    buttonLabel="Create Event"
                    onButtonClick={function(){console.log("This should trigger the Create Event UI")}}
                /><br/>
                
                <HostingTable events={this.state.events}/>*/}
            </div>
        )
    }
}
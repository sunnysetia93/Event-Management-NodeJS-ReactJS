import React from 'react';
import moment from "moment";

export default class HostingRow extends React.Component
{
    prettyDateTime(date_string)
    {
        return moment(date_string).format('MMM DD YYYY, h:mm a');
    }

    render()
    {
        return (

            <tr>
                <td>{this.props.event.title}</td>
                <td>{this.prettyDateTime(this.props.event.startTime)}</td>
                <td>{this.prettyDateTime(this.props.event.endTime)}</td>
                <td>{this.props.event.venue}</td>
            </tr>
        )
    }
}
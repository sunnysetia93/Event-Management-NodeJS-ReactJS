import React from 'react';
import HostingRow from './hosting-row.jsx';

export default class HostingTable extends React.Component
{
    render()
    {
        return (

            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Starts At</th>
                            <th>Ends At</th>
                            <th>Venue</th>
                        </tr>    
                    </thead>
                    <tbody>

                        {
                            this.props.events.map(function(item)
                            {
                                return <HostingRow event={item} key={item.id} />
                            })
                        }

                    </tbody>
                </table>
            </div>
        )
    }
}
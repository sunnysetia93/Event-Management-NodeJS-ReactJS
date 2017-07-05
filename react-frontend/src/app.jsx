import React from 'react';
import ReactDOM from 'react-dom';
import EventDashboard from './Components/EventDashboard/event-dashboard';
import EventInvitees from './Components/EventDashboard/event-invitees';
import LoginForm from './Components/auth/login-form'


class App extends React.Component
{
    render()
    {
        return (
            <div>
                <LoginForm />
            </div>
        )
    }
}

ReactDOM.render(<App/>,document.getElementById("app"));
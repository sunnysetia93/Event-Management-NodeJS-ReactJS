import React from 'react';
import axios from 'axios';
import formurlencoded from 'form-urlencoded';


export default class LoginForm extends React.Component
{
    constructor(props)
    {
        super(props);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.state = {
            fields : {
                username : "",
                password:"",
                token:""
            }
        }
    }

    onFormSubmit(event)
    {
        event.preventDefault();
        const fields = this.state.fields;
        let token = 0;       
        console.log("Form Submitted!");

        axios.post("http://localhost:8888/login",
            formurlencoded(this.state.fields),
            {
                "headers":
                {
                    "Content-Type" : "application/x-www-form-urlencoded"
                }

            }
        ).then(function(response){
            console.log(response);
        })

        axios.post("http://localhost:8888/token",
            formurlencoded(this.state.fields),
            {
                "headers":
                {
                    "Content-Type" : "application/x-www-form-urlencoded"
                }

            }
        ).then(function(response){
            console.log("token ",response.data);    
            token=response.data;
        })

        console.log(token);
        fields["token"]=token;
        this.setState({fields:fields});
        console.log(fields);
    }

    onInputChange(event)
    {
        const fields = this.state.fields;
        fields[event.target.name] = event.target.value;

        this.setState({fields:fields});
        console.log(fields);
    }

    render()
    {
        return (
            <form onSubmit={this.onFormSubmit}>
                <input type="text" name="username" placeholder="Enter Username" onChange={this.onInputChange}></input><br/>
                <input type="password" name="password" placeholder="Enter Password" onChange={this.onInputChange}></input><br/>
                <button onClick={this.onFormSubmit}>Login</button>
            </form>
        )
    }
}
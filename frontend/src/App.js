import React from 'react';
import ReactDOM from "react-dom"
import './App.css';
import Mainpage from './Components/Mainpage'
import Loginpage from './Components/Loginpage'
import Registerpage from './Components/Registerpage'
import Lobby from './Components/Lobby'

class App extends React.Component {

    state = {
        displayed_form: 'mainpage',
        logged_in: false,
        username: '',
        infoMessage: '',
        initialView: true,
        token: '',
    }

    onResetInfoMessage = () =>{
        this.setState(
            {'infoMessage': ''}
            )
    }

    makeAuthentication = () => {
        this.create_token()
            .then( () => this.loginWithToken())
    }

    loginWithToken = (e, data) => {
        fetch('http://localhost:8000/api-auth/get_online/', {
                                headers: {
                                Authorization: `Bearer ${this.getToken()}`
                                }}
        )}

    handle_login = (e, data) => {
        e.preventDefault();
        var status;
        fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                status = res.status;
                res.json()
                    .then(res => {
                        if (status === 200) {
                            localStorage.setItem('token', res['access']);
                            localStorage.setItem('token-refresh', res['refresh']);
                            this.setState({
                                logged_in: true,
                                displayed_form: 'lobby',
                                username: data.username
                            });
                            fetch('http://localhost:8000/api-auth/get_online/', {
                                headers: {
                                Authorization: `Bearer ${this.getToken()}`
                                }
                            })
                        } else {
                            this.setState({
                                infoMessage: "Provide valid credentials",
                            });
                        }
                    }
                )
            })

    };




    handle_signup = (e, data) => {
        e.preventDefault();
        var status;
        fetch('http://localhost:8000/api-auth/new_user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                status = res.status;
                res.json().then(res => {
                        if (status === 201) {
                            this.setState({
                                infoMessage: "User has been registered. Please log in.",
                                displayed_form: 'login',
                            });
                        } else {
                            this.setState({
                                infoMessage: res['username'],
                            });
                        }
                    }
                )
            });
    }

    handle_logout = () => {
        fetch('http://localhost:8000/api-auth/get_offline/', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.getToken()}`
            },
        })
            .then(res => res.json())
            .then(json => {
                localStorage.removeItem('token');
                localStorage.removeItem('token-refresh');
                this.setState({
                    logged_in: false,
                    username: '',
                    displayed_form: 'mainpage',
                    message: "User logged out succesfully."
                });
                console.log(this.state.message);
            });
    }

    display_form = form => {
        this.setState({
            displayed_form: form,
            infoMessage: ''
        });
    };

    chooseLayout() {
        switch (this.state.displayed_form) {
            case 'login':
                return <Loginpage handle_login={this.handle_login}
                                  logged_in={this.state.logged_in}
                                  infoMessage = {this.state.infoMessage}
                                  resetInfoMessage = {this.onResetInfoMessage}
                                  display_form={this.display_form}
                                  handle_logout={this.handle_logout}/>;
            case 'signup':
                return <Registerpage handle_signup={this.handle_signup}
                                     logged_in={this.state.logged_in}
                                     resetInfoMessage = {this.onResetInfoMessage}
                                     infoMessage = {this.state.infoMessage}
                                     display_form={this.display_form}
                                     handle_logout={this.handle_logout}/>;
            case 'mainpage':
                return <Mainpage showLoginPage={this.showLoginPage}
                                 logged_in={this.state.logged_in}
                                 display_form={this.display_form}
                                 handle_logout={this.handle_logout}/>;
            case 'lobby':
                return <Lobby display_form={this.display_form}
                              logged_in={this.state.logged_in}
                              user={this.state.username}
                              handle_logout={this.handle_logout}/>;
        }
    }



    render() {
        let form = this.chooseLayout();

        return (
            <div id="outer-box">
                <div id="main-box">
                    {form}
                </div>
            </div>
        )
    }
}

export default App;


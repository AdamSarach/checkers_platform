import React from 'react';
import ReactDOM from "react-dom"
import './App.css';
import Mainpage from './Components/Mainpage'
import Loginpage from './Components/Loginpage'
import Registerpage from './Components/Registerpage'
import Lobby from './Components/Lobby'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.display_form = this.display_form.bind(this);
        this.state = {

            displayed_form: '',
            logged_in: localStorage.getItem('token') ? true : false,
            username: '',
            message: ''
        }
    }


    componentDidMount() {
        if (this.state.logged_in) {
            fetch('http://localhost:8000/login_and_register/current_user/', {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(json => {
                    this.setState({username: json.username});
                });
        }
    }

    get_current_users() {
        if (this.state.logged_in) {
            fetch('http://localhost:8000/api-auth/current_user/', {
                headers: {
                    Authorization: `JWT ${localStorage.getItem('token')}`
                }
            })
                .then(res => res.json())
                .then(json => {
                    this.setState({username: json.username});
                });
        }
    };


    handle_login = (e, data) => {
        e.preventDefault();
        fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(json => {
                localStorage.setItem('token', json['access']);
                localStorage.setItem('token-refresh', json['refresh']);
                this.setState({
                    logged_in: true,
                    displayed_form: 'lobby',
                    username: json.user.username
                });
            });
    };

    handle_signup = (e, data) => {
        e.preventDefault();
        fetch('http://localhost:8000/api-auth/login_and_register/new_user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(() => this.setState({
                    logged_in: false,
                    displayed_form: 'login',
                })
            )
    };

    handle_logout = () => {
        fetch('http://localhost:8000/login_and_register/logout/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',

            },
        })
            .then(res => res.json())
            .then(json => {
                localStorage.removeItem('token');
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
            displayed_form: form
        });
    };


    render() {
        let form;
        switch (this.state.displayed_form) {
            case 'login':
                form = <Loginpage handle_login={this.handle_login} display_form={this.display_form}
                                  logged_in={this.state.logged_in}
                                  display_form={this.display_form}
                                  handle_logout={this.handle_logout}/>;
                break;
            case 'signup':
                form = <Registerpage handle_signup={this.handle_signup} display_form={this.display_form}
                                     logged_in={this.state.logged_in}
                                     display_form={this.display_form}
                                     handle_logout={this.handle_logout}/>;
                break;
            case 'mainpage':
                form = <Mainpage showLoginPage={this.showLoginPage} display_form={this.display_form}
                                 logged_in={this.state.logged_in}
                                 display_form={this.display_form}
                                 handle_logout={this.handle_logout}/>;
                break;
            case 'lobby':
                form = <Lobby display_form={this.display_form}
                              logged_in={this.state.logged_in}
                              user={this.state.username}
                              display_form={this.display_form}
                              handle_logout={this.handle_logout}/>;
                break;

            default:
                form = <Mainpage showLoginPage={this.showLoginPage} display_form={this.display_form}
                                 logged_in={this.state.logged_in}
                                 display_form={this.display_form}
                                 handle_logout={this.handle_logout}/>;
        }

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


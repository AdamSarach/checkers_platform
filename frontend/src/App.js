import React from 'react';
import ReactDOM from "react-dom"
import './App.css';
import Mainpage from './Mainpage'
import Loginpage from './Loginpage'
import Registerpage from './Registerpage'
import Lobby from './Lobby'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.display_form = this.display_form.bind(this);
        this.state = {

            displayed_form: '',
            logged_in: localStorage.getItem('token') ? true : false,
            username: ''
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

    handle_login = (e, data) => {
        e.preventDefault();
        fetch('http://localhost:8000/token-auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(json => {
                localStorage.setItem('token', json.token);
                this.setState({
                    logged_in: true,
                    displayed_form: 'lobby',
                    username: json.user.username
                });
            });
    };

    handle_signup = (e, data) => {
        e.preventDefault();
        fetch('http://localhost:8000/login_and_register/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(json => {
                localStorage.setItem('token', json.token);
                this.setState({
                    logged_in: true,
                    displayed_form: 'lobby',
                    username: json.username
                });
            });
    };

    handle_logout = () => {
        localStorage.removeItem('token');
        this.setState({logged_in: false, username: '', displayed_form: 'mainpage'});
    };

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


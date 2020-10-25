import React from 'react';
import ReactDOM from "react-dom"
import './App.scss';
import Mainpage from './Components/Mainpage'
import Loginpage from './Components/Loginpage'
import Registerpage from './Components/Registerpage'
import Authenticatedarea from './Components/Authenticatedarea'
// import Lobby from './Components/Lobby'
import {Game} from './Game'
class App extends React.Component {

    state = {
        // Change displayedForm for tests
        displayedForm: 'mainpage',
        logged_in: false,
        username: '',
        infoMessage: '',
        initialView: true,
        token: '',
    }

    onResetInfoMessage = () => {
        this.setState(
            {'infoMessage': ''}
        )
    }

    // makeAuthentication = () => {
    //     this.createAccessToken()
    //         .then( () => this.loginWithToken());
    // }
    //
    // loginWithToken = () => {
    //     fetch('http://localhost:8000/api-auth/get_online/', {
    //                             headers: {
    //                             Authorization: `Bearer ${this.getTokenFromLocal()}`
    //                             }}
    //     )}

    // createAccessToken = (e, data) => {
    makeAuthentication = (e, data) => {
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
                    .then((res) => {
                            // console.log(res.body);
                            if (status === 200) {
                                localStorage.setItem('token', res['access']);
                                localStorage.setItem('token-refresh', res['refresh']);
                                fetch('http://localhost:8000/api-auth/get_online/', {
                                    method: 'GET',
                                    headers: {
                                        Authorization: `Bearer ${this.getTokenFromLocal()}`
                                    }
                                })
                                    .then(() =>
                                        this.setState({
                                            logged_in: true,
                                            displayedForm: 'authenticatedArea',
                                            username: data.username
                                        }))
                            }
                            else {
                                this.setState({
                                    infoMessage: "Provide valid credentials",
                                });
                            }
                        }
                    )
            })

    };


    handleSignup = (e, data) => {
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
                                displayedForm: 'login',
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

    handleLogout = () => {
        var status;
        fetch('http://localhost:8000/api-auth/get_offline/', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.getTokenFromLocal()}`
            },
        })
            .then(res => {
                localStorage.removeItem('token');
                localStorage.removeItem('token-refresh');
                this.setState({
                    logged_in: false,
                    username: '',
                    displayedForm: 'mainpage',
                });
            });
    }


    displayForm = form => {
        this.setState({
            displayedForm: form,
            infoMessage: ''
        });
    };


    chooseLayout() {
        switch (this.state.displayedForm) {
            case 'login':
                return <Loginpage makeAuthentication={this.makeAuthentication}
                                  logged_in={this.state.logged_in}
                                  infoMessage={this.state.infoMessage}
                                  resetInfoMessage={this.onResetInfoMessage}
                                  onFormChange={this.onFormChange}
                                  displayForm={this.displayForm}
                />;
            case 'signup':
                return <Registerpage handleSignup={this.handleSignup}
                                     logged_in={this.state.logged_in}
                                     resetInfoMessage={this.onResetInfoMessage}
                                     infoMessage={this.state.infoMessage}
                                     onFormChange={this.onFormChange}
                                     displayForm={this.displayForm}
                />;
            case 'mainpage':
                return <Mainpage showLoginPage={this.showLoginPage}
                                 logged_in={this.state.logged_in}
                                 displayForm={this.displayForm}
                />;
            case 'authenticatedArea':
                return <Authenticatedarea displayForm={this.displayForm}
                              logged_in={this.state.logged_in}
                              user={this.state.username}
                              handleLogout={this.handleLogout}
                              getTokenFromLocal={this.getTokenFromLocal}/>;
            case 'game':
                return <Game displayForm={this.displayForm}
                             logged_in={this.state.logged_in}
                             user={this.state.username}
                             getTokenFromLocal={this.getTokenFromLocal}/>;
        }
    }

    getTokenFromLocal = () => localStorage.getItem('token')

    render() {
        let form = this.chooseLayout();

        return (
            <div>
                {form}
            </div>
            // <div className="website-all">
            //     <div className="container d-flex align-items-center">
            //         {form}
            // {/*    </div>*/}
            // {/*</div>*/}

        )
    }
}

export default App;


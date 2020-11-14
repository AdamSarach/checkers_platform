import React from 'react';
import './App.scss';
import './basicArea.scss';
import Mainpage from './Components/Mainpage'
import Loginpage from './Components/Loginpage'
import Registerpage from './Components/Registerpage'
import Authenticatedarea from './Components/Authenticatedarea'
import {Game} from './Components/Game'

class App extends React.Component {

    state = {
        displayedForm: 'mainpage',
        logged_in: false,
        username: null,
        infoMessage: '',
        errorMessage: '',
        initialView: true,
        token: '',
        screenWidth: 0,
        screenHeight: 0
    }

    onResetInfoMessage = () => {
        this.setState(
            {
                'infoMessage': '',
                'errorMessage': ''
            }
        )
    }

    componentDidMount() {
        this.updateWindowDimensions();
    }

    updateWindowDimensions = () => {
        this.setState({screenWidth: window.innerWidth, screenHeight: window.innerHeight});
    }

    makeAuthentication = (e, data) => {
        e.preventDefault();
        this.onResetInfoMessage();
        const fetchTokenResponse = this.fetchData('/api/token/', "POST", false, data)
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then((res) => {
                                localStorage.setItem('token', res['access']);
                                localStorage.setItem('token-refresh', res['refresh']);
                                const fetchLoginResponse = this.fetchData('/api-auth/get_online/', "GET", true)
                                    .then(() => {
                                            this.updateAuthState(true, data.username, 'authenticatedArea')
                                            const fetchOutGameResponse = this.fetchData('/api-auth/out_game/', "POST", true)
                                                .then((response) => {
                                                    if (!(response.ok)) {
                                                        console.warn("OutGame warning")
                                                    } else {
                                                        console.log("Authentication completed.")
                                                    }
                                                });

                                        }
                                    )
                            }
                        )

                } else {
                    this.setState({
                        errorMessage: "Provide valid credentials",
                    });
                }
            })
    };

    fetchData = (path, method = "GET", token, content) => {
        const url = 'http://' + window.location.host + path
        if (token === true) {
            return fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${this.getTokenFromLocal()}`
                },
            })
        } else {
            return fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(content)
            })
        }

    }

    handleSignup = (e, data) => {
        e.preventDefault();
        const fetchNewUserResponse = this.fetchData('/api-auth/new_user/', "POST", false, data)
            .then((res) => {
                if (res.ok) {
                    res.json().then(res => {
                        this.setState({
                            infoMessage: "User has been registered. Please log in.",
                            displayedForm: 'login',
                        })
                    });
                } else {
                    res.json().then(res => {
                        this.setState({
                            errorMessage: res['username'],
                        })
                    });
                }
            });
    }

    handleLogout = () => {
        const fetchLogoutResponse = this.fetchData('/api-auth/get_offline/', "GET", true)
            .then(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('token-refresh');
                this.updateAuthState(false, '', 'mainpage')
            });
    }

    updateAuthState = (isLoggedIn, username, displayedForm) => {
        this.setState({
            logged_in: isLoggedIn,
            username: username,
            displayedForm: displayedForm
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
                                  errorMessage={this.state.errorMessage}
                                  resetInfoMessage={this.onResetInfoMessage}
                                  onFormChange={this.onFormChange}
                                  displayForm={this.displayForm}
                                  screenWidth={this.state.screenWidth}
                                  screenHeight={this.state.screenHeight}
                />;
            case 'signup':
                return <Registerpage handleSignup={this.handleSignup}
                                     logged_in={this.state.logged_in}
                                     resetInfoMessage={this.onResetInfoMessage}
                                     errorMessage={this.state.errorMessage}
                                     onFormChange={this.onFormChange}
                                     displayForm={this.displayForm}
                                     screenWidth={this.state.screenWidth}
                                     screenHeight={this.state.screenHeight}
                />;
            case 'mainpage':
                return <Mainpage showLoginPage={this.showLoginPage}
                                 logged_in={this.state.logged_in}
                                 displayForm={this.displayForm}
                                 screenWidth={this.state.screenWidth}
                                 screenHeight={this.state.screenHeight}
                />;
            case 'authenticatedArea':
                // if (!this.state.user) {
                //     return null;
                // }
                return <Authenticatedarea displayForm={this.displayForm}
                                          logged_in={this.state.logged_in}
                                          user={this.state.username}
                                          handleLogout={this.handleLogout}
                                          getTokenFromLocal={this.getTokenFromLocal}
                                          screenWidth={this.state.screenWidth}
                                          screenHeight={this.state.screenHeight}
                />;
            case 'game':
                return <Game displayForm={this.displayForm}
                             logged_in={this.state.logged_in}
                             user={this.state.username}
                             getTokenFromLocal={this.getTokenFromLocal}
                             screenWidth={this.state.screenWidth}
                             screenHeight={this.state.screenHeight}
                />;
        }
    }

    getTokenFromLocal = () => localStorage.getItem('token')

    render() {
        let form = this.chooseLayout();


        return (
            <div className="main-form">
                {form}
            </div>
        )
    }
}

export default App;


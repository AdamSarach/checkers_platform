import React from 'react';
import ReactDOM from "react-dom"
import './App.css';
import Mainpage from './Mainpage'
import Loginpage from './Loginpage'
import Registerpage from './Registerpage'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.showLoginPage = this.showLoginPage.bind(this);
        this.showRegisterPage = this.showRegisterPage.bind(this);
        this.state = {
            mainPageVisible: true,
            loginPageVisible: false,
            registerPageVisible: false
        }
    }

    showLoginPage() {
        // alert('Login Page!');
        this.setState({
                registerPageVisible: false,
                mainPageVisible: false,
                loginPageVisible: true

            }
        )
    };

    showRegisterPage() {
        // alert('RegisterPage!');
        this.setState({
                mainPageVisible: false,
                loginPageVisible: false,
                registerPageVisible: true
            }
        )
    };

    render() {
        return (
            <div id="outer-box">
                <div id="main-box">
                    {this.state.mainPageVisible ?
                        <Mainpage showLoginPage={this.showLoginPage} showRegisterPage={this.showRegisterPage}/> : null}
                    {this.state.loginPageVisible ? <Loginpage showRegisterPage={this.showRegisterPage}/> : null}
                    {this.state.registerPageVisible ? <Registerpage showLoginPage={this.showLoginPage}/> : null}
                </div>
            </div>

        )
    }
}

export default App;


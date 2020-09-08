import React from 'react';
import ReactDOM from "react-dom"

import logo from './logo.svg';
import './App.css';
import Main_photo from './checkers_placeholder.png'


class App extends React.Component {
    showLoginPage() {
        alert('Login Page!');
    };

    showRegisterPage() {
        alert('RegisterPage!');
    };

    render() {
        return (
            <div id="outer-box">
                <div id="main-box">
                    <div>
                        <h3 className="centered" id="title">Welcome to Checkers!</h3>
                    </div>
                    <div>
                        {/*{Main_photo}*/}
                        <img id="placeholder-photo" src={Main_photo} alt="Placeholder"/>
                    </div>
                    <div>
                        <p className="close-to-bottom centered">Please <span className="span-link"
                            onClick={this.showLoginPage}> sign in </span> or <span className="span-link"
                            onClick={this.showRegisterPage}> register </span> to play a game.</p>
                    </div>
                </div>
            </div>


        )
    }
}

export default App;


class Mainphoto extends React.Component {
    render() {
        return
    };
}
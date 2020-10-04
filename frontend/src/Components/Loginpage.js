import React from "react";
import PropTypes from 'prop-types';


class Loginpage extends React.Component {
    constructor(props) {
        super(props);
    };

    state = {
        username: "",
        password: ""
    };

    onFormChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
            const newState = {...prevstate};
            newState[name] = value;
            return newState;
        });
        if (this.props.infoMessage !== ''){
            this.props.resetInfoMessage();
        }
    };
    render() {
        return (
            <div id="main-page">
                <div>
                    <h3 className="badge-success centered" id="title">Login page</h3>
                </div>
                <div>
                    <form className="login-form" onSubmit= {e => this.props.makeAuthentication(e, this.state)}>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={this.state.username}
                            onChange={this.onFormChange}
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.onFormChange}
                        />
                        <input type="submit" className="btn btn-success" value="Sign In"/>
                    </form>
                </div>
                <div>
                    {this.props.infoMessage}
                </div>
                <div>
                    <p className="centered">Don't have an account?
                        <span className="span-link" onClick={() =>
                            this.props.displayForm('signup')
                        }> Register </span>
                    </p>
                </div>
            </div>
        )
    };
}

export default Loginpage;

Loginpage.propTypes = {
    makeAuthentication: PropTypes.func.isRequired
};
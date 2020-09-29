import React from "react";

class Registerpage extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        username: '',
        password: '',
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
                    <h3 className="badge-success centered" id="title">Register page</h3>
                </div>
                <div>
                    <form className="register-form" onSubmit={e => this.props.handleSignup(e, this.state)}>

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
                        <input className="btn btn-success" type="submit" value="Sign Up"/>
                    </form>
                </div>
                <div>
                    {this.props.infoMessage}
                </div>
                <div>
                    <p className="close-to-bottom centered">Already have an account?
                        <span className="span-link" onClick={() =>
                            this.props.displayForm('login')
                        }> Sign in </span>
                    </p>
                </div>
            </div>
        )
    };
}

export default Registerpage;
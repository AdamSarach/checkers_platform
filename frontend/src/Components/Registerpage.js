import React from "react";
import '../basicArea.scss'

class Registerpage extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        username: '',
        password: '',
    };

    componentDidMount() {
        this.props.resetInfoMessage();
    }

    onFormChange = e => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState(prevstate => {
            const newState = {...prevstate};
            newState[name] = value;
            return newState;
        });
        if (this.props.infoMessage !== '') {
            this.props.resetInfoMessage();
        }
    };

    render() {
        return (
            <div className="website-styles center-main-container register-page">
                <div>
                    <h1><span className="badge badge-dark title-header">Register page</span></h1>
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
                        <input className="btn btn-dark" type="submit" value="Sign Up"/>
                        <div className="white-block general-info">
                            <span className="red-info">{this.props.errorMessage}</span>
                        </div>
                    </form>
                </div>

                <div className={ (this.props.screenWidth <= 767) ? "centered close-to-bottom bottom-container" : "centered"}>
                    <p>Already have an account?
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
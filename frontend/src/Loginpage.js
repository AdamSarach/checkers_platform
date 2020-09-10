import React from "react";

class Loginpage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="main-page">
                <div>
                    <h3 className="centered" id="title">Login page</h3>
                </div>
                <div>
                {/*Login Form*/}
                </div>
                <div>
                    <p className="close-to-bottom centered">Don't have an account?
                        <span className="span-link" onClick={() =>
                            this.props.showRegisterPage()
                        }> Register </span>
                    </p>
                </div>
            </div>
        )
    };
}

export default Loginpage;
import React from "react";

class Registerpage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="main-page">
                <div>
                    <h3 className="centered" id="title">Register page</h3>
                </div>
                <div>
                {/*Register Form*/}
                </div>
                <div>
                    <p className="close-to-bottom centered">Already have an account?
                        <span className="span-link" onClick={() =>
                            this.props.showLoginPage()
                        }> Sign in </span>
                    </p>
                </div>
            </div>
        )
    };
}

export default Registerpage;
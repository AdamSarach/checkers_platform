import Main_photo from "./checkers_placeholder.png";
import React from "react";

class Lobby extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="main-page">
                <div>
                    <h6>Logged in!</h6>
                    <h3 className="centered" id="title">
                        {this.props.logged_in ? `Hello, ${this.props.user}` : 'Something went wrong...'}
                    </h3>
                </div>
                <div>
                    {/*Logged in player list*/}
                </div>
                <div>
                    <p className="close-to-bottom centered">Do you want to
                        <span className="span-link" onClick={this.props.handle_logout}
                        > log out? </span>
                    </p>
                </div>
            </div>
        );
    };
}

export default Lobby;
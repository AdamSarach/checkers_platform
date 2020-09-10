import Main_photo from "./checkers_placeholder.png";
import React from "react";

class Mainpage extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div id="main-page">
                <div>
                    <h3 className="centered" id="title">Welcome to Checkers!</h3>
                </div>
                <div>
                    {/*{Main_photo}*/}
                    <img id="placeholder-photo" src={Main_photo} alt="Placeholder"/>
                </div>
                <div>
                    <p className="close-to-bottom centered">Please
                        <span className="span-link" onClick={() =>
                            this.props.showLoginPage()
                        }> sign in </span> or
                        <span className="span-link" onClick={() =>
                            this.props.showRegisterPage()
                        }> register </span> to play a game.
                    </p>
                </div>
            </div>
        );
    };
}

export default Mainpage;

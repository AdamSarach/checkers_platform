// import Main_photo from "./checkers_placeholder.png";
import React from "react";
import '../basicArea.scss'

class Mainpage extends React.Component {
    constructor(props) {
        super(props);

    }



    render() {
        return (
            <div className=" website-styles main-page">
                <h1><span className="badge badge-dark title-header">Welcome to Checkers!</span></h1>
                <div className="photo">
                    <img src="/static/checkers_placeholder.png" onClick={() =>
                        this.props.displayForm('login')} alt="Placeholder"/>
                </div>
                { (this.props.screenWidth <= 767 ) ? <div className="mainpage-buttons">
                    <div className="row justify-content-center"><h1><span className="badge badge-dark big-badge login-link" onClick={() =>
                            this.props.displayForm('login')
                        }>Sign In</span></h1></div>
                    <div className="row justify-content-center"><h1><span className="badge badge-dark big-badge register-link" onClick={() =>
                            this.props.displayForm('signup')
                        }>Register</span></h1></div>
                </div> :
                    <div className="bottom-page-info-container">
                    <p className="centered bottom-page-info">Please
                        <span className="span-link" onClick={() =>
                            this.props.displayForm('login')
                        }> sign in </span> or
                        <span className="span-link" onClick={() =>
                            this.props.displayForm('signup')
                        }> register </span> to play a game.
                    </p>
                </div>}
            </div>
        );
    };
}


export default Mainpage;

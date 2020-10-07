import Main_photo from "./checkers_placeholder.png";
import React from "react";

class Mainpage extends React.Component {
    constructor(props) {
        super(props);
    }

    playGame = () => {
        console.log("It works!");
        this.props.displayForm('game')
    }

    render() {
        return (
            <div className=" website-styles center-main-container main-page">
                    <h1> <span className="badge badge-success title">Welcome to Checkers!</span> </h1>
                <div className="photo">
                    {/*For react dev*/}
                    {/*<img id="placeholder-photo" src={Main_photo} alt="Placeholder"/>*/}
                    {/*For django runserver*/}
                    <img src="/static/checkers_placeholder.png" onClick={() =>
                            this.props.displayForm('login')} alt="Placeholder"/>
                </div>
                <div>
                    <p className="centered bottom-page-info">Please
                        <span className="span-link" onClick={() =>
                            this.props.displayForm('login')
                        }> sign in </span> or
                        <span className="span-link" onClick={() =>
                            this.props.displayForm('signup')
                        }> register </span> to play a game.
                    </p>
                </div>
                <button className="btn btn-sm btn-success" onClick={this.playGame}>Look at gameboard layout</button>
            </div>
        );
    };
}

export default Mainpage;

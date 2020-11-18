import React from "react";

class GamePopUp extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="pop-up">
                <div className="pop-up-content">
                    <div className="pop-up-title">
                        Opponent wants to play again
                    </div>
                    <div className="flex-wrapper yes-no-buttons">
                        <div className="button-area">
                            <button id="yes-button"
                                    className="btn btn-lg btn-success"
                                    onClick={(e) => {
                                        this.props.yesButton(e)
                                    }}
                            >Yes
                            </button>
                            <button id="no-button"
                                    className="btn btn-lg btn-danger"
                                    onClick={(e) => {
                                        this.props.noButton(e)
                                    }}
                            >No
                            </button>
                        </div>

                    </div>
                </div>
            </div>


        );
    }
}

export default GamePopUp;


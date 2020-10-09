import React from "react";
import './Game.css';


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blackPiecess: ""
        }
        this.board = [
            null, 0, null, 1, null, 2, null, 3,
            4, null, 5, null, 6, null, 7, null,
            null, 8, null, 9, null, 10, null, 11,
            null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null,
            12, null, 13, null, 14, null, 15, null,
            null, 16, null, 17, null, 18, null, 19,
            20, null, 21, null, 22, null, 23, null
            ];
        this.turn = true;
        this.redScore = 12;
        this.blackScore = 12;
        this.playerPieces = "tbd";
        
        this.selectedPiece = {
            pieceId: -1,
            indexOfBoardPiece: -1,
            isKing: false,
            seventhSpace: false,
            ninthSpace: false,
            fourteenthSpace: false,
            eighteenthSpace: false,
            minusSeventhSpace: false,
            minusNinthSpace: false,
            minusFourteenthSpace: false,
            minusEighteenthSpace: false
            };
        // DOM referenes
        this.cells = document.querySelectorAll("td");
        this.redsPieces = document.querySelectorAll("p");
        this.blacksPieces = document.querySelectorAll("span")
        this.redTurnText = document.querySelectorAll(".red-turn-text");
        this.blackTurntext = document.querySelectorAll(".black-turn-text");
        this.divider = document.querySelector("#divider")

    }


    handleGiveUpButton = () => {
        console.log("Message: Player has given up.")
    }

    goToLobby = () => {
        console.log("Message: Player wants to exit to lobby.")
        this.props.displayForm('lobby')
    }

    playAgainButton = () => {
        console.log("Message: Player would like to play again.")
    }

    //Game function

    addCustomState = () => {
        console.log("this.redsPieces: " + this.redsPieces)
        console.log("this.redsPieces: " + this.redsPieces.length)
        console.log("this.redScore: " + this.redScore)
        console.log("przed przypisaniem do stanu " + document.querySelectorAll("span").length)
        this.setState({blackPiecess: document.querySelectorAll("span")})
        console.log("this.state.blackPiecess length po przypisaniu do stanu, " + this.state.blackPiecess.length)
    }

    givePiecesEventListeners = () => {
    //  who plays; true -> reds; false -> blacks
        var cellss = document.querySelectorAll("td");

        console.log("givePiecesEventListeners function.");
        console.log("this.cells length, " + this.cells.length)
        console.log("this.redsPieces length, " + this.redsPieces.length)
        console.log("this.blacksPieces length, " + this.blacksPieces.length)
        console.log("cellss length, " + cellss.length)
        console.log("this.state.blackPiecess length, " + this.state.blackPiecess.length)
        if (this.turn) {
            for (let i = 0; i < this.redsPieces.length; i++) {
                this.redsPieces[i].addEventListener("click", this.getPlayerPieces);
            }
        } else {
            for (let i = 0; i < this.blacksPieces.length; i++) {
                this.blacksPieces[i].addEventListener("click", this.getPlayerPieces);
                }
            }
        }

    getPlayerPieces = () => {
        console.log("getPlayerPieces function.");
        if (this.turn) {
            this.setState({playerPieces: this.redsPieces});
        } else {
            this.setState({playerPieces: this.blacksPieces})
        }
        this.removeCellonclick();
        this.resetBorders();
        }

    // removes possible moves from old selected piece (* this is needed because the user might re-select a piece *)
    removeCellonclick = () => {
    for (let i = 0; i < this.cells.length; i++) {
        this.cells[i].removeAttribute("onclick");
        }
    }

    // resets borders to default
    resetBorders = () => {
    for (let i = 0; i < this.playerPieces.length; i++) {
        this.playerPieces[i].style.border = "1px solid white";
    }
    this.resetSelectedPieceProperties();
    this.getSelectedPiece();
    }

    // resets selected piece properties
    resetSelectedPieceProperties = () => {
    this.selectedPiece.pieceId = -1;
    this.selectedPiece.pieceId = -1;
    this.selectedPiece.isKing = false;
    this.selectedPiece.seventhSpace = false;
    this.selectedPiece.ninthSpace = false;
    this.selectedPiece.fourteenthSpace = false;
    this.selectedPiece.eighteenthSpace = false;
    this.selectedPiece.minusSeventhSpace = false;
    this.selectedPiece.minusNinthSpace = false;
    this.selectedPiece.minusFourteenthSpace = false;
    this.selectedPiece.minusEighteenthSpace = false;
    }


    // gets ID and index of the board cell its on
    getSelectedPiece = (e) => {
    this.selectedPiece.pieceId = parseInt(e.target.id);
    this.selectedPiece.indexOfBoardPiece = this.findPiece(this.selectedPiece.pieceId);
    this.isPieceKing();
    }

    findPiece = (pieceId) => {
    let parsed = parseInt(pieceId);
    return this.board.indexOf(parsed);
    };


    // checks if selected piece is a king
    isPieceKing = () => {
        if (document.getElementById(this.selectedPiece.pieceId).classList.contains("king")) {
            this.selectedPiece.isKing = true;
        } else {
            this.selectedPiece.isKing = false;
        }
        this.getAvailableSpaces();
    }


    // gets the moves that the selected piece can make
    getAvailableSpaces = () => {
    if (this.board[this.selectedPiece.indexOfBoardPiece + 7] === null &&
        this.cells[this.selectedPiece.indexOfBoardPiece + 7].classList.contains("noPieceHere") !== true) {
        this.selectedPiece.seventhSpace = true;
    }
    if (this.board[this.selectedPiece.indexOfBoardPiece + 9] === null &&
        this.cells[this.selectedPiece.indexOfBoardPiece + 9].classList.contains("noPieceHere") !== true) {
        this.selectedPiece.ninthSpace = true;
    }
    if (this.board[this.selectedPiece.indexOfBoardPiece - 7] === null &&
        this.cells[this.selectedPiece.indexOfBoardPiece - 7].classList.contains("noPieceHere") !== true) {
        this.selectedPiece.minusSeventhSpace = true;
    }
    if (this.board[this.selectedPiece.indexOfBoardPiece - 9] === null &&
        this.cells[this.selectedPiece.indexOfBoardPiece - 9].classList.contains("noPieceHere") !== true) {
        this.selectedPiece.minusNinthSpace = true;
    }
    this.checkAvailableJumpSpaces();
}

// gets the moves that the selected piece can jump
    checkAvailableJumpSpaces = () => {
        if (this.turn) {
            if (this.board[this.selectedPiece.indexOfBoardPiece + 14] === null
            && this.cells[this.selectedPiece.indexOfBoardPiece + 14].classList.contains("noPieceHere") !== true
            && this.board[this.selectedPiece.indexOfBoardPiece + 7] >= 12) {
                this.selectedPiece.fourteenthSpace = true;
            }
            if (this.board[this.selectedPiece.indexOfBoardPiece + 18] === null
            && this.cells[this.selectedPiece.indexOfBoardPiece + 18].classList.contains("noPieceHere") !== true
            && this.board[this.selectedPiece.indexOfBoardPiece + 9] >= 12) {
                this.selectedPiece.eighteenthSpace = true;
            }
            if (this.board[this.selectedPiece.indexOfBoardPiece - 14] === null
            && this.cells[this.selectedPiece.indexOfBoardPiece - 14].classList.contains("noPieceHere") !== true
            && this.board[this.selectedPiece.indexOfBoardPiece - 7] >= 12) {
                this.selectedPiece.minusFourteenthSpace = true;
            }
            if (this.board[this.selectedPiece.indexOfBoardPiece - 18] === null
            && this.cells[this.selectedPiece.indexOfBoardPiece - 18].classList.contains("noPieceHere") !== true
            && this.board[this.selectedPiece.indexOfBoardPiece - 9] >= 12) {
                this.selectedPiece.minusEighteenthSpace = true;
            }
        } else {
            if (this.board[this.selectedPiece.indexOfBoardPiece + 14] === null
            && this.cells[this.selectedPiece.indexOfBoardPiece + 14].classList.contains("noPieceHere") !== true
            && this.board[this.selectedPiece.indexOfBoardPiece + 7] < 12 && this.board[this.selectedPiece.indexOfBoardPiece + 7] !== null) {
                this.selectedPiece.fourteenthSpace = true;
            }
            if (this.board[this.selectedPiece.indexOfBoardPiece + 18] === null
            && this.cells[this.selectedPiece.indexOfBoardPiece + 18].classList.contains("noPieceHere") !== true
            && this.board[this.selectedPiece.indexOfBoardPiece + 9] < 12 && this.board[this.selectedPiece.indexOfBoardPiece + 9] !== null) {
                this.selectedPiece.eighteenthSpace = true;
            }
            if (this.board[this.selectedPiece.indexOfBoardPiece - 14] === null && this.cells[this.selectedPiece.indexOfBoardPiece - 14].classList.contains("noPieceHere") !== true
            && this.board[this.selectedPiece.indexOfBoardPiece - 7] < 12
            && this.board[this.selectedPiece.indexOfBoardPiece - 7] !== null) {
                this.selectedPiece.minusFourteenthSpace = true;
            }
            if (this.board[this.selectedPiece.indexOfBoardPiece - 18] === null && this.cells[this.selectedPiece.indexOfBoardPiece - 18].classList.contains("noPieceHere") !== true
            && this.board[this.selectedPiece.indexOfBoardPiece - 9] < 12
            && this.board[this.selectedPiece.indexOfBoardPiece - 9] !== null) {
                this.selectedPiece.minusEighteenthSpace = true;
            }
        }
        this.checkPieceConditions();
    }

    // restricts movement if the piece is a king
    checkPieceConditions = () => {
    if (this.selectedPiece.isKing) {
        this.givePieceBorder();
    } else {
        if (this.turn) {
            this.selectedPiece.minusSeventhSpace = false;
            this.selectedPiece.minusNinthSpace = false;
            this.selectedPiece.minusFourteenthSpace = false;
            this.selectedPiece.minusEighteenthSpace = false;
        } else {
            this.selectedPiece.seventhSpace = false;
            this.selectedPiece.ninthSpace = false;
            this.selectedPiece.fourteenthSpace = false;
            this.selectedPiece.eighteenthSpace = false;
        }
        this.givePieceBorder();
    }
}


    // gives the piece a green highlight for the user (showing its movable)
    givePieceBorder = () => {
    if (this.selectedPiece.seventhSpace || this.selectedPiece.ninthSpace || this.selectedPiece.fourteenthSpace || this.selectedPiece.eighteenthSpace
    || this.selectedPiece.minusSeventhSpace || this.selectedPiece.minusNinthSpace || this.selectedPiece.minusFourteenthSpace || this.selectedPiece.minusEighteenthSpace) {
        document.getElementById(this.selectedPiece.pieceId).style.border = "3px solid green";
        this.giveCellsClick();
    } else {
        return;
    }
}



// gives the cells on the board a 'click' bassed on the possible moves
    giveCellsClick = () => {
    if (this.selectedPiece.seventhSpace) {
        this.cells[this.selectedPiece.indexOfBoardPiece + 7].setAttribute("onclick", "makeMove(7)");
    }
    if (this.selectedPiece.ninthSpace) {
        this.cells[this.selectedPiece.indexOfBoardPiece + 9].setAttribute("onclick", "makeMove(9)");
    }
    if (this.selectedPiece.fourteenthSpace) {
        this.cells[this.selectedPiece.indexOfBoardPiece + 14].setAttribute("onclick", "makeMove(14)");
    }
    if (this.selectedPiece.eighteenthSpace) {
        this.cells[this.selectedPiece.indexOfBoardPiece + 18].setAttribute("onclick", "makeMove(18)");
    }
    if (this.selectedPiece.minusSeventhSpace) {
        this.cells[this.selectedPiece.indexOfBoardPiece - 7].setAttribute("onclick", "makeMove(-7)");
    }
    if (this.selectedPiece.minusNinthSpace) {
        this.cells[this.selectedPiece.indexOfBoardPiece - 9].setAttribute("onclick", "makeMove(-9)");
    }
    if (this.selectedPiece.minusFourteenthSpace) {
        this.cells[this.selectedPiece.indexOfBoardPiece - 14].setAttribute("onclick", "makeMove(-14)");
    }
    if (this.selectedPiece.minusEighteenthSpace) {
        this.cells[this.selectedPiece.indexOfBoardPiece - 18].setAttribute("onclick", "makeMove(-18)");
    }
}

/* v when the cell is clicked v */

// makes the move that was clicked
    makeMove = (number) => {
        document.getElementById(this.selectedPiece.pieceId).remove();
        this.cells[this.selectedPiece.indexOfBoardPiece].innerHTML = "";
        if (this.turn) {
            if (this.selectedPiece.isKing) {
                this.cells[this.selectedPiece.indexOfBoardPiece + number].innerHTML = `<p class="red-piece king" id="${this.selectedPiece.pieceId}"></p>`;
                this.redsPieces = document.querySelectorAll("p");
            } else {
                this.cells[this.selectedPiece.indexOfBoardPiece + number].innerHTML = `<p class="red-piece" id="${this.selectedPiece.pieceId}"></p>`;
                this.redsPieces = document.querySelectorAll("p");
            }
        } else {
            if (this.selectedPiece.isKing) {
                this.cells[this.selectedPiece.indexOfBoardPiece + number].innerHTML = `<span class="black-piece king" id="${this.selectedPiece.pieceId}"></span>`;
                this.blacksPieces = document.querySelectorAll("span");
            } else {
                this.cells[this.selectedPiece.indexOfBoardPiece + number].innerHTML = `<span class="black-piece" id="${this.selectedPiece.pieceId}"></span>`;
                this.blacksPieces = document.querySelectorAll("span");
            }
        }

        let indexOfPiece = this.selectedPiece.indexOfBoardPiece
        if (number === 14 || number === -14 || number === 18 || number === -18) {
            this.changeData(indexOfPiece, indexOfPiece + number, indexOfPiece + number / 2);
        } else {
            this.changeData(indexOfPiece, indexOfPiece + number);
        }
    }

// Changes the board states data on the back end
    changeData = (indexOfBoardPiece, modifiedIndex, removePiece) => {
        this.board[indexOfBoardPiece] = null;
        this.board[modifiedIndex] = parseInt(this.selectedPiece.pieceId);
        if (this.turn && this.selectedPiece.pieceId < 12 && modifiedIndex >= 57) {
            document.getElementById(this.selectedPiece.pieceId).classList.add("king")
        }
        if (this.turn === false && this.selectedPiece.pieceId >= 12 && modifiedIndex <= 7) {
            document.getElementById(this.selectedPiece.pieceId).classList.add("king");
        }
        if (removePiece) {
            this.board[removePiece] = null;
            if (this.turn && this.selectedPiece.pieceId < 12) {
                this.cells[removePiece].innerHTML = "";
                this.blackScore--
            }
            if (this.turn === false && this.selectedPiece.pieceId >= 12) {
                this.cells[removePiece].innerHTML = "";
                this.redScore--
            }
        }
        this.resetSelectedPieceProperties();
        this.removeCellonclick();
        this.removeEventListeners();
    }

// removes the 'onClick' event listeners for pieces
    removeEventListeners = () => {
        if (this.turn) {
            for (let i = 0; i < this.redsPieces.length; i++) {
                this.redsPieces[i].removeEventListener("click", this.getPlayerPieces);
            }
        } else {
            for (let i = 0; i < this.blacksPieces.length; i++) {
                this.blacksPieces[i].removeEventListener("click", this.getPlayerPieces);
            }
        }
        this.checkForWin();
    }

// Checks for a win
    checkForWin = () => {
        if (this.blackScore === 0) {
            this.divider.style.display = "none";
            for (let i = 0; i < this.redTurnText.length; i++) {
                this.redTurnText[i].style.color = "black";
                this.blackTurntext[i].style.display = "none";
                this.redTurnText[i].textContent = "RED WINS!";
            }
        } else if (this.redScore === 0) {
            this.divider.style.display = "none";
            for (let i = 0; i < this.blackTurntext.length; i++) {
                this.blackTurntext[i].style.color = "black";
                this.redTurnText[i].style.display = "none";
                this.blackTurntext[i].textContent = "BLACK WINS!";
            }
        }
        this.changePlayer();
    }

// Switches players turn
    changePlayer = () => {
        if (this.turn) {
            this.turn = false;
            for (let i = 0; i < this.redTurnText.length; i++) {
                this.redTurnText[i].style.color = "lightGrey";
                this.blackTurntext[i].style.color = "black";
            }
        } else {
            this.turn = true;
            for (let i = 0; i < this.blackTurntext.length; i++) {
                this.blackTurntext[i].style.color = "lightGrey";
                this.redTurnText[i].style.color = "black";
            }
        }
        this.givePiecesEventListeners();
    }

    componentDidMount() {
        this.addCustomState();
        this.givePiecesEventListeners();
    }

    render() {


        return (

            <div className="game-page website-styles center-main-container ">

                <div className="flex-wrapper border-padding btn-group">
                    <div style={{flex:3}}>
                        <button className="btn btn-sm btn-success disabled" onClick={this.handleGiveUpButton}>Give up</button>
                    </div>
                    <div style={{flex:3}}>
                        <button className="btn btn-sm btn-success" onClick={this.goToLobby}>Exit to lobby</button>
                    </div>
                    <div style={{flex:3}}>
                        <button className="btn btn-sm btn-success disabled" onClick={this.playAgainButton}>Ask to play again</button>
                    </div>
                </div>


                <main>
                    {/*<div className="red-turn-text mobile">*/}
                    {/*    Reds turn*/}
                    {/*</div>*/}

                    <table>
                        <tr>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="0"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="1"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="2"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="3"></p></td>
                        </tr>
                        <tr>
                            <td><p className="red-piece" id="4"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="5"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="6"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="7"></p></td>
                            <td className="noPieceHere"></td>
                        </tr>
                        <tr>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="8"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="9"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="10"></p></td>
                            <td className="noPieceHere"></td>
                            <td><p className="red-piece" id="11"></p></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td className="noPieceHere"></td>
                            <td></td>
                            <td className="noPieceHere"></td>
                            <td></td>
                            <td className="noPieceHere"></td>
                            <td></td>
                            <td className="noPieceHere"></td>
                        </tr>
                        <tr>
                            <td className="noPieceHere"></td>
                            <td></td>
                            <td className="noPieceHere"></td>
                            <td></td>
                            <td className="noPieceHere"></td>
                            <td></td>
                            <td className="noPieceHere"></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><span className="black-piece" id="12"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="13"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="14"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="15"></span></td>
                            <td className="noPieceHere"></td>
                        </tr>
                        <tr>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="16"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="17"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="18"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="19"></span></td>
                        </tr>
                        <tr>
                            <td><span className="black-piece" id="20"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="21"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="22"></span></td>
                            <td className="noPieceHere"></td>
                            <td><span className="black-piece" id="23"></span></td>
                            <td className="noPieceHere"></td>
                        </tr>
                    </table>

                    <div className="desktop label-inline-block ">
                        <div className="red-turn-text">
                            Reds turn
                        </div>
                        <div id="divider">|</div>
                        <div className="black-turn-text label-inline-block ">
                            Blacks turn
                        </div>
                    </div>
                </main>
                    {/*<div className="black-turn-text mobile">*/}
                    {/*    Blacks turn*/}
                    {/*</div>*/}
            </div>
        );
    };
}

export default Game;
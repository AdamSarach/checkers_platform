import React from "react";

// const roomName = JSON.parse(document.getElementById('room-name').textContent);
const roomName = 'all'

const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/chat/'
    + roomName
    + '/'
);

// props.username to add
chatSocket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    document.getElementById("chat-log").value += (data.user + ": " + data.message + '\n');
};



chatSocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};


class Chatwindow extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log("Chat window, componentdidmount: " + this.props.user);
    }

    onResetInfoMessage = () =>{
        this.setState(
            {'infoMessage': ''}
            )
    }

    clickEnter = (e) => {
        if (e.key === 'Enter') {
            document.getElementById("chat-message-submit").click();
        }
    };


    handleChatMessage = (e) => {
        console.log("Chat window, handlechatmessage: " + this.props.user);
        const element = document.getElementById("chat-message-input");
        const message = element.value;
        chatSocket.send(JSON.stringify({
                'message': message,
                'user': this.props.user
            }));
            element.value = '';
    }

    render() {


        // document.querySelector('#chat-message-input').focus();
        // document.querySelector('#chat-message-input').onkeyup = function(e) {
        //     if (e.keyCode === 13) {  // enter, return
        //         document.querySelector('#chat-message-submit').click();
        //     }
        // };

        // document.querySelector('#chat-message-submit').onclick = function(e) {
        //     const messageInputDom = document.querySelector('#chat-message-input');
        //     const message = messageInputDom.value;
        //     chatSocket.send(JSON.stringify({
        //         'message': message
        //     }));
        //     messageInputDom.value = '';
        // };

        return (
            <div id="chat-window">
                <textarea id="chat-log" cols="40" rows="4"></textarea>
                <br />
                <div>
                    <input className="pull-left"
                    id="chat-message-input"
                    type="text"
                    size="40"
                    onKeyPress = {this.clickEnter}
                    />
                    <br />
                    <input
                        className="pull-right"
                        id="chat-message-submit"
                        type="button"
                        value="Send"
                        onClick={this.handleChatMessage}
                    />
                </div>
            </div>


            )
        }
    }

export default Chatwindow;
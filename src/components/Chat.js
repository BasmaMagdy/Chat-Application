import React, { useEffect,useRef } from "react";
import { useAtom } from 'jotai'
import { currentMessageAtom,messageListAtom,setMessageListAtom } from '../state.js';

function Chat({ socket, username, room }) {
    let [currentMessage,setCurrentMessage] = useAtom(currentMessageAtom);
    const [messageList] = useAtom(messageListAtom);
    const [,setMessageList] = useAtom(setMessageListAtom);

    const inv = useRef(null);
    const sendMessage = async () => {
        if (currentMessage !== "") {
            const messageData = {
                id: Math.random().toString(36).substring(2,),
                room: room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };
            await socket.emit("send_message", messageData);
            setMessageList(messageData);
            currentMessage = "";
        }
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageList(data);
        });
        return () => socket.off("receive_message");
    }, [setMessageList,socket]);
    useEffect(()=>{
        inv.current.scrollIntoView({ block: "nearest", behavior: 'smooth' });
    });

    return (
        <div className="chat-window">
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                {messageList.map((messageContent) => {
                    return (
                        <div className="message" key={messageContent.id} id={username === messageContent.author ? "you" : "other"}>
                            <div className="message-content">
                                <p>{messageContent.message}</p>
                            </div>
                            <div className="message-meta">
                                <p id="time">{messageContent.time}</p>
                                <p id="author">{messageContent.author}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={inv}></div>
            </div>
            <div className="chat-footer">
                <input
                    value = {currentMessage}
                    type="text"
                    placeholder="Hey..."
                    onChange={(event) => setCurrentMessage(event.target.value)}
                    onKeyDown={(event) => {
                        event.key === "Enter" && sendMessage();
                    }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    );
}

export default Chat;
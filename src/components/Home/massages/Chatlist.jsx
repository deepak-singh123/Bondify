import { useSelector } from "react-redux";
import Friends from "./friends";
import Navbar from "../Nav";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import Badge from "@mui/material/Badge";
import { FaImage } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";

const Chatlist = () => {
    const followers = useSelector((store) => store.followersinfo.followers);
    const following = useSelector((store) => store.followinginfo.following);
    const [chatperson, setchatperson] = useState(null);
    const [active, setactive] = useState(" ");
    const connectionlist = [
        ...followers.filter(
            (follower) => !following.some((follow) => follow.id === follower.id)
        ),
        ...following,
    ];
    const messages = [
        { text: 'Hi, how are you?', sender: 'friend' },
        { text: "I'm good, thanks!", sender: 'self' },
        { text: 'Great to hear!', sender: 'friend' },
        { text: 'Hi, how are you?', sender: 'friend' },
        { text: "I'm good, thanks!", sender: 'self' },
        { text: 'Great to hear!', sender: 'friend' },
        { text: 'Hi, how are you?', sender: 'friend' },
        { text: "I'm good, thanks!", sender: 'self' },
        { text: 'Great to hear!', sender: 'friend' },
    ];
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const getfrienddetail = (friend) => {
        setchatperson(friend);
        setactive("active");
    };
   
    
    return (
        <>
            <div className="messages-container">
                <Navbar />
                <div className="messages">
                    <div className="suggestions-list friends-list">
                        <h1>Chat</h1>
                        {connectionlist.map((friend) => (
                            <Friends
                                key={friend._id}
                                friend={friend}
                                getfrienddetail={getfrienddetail}
                            />
                        ))}
                    </div>
                    <div className={`chatarea ${active}`}>
                        {chatperson && (
                            <div className="chatarea-header">
                                <div className="follower-card header">
                                    <div className="follower-info">
                                        <Badge
                                            badgeContent=" "
                                            color="success"
                                            variant="dot"
                                            anchorOrigin={{
                                                vertical: "top",
                                                horizontal: "right",
                                            }}
                                        ></Badge>

                                        <img
                                            src={chatperson.profilePicture}
                                            alt={chatperson.username}
                                        />
                                        <h2 className="username">{chatperson.username}</h2>
                                    </div>
                                </div>
                            </div>
                        )}

                            <div className="chatarea-messages">

                            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`message ${msg.sender === 'self' ? 'sent' : 'received'}`}
                >
                    <p>{msg.text}</p>
                </div>
            ))}
            <div ref={messagesEndRef} />

                        
                            </div>












                        <div className="chatarea-input">
                            <button className="option-btn">
                                <input
                                    className="postinputimage"
                                    type="file"
                                    accept="image/*"
                                />
                                <FaRegImage />
                            </button>
                            <input
                                type="text"
                                className="chatarea-chat-input"
                                placeholder="Type a message"
                            />
                            <button>
                                <IoSend />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Chatlist;

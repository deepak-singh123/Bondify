import { useDispatch, useSelector } from "react-redux";
import Friends from "./friends";
import Navbar from "../Nav";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import Badge from "@mui/material/Badge";
import { FaImage } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";
import { set } from "mongoose";
import { addmessage, fetchmessages } from "../../../store/messagesSlice";
import { socket } from "../../../App";
import { user } from "../../../../backend/models/user";

const Chatlist = () => {
    const followers = useSelector((store) => store.followersinfo.followers);
    const following = useSelector((store) => store.followinginfo.following);
    const [chatperson, setchatperson] = useState(null);
    const [onlineusers,setonlineusers] = useState([]);
    const [active, setactive] = useState(" ");
    const [message,setmessage] = useState("");
    const [color,setcolor]=useState("error");
    const curruser = useSelector((store) => store.user.user);
    const messages = useSelector((store) => store.messages);
    const dispatch = useDispatch();
    console.log("messages",messages);
    const connectionlist = [
        ...followers.filter(
            (follower) => !following.some((follow) => follow.id === follower.id)
        ),
        ...following,
    ];

    useEffect(() => {
        socket.emit("user_online", curruser._id);

        socket.on("online_users", (users) => {
           setonlineusers(users);
          });
        
        

        socket.on("recieve_message",(data)=>{
          const by =  data.senderId === curruser._id?"self":"friend";
            messages.push({data,by})
            
        })
    }, []); // Empty dependency array to run only on mount

    const handlesendmessage=()=>{
        const newMessage = { 
            senderId: curruser._id, 
            by: "self", 
            content: message, 
            timestamp: new Date() 
          };
        
        socket.emit("send_message", {
            senderId: curruser._id,
            receiverId: chatperson._id,
            content: message,
        });

        dispatch(addmessage(newMessage));
    }
    
    useEffect(()=>{
        if(chatperson){dispatch(fetchmessages(chatperson._id)).unwrap();
    }},[messages,dispatch]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const getfrienddetail = (friend,color) => {
        setchatperson(friend);
        setactive("active");
        setcolor(color);
    };
   
    const handlemessage=(e)=>{
        const message = e.target.value;
        setmessage(message);

    }
    


    return (
        <>
            <div className="messages-container">
                <Navbar />
                <div className="messages">
                    <div className="suggestions-list friends-list">
                        <h1>Chat</h1>
                        {connectionlist.map((friend) => (
                            <Friends
                            onlineusers={onlineusers}
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
                                            color={color}
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

                          { chatperson &&  <div className="chatarea-messages">

                            {messages && messages.map((msg, index) => (
                <div
                    key={index}
                    className={`message ${msg.sender === 'self' ? 'sent' : 'received'}`}
                >
                    <div className="chatarea-header">
                                <div className="follower-card header">
                                    <div className="follower-info">
                                        

                                        <img
                                            src={msg.sender === 'self'? curruser.profilePicture : chatperson.profilePicture}
                                            alt={chatperson.username}
                                        />
                
                                    </div>
                                </div>
                            </div><p>{msg.content}</p>
                </div>
            ))}
            <div ref={messagesEndRef} />

                        
                            </div>}



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
                                onChange={(e)=>{handlemessage(e)}}
                                className="chatarea-chat-input"
                                placeholder="Type a message"
                            />
                            <button  onClick={handlesendmessage}>
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

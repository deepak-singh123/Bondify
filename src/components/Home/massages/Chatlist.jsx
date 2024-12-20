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
import { user } from "../../../../backend/models/user";
import { socket } from "../../../App";

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
    const [connectionlist, setConnectionList] = useState([]);

    const dispatch = useDispatch();
   
   
    useEffect(() => {
       const updatedConnectionList = [
        ...followers.filter(
            (follower) => !following.some((follow) => follow.id === follower.id)
        ),
        ...following,
    ];
        setConnectionList(updatedConnectionList);
    }, [onlineusers, followers, following]);

    useEffect(() => {
        console.log("emitted online user");

        socket.emit("user_online", curruser._id);

        socket.on("online_users", (users) => {
            console.log("online-user= ",users);
           setonlineusers(users);
          });
        
      
    }, []); // Empty dependency array to run only on mount

    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log("received message= ", data);
            const by = data.senderId === curruser._id ? "self" : "friend";
            const newMessage = {
                senderId: data.senderId,
                by: by,
                content: data.content,
                timestamp: data.timestamp,
            };
    
           
            const messageExists = messages.some(
                (msg) => msg.content === newMessage.content && msg.timestamp === newMessage.timestamp
            );
    
          
            if (!messageExists) {
                dispatch(addmessage(newMessage));
            }
        });
    
        
        return () => {
            socket.off("receive_message");
        };
    }, [dispatch, messages, curruser._id]);
    

    const handlesendmessage=()=>{
        
        if (message.trim()) {
            const newMessage = {
                senderId: curruser._id,
                by: "self",
                content: message,
                timestamp: new Date().toISOString(),
            };

            // Emit the message using socket
            socket.emit("send_message", {
                senderId: curruser._id,
                receiverId: chatperson._id,
                content: message,
            });

            dispatch(addmessage(newMessage));
            setmessage("");
        }

       
    }
    
   /* useEffect(()=>{
        if(chatperson){dispatch(fetchmessages(chatperson._id));
    }},[messages,dispatch]);*/
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
                    className={`message ${msg.by === 'self' ? 'sent' : 'received'}`}
                >
                 
     

                            <p>{msg.content}</p>
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
                                value={message}
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
/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import Friends from "./friends";
import Navbar from "../Nav";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import Badge from "@mui/material/Badge";
import { FaRegImage } from "react-icons/fa6";
import {
  addmessage,
  clearMessages,
  fetchmessages,
} from "../../../store/messagesSlice";
import { socket } from "../../../App";
import { IoCheckmarkDone } from "react-icons/io5";
import {
  fetchunreadcount,
  settotalcount,
  setunreadcount,
} from "../../../store/messagecount";
import { MdKeyboardBackspace } from "react-icons/md";

const Chatlist = () => {
  const followers = useSelector((store) => store.followersinfo.followers);
  const following = useSelector((store) => store.followinginfo.following);
  const [chatperson, setchatperson] = useState(null);
  const [onlineusers, setonlineusers] = useState([]);
  const [active, setactive] = useState(" ");
  const [message, setmessage] = useState("");
  const [color, setcolor] = useState("error");
  const curruser = useSelector((store) => store.user.user);
  const messages = useSelector((store) => store.messages);
  const [connectionlist, setConnectionList] = useState([]);
  const [sortedconnectionlist, setsortedconnectionlist] = useState([]);
  const [chatimage, setchatimage] = useState(null);
  let [file, setFile] = useState(null);
  const [triggermessageid, settriggermessage] = useState(null);
  const dispatch = useDispatch();
  const { unreadcounts, totalmessagecount } = useSelector(
    (state) => state.messagecount
  );

  useEffect(() => {

      const sortedList = [...connectionlist].sort((a, b) => {
      const isOnlineA = onlineusers.includes(a._id) ? 1 : 0;
      const isOnlineB = onlineusers.includes(b._id) ? 1 : 0;

      // Online users come first
      return isOnlineB - isOnlineA;
    });

    setsortedconnectionlist(sortedList);
  }, [onlineusers, followers, following]);
  const handleimage = (e) => {
    file = e.target.files[0];
    if (!file || file.size > 5 * 1024 * 1024) {
      alert("File size exceeds the limit of 5MB.");
      return;
    }

    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setchatimage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected");
    }
  };

/*
useEffect(() => {

    if (chatperson && triggermessageid && chatperson._id == triggermessageid) {
      console.log("Messages marked as read for:", chatperson.username);

      try {
      
  
        socket.emit("message_seen", {
          senderId: curruser._id,
          receiverId: chatperson._id,
        });

        console.log("Message seen notification sent to server.");
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    }
  

}, [chatperson, triggermessageid]); // Trigger when chatperson or triggermessageid changes*/

/*
useEffect(() => {
  const handleMessageResponse = (data) => {
    console.log("reciever-tan -data",data);
    if (data.receiver && data.sender) {
      console.log("inside message_response event with valid data:", data);
      dispatch(fetchmessages({ id: data.sender, curruser: data.receiver }));
    } else {
      console.error("Invalid data in message_response event:", data);
    }
  };

  // Register the socket listener
  socket.on("message_response", handleMessageResponse);

  // Cleanup to avoid multiple registrations
  return () => {
    socket.off("message_response", handleMessageResponse);
  };
}, [dispatch]); // Only run when `dispatch` changes*/


  const getfrienddetail = async (friend, color) => {
    setchatperson(friend);
    setactive("active");
    setcolor(color);

    try {
      // Mark messages as read in the backend
      await fetch("http://localhost:3000/messages/markasread", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          senderId: friend._id,
          receiverId: curruser._id,
        }),
      });

      // Update Redux state for unread counts
      const updatedUnreadCounts = unreadcounts.filter(
        (item) => item._id !== friend._id
      ); // Remove friend from unread list
      const friendUnreadCount =
        unreadcounts.find((item) => item._id === friend._id)?.count || 0;
      const newTotalUnread = totalmessagecount - friendUnreadCount;

      // Dispatch updates
      dispatch(setunreadcount(updatedUnreadCounts)); // Update unread counts grouped by friends
      dispatch(settotalcount(newTotalUnread)); // Update total unread count

      // Optionally fetch updated counts from the server
      dispatch(fetchunreadcount());
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handlemessage = (e) => {
    const message = e.target.value;
    setmessage(message);
  };

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
    socket.emit("user_online", curruser._id);
    socket.on("online_users", (users) => {
      setonlineusers(users);
    });
  }, [curruser._id, followers, following]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      const by = data.sender === curruser._id ? "self" : "friend";
      const newMessage = {
        senderId: data.senderId,
        by: by,
        content: data.content,
        createdAt: data.createdAt,
        type: data.type,
      };

      const messageExists = messages.some(
        (msg) =>
          msg.content === newMessage.content &&
          msg.timestamp === newMessage.timestamp
      );

      if (!messageExists) {

        dispatch(addmessage(newMessage));
        settriggermessage(data.sender);
      }
    });

    socket.on("receive_image", (data) => {
      console.log("received image= ", data);
      const by = data.sender === curruser._id ? "self" : "friend";
      const newMessage = {
        senderId: data.sender,
        by: by,
        content: data.content,
        createdAt: data.createdAt,
        type: data.type,
      };

      const messageExists = messages.some(
        (msg) =>
          msg.content === newMessage.content &&
          msg.timestamp === newMessage.timestamp
      );

      if (!messageExists) {
        console.log("setting triggermessage as ",data.sender);
        dispatch(addmessage(newMessage));
        settriggermessage(data.sender);
      }
    });

    return () => {
      socket.off("receive_message");
    socket.off("receive_image");
    socket.off("message_seen");
    };
  }, [dispatch, messages, curruser._id]);

  const handlesendmessage = async () => {
    if (file) {
      setchatimage(null);
      const formdata = new FormData();
      formdata.append("chatimage", file);

      try {
        const response = await fetch(
          "http://localhost:3000/messages/uploadchatimage",
          {
            method: "POST",
            body: formdata,
            credentials: "include",
          }
        );

        const result = await response.json();
        console.log("result = ", result);
        const newMessage = {
          senderId: curruser._id,
          by: "self",
          content: result.content,
          type: "image",
          createdAt: new Date().toISOString(),
        };

        await socket.emit("send_image", {
          senderId: curruser._id,
          receiverId: chatperson._id,
          content: result.content,
          type: "image",
          by: "friend",
          createdAt: new Date().toISOString(),
        });

        dispatch(addmessage(newMessage));
      } catch (err) {
        console.log(err);
      }
    } else if (message.trim()) {
      const newMessage = {
        senderId: curruser._id,
        by: "self",
        content: message,
        type: "text",
        createdAt: new Date().toISOString(),
      };

      // Emit the message using socket

      socket.emit("send_message", {
        senderId: curruser._id,
        receiverId: chatperson._id,
        content: message,
        type: "text",
        createdAt: new Date().toISOString(),
        by: "friend",
      });

      dispatch(addmessage(newMessage));
      setmessage("");
    }
  };

  useEffect(() => {
    if (chatperson) {
      dispatch(clearMessages());
      dispatch(fetchmessages({ id: chatperson._id, curruser })).unwrap();
    }
  }, [dispatch, chatperson, curruser]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className="messages-container">
        <Navbar />
        <div className="messages">
          <div className="suggestions-list friends-list">
            <h1>Chat</h1>
            {sortedconnectionlist.map((friend) => (
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
               <div className="backbtn">
                <MdKeyboardBackspace size={30} onClick={() => setactive(" ")}/>

              </div>
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

            {chatperson && (
              <div className="chatarea-messages">
                {messages &&
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${msg.by === "self" ? "sent" : "received"
                        } ${msg.type === "text" ? " " : "image"}`}
                    >
                      {msg.type === "text" ? (
                        <>
                          <div className="message-text">{msg.content}</div>
                          <div className="message-about">
                            {" "}
                            <div className="message-timestamp">
                              {new Date(msg.createdAt).toLocaleString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true, // For 12-hour format with AM/PM
                              })}
                            </div>
                            <div className="message-status">
                              <IoCheckmarkDone
                                color={msg.isRead ? "cyan" : "defaultColor"}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="received-image">
                            <img
                              src={msg.content}
                              alt="Received"
                              className="received-image"
                            />
                          </div>{" "}
                          <div className="message-about">
                            {" "}
                            <div className="message-timestamp">
                              {new Date(msg.createdAt).toLocaleString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true, // For 12-hour format with AM/PM
                              })}
                            </div>
                            <div className="message-status">
                              <IoCheckmarkDone
                                color={msg.isRead ? "cyan" : "defaultColor"}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            <div className="selected-image">
              {chatimage && <img src={chatimage} alt="Selected" />}
            </div>
            <div className="chatarea-input">
              <button className="option-btn">
                <input
                  onChange={(e) => handleimage(e)}
                  className="postinputimage"
                  type="file"
                  accept="image/*"
                />
                <FaRegImage />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => {
                  handlemessage(e);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { // Ensure Enter is pressed without Shift
                    e.preventDefault(); // Prevent default behavior (e.g., adding a newline)
                    handlesendmessage(); // Call the message send function
                  }
                }}
                className="chatarea-chat-input"
                placeholder="Type a message"
              />
              <button onClick={handlesendmessage}  >
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

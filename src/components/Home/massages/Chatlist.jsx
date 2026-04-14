/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import Friends from "./Friends";
import Navbar from "../Nav";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import Badge from "@mui/material/Badge";
import { FaRegImage } from "react-icons/fa6";
import {
  addmessage,
  clearMessages,
  fetchmessages,
  markMessagesRead,
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
  const [color, setcolor] = useState(" ");
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

  // Use a ref for chatperson so socket handlers always get the latest value
  // without needing to re-register every time chatperson changes
  const chatpersonRef = useRef(null);
  useEffect(() => {
    chatpersonRef.current = chatperson;
  }, [chatperson]);

  useEffect(() => {
    const sortedList = [...connectionlist].sort((a, b) => {
      const isOnlineA = onlineusers.includes(a._id) ? 1 : 0;
      const isOnlineB = onlineusers.includes(b._id) ? 1 : 0;
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
    }
  };

  const getfrienddetail = async (friend, color) => {
    setchatperson(friend);
    setactive("active");
    setcolor(color);

    try {
      await fetch(`/messages/markasread`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          senderId: friend._id,
          receiverId: curruser._id,
        }),
      });

      const updatedUnreadCounts = unreadcounts.filter(
        (item) => item._id !== friend._id
      );
      const friendUnreadCount =
        unreadcounts.find((item) => item._id === friend._id)?.count || 0;
      const newTotalUnread = totalmessagecount - friendUnreadCount;

      dispatch(setunreadcount(updatedUnreadCounts));
      dispatch(settotalcount(newTotalUnread));
      dispatch(fetchunreadcount());
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handlemessage = (e) => {
    setmessage(e.target.value);
  };

  useEffect(() => {
    const updatedConnectionList = [
      ...followers.filter(
        (follower) => !following.some((follow) => follow._id === follower._id)
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

  // Register socket listeners ONCE on mount using refs for fresh values
  useEffect(() => {
    socket.on("receive_message", (data) => {
      const currentChat = chatpersonRef.current;

      // Bug fix: server sends data.sender not data.senderId
      const isFromCurrentChat = currentChat && data.sender === currentChat._id;

      const newMessage = {
        senderId: data.sender,
        by: "friend",
        content: data.content,
        createdAt: data.createdAt,
        type: data.type,
      };

      if (isFromCurrentChat) {
        // Only add to chat UI if it's from the person currently open
        dispatch(addmessage(newMessage));
        fetch(`/messages/markasread`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            senderId: currentChat._id,
            receiverId: curruser._id,
          }),
        }).catch((err) => console.error("markasread error:", err));
      } else {
        // Update unread badge for background messages
        dispatch(settotalcount((totalmessagecount || 0) + 1));
        const existingEntry = unreadcounts.find((u) => u._id === data.sender);
        if (existingEntry) {
          dispatch(
            setunreadcount(
              unreadcounts.map((u) =>
                u._id === data.sender ? { ...u, count: u.count + 1 } : u
              )
            )
          );
        } else {
          dispatch(
            setunreadcount([
              ...unreadcounts,
              { _id: data.sender, count: 1 },
            ])
          );
        }
      }

      settriggermessage(data.sender);
    });

    socket.on("receive_image", (data) => {
      const currentChat = chatpersonRef.current;
      const isFromCurrentChat = currentChat && data.sender === currentChat._id;

      const newMessage = {
        senderId: data.sender,
        by: "friend",
        content: data.content,
        createdAt: data.createdAt,
        type: data.type,
      };

      if (isFromCurrentChat) {
        dispatch(addmessage(newMessage));
        //updates that messages had been seen
        fetch(`/messages/markasread`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            senderId: currentChat._id,
            receiverId: curruser._id,
          }),
        }).catch((err) => console.error("markasread error:", err));
      } else {
        dispatch(settotalcount((totalmessagecount || 0) + 1));
        const existingEntry = unreadcounts.find((u) => u._id === data.sender);
        if (existingEntry) {
          dispatch(
            setunreadcount(
              unreadcounts.map((u) =>
                u._id === data.sender ? { ...u, count: u.count + 1 } : u
              )
            )
          );
        } else {
          dispatch(
            setunreadcount([
              ...unreadcounts,
              { _id: data.sender, count: 1 },
            ])
          );
        }
      }

      settriggermessage(data.sender);
    });

    // message_response: chatperson's app tells us they saw our messages
    socket.on("message_response", (data) => {
      if (data.seen) {
        dispatch(markMessagesRead());
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("receive_image");
      socket.off("message_response");
    };
  }, []); // Empty array: register once, use ref for fresh chatperson value

  // Notify chatperson that we have seen their messages
  useEffect(() => {
    if (chatperson) {
      // senderId = person whose messages we read (chatperson)
      // receiverId = chatperson, so the server notifies them
      socket.emit("message_seen", {
        senderId: chatperson._id,
        receiverId: chatperson._id,
      });
     
    }
  }, [chatperson, messages]);

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

  const handlesendmessage = async () => {
    if (file) {
      setchatimage(null);
      const formdata = new FormData();
      formdata.append("chatimage", file);

      try {
        const response = await fetch("/messages/uploadchatimage", {
          method: "POST",
          body: formdata,
          credentials: "include",
        });

        const result = await response.json();
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

  return (
    <>
      <div className={`messages-container ${active}`}>
        <Navbar />
        <div className="messages">
          <div className={`suggestions-list friends-list ${active}`}>
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
                  <MdKeyboardBackspace size={30} onClick={() => setactive(" ")} />
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
                      className={`message ${
                        msg.by === "self" ? "sent" : "received"
                      } ${msg.type === "text" ? " " : "image"}`}
                    >
                      {msg.type === "text" ? (
                        <>
                          <div className="message-text">{msg.content}</div>
                          <div className="message-about">
                            <div className="message-timestamp">
                              {new Date(msg.createdAt).toLocaleString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
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
                          </div>
                          <div className="message-about">
                            <div className="message-timestamp">
                              {new Date(msg.createdAt).toLocaleString("en-US", {
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
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
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handlesendmessage();
                  }
                }}
                className="chatarea-chat-input"
                placeholder="Type a message"
              />
              <button onClick={handlesendmessage}>
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

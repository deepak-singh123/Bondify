/* eslint-disable react/prop-types */
import Badge from "@mui/material/Badge";
import { MdMessage } from "react-icons/md";
import { useSelector } from "react-redux";

const Friends = ({ friend, getfrienddetail,onlineusers }) => {
  const color=onlineusers.includes(friend._id)?"success":"error";
  const unreadcounts = useSelector((store)=>store.messagecount.unreadcounts);
  
  const count = unreadcounts.find(item => item._id === friend._id)?.count || null;
  return (
    <>
      <div
        onClick={() => getfrienddetail(friend,color)}
        className="follower-card friend"
      >
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
          <img src={friend.profilePicture} alt={friend.username} />
          <h2 className="username">{friend.username}</h2>
        </div>
        <Badge badgeContent={count} color="error"  >
          <div className="chat-notification">
            <MdMessage />
          </div>
        </Badge>
      </div>
    </>
  );
};
export default Friends;

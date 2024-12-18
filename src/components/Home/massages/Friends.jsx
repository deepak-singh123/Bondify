import Badge from "@mui/material/Badge";
import { MdMessage } from "react-icons/md";

const Friends = ({ friend, getfrienddetail }) => {
  return (
    <>
      <div
        onClick={() => getfrienddetail(friend)}
        className="follower-card friend"
      >
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
          <img src={friend.profilePicture} alt={friend.username} />
          <h2 className="username">{friend.username}</h2>
        </div>
        <Badge badgeContent={2} color="primary">
          <div className="chat-notification">
            <MdMessage />
          </div>
        </Badge>
      </div>
    </>
  );
};
export default Friends;

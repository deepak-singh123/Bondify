import { useSelector } from "react-redux";



 const Usercomments = ()=>{
    const comments = useSelector((store)=>store.comment.comments);



    return(
        <>
        <div className="usercomment">
            {comments && comments.map((comment,index)=>(
               <div className="usercomment-container" key={index}>
                    <img src={comment.user.profilePicture} alt={comment.user.username} className="profile-picture" />
                    <div className="usercomment-binder">
                    <div className="usercomment-info">
                        <h2 className="usercomment-username">{comment.user.username}</h2>
                        <p className="usercomment-text">{comment.text}</p>
                    </div>
                    <div className="usercomment-time">{new Date(comment.createdAt).toLocaleString("en-US", {
                                day: "numeric",
                                month: "short",
                               
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true, // For 12-hour format with AM/PM
                              })}</div>
                              </div>
                </div>
            ))}
        </div>
        
        
        </>
    )
}

export default Usercomments
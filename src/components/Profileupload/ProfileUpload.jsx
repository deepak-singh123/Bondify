
import "./ProfileUpload.css"

const ProfileUpload=()=>{
    return(
        <>
        <div className="profile-upload-container">
            <div className="profile-container">
                <div className="profile-image">
                    <img  className="profile-img" src={"../src/assets/images/img1.jpg"} alt="" />
                </div>
                <div className="profile-upload">
                    <input type="file" id="profilePhoto" accept="image/*" />
                    <textarea placeholder="Tell us about yourself" className="user-bio"/>
                    <button type="submit" className="upload-button">Upload</button>
                </div>
            </div>
            
        </div>
        </>
    )
}

export default ProfileUpload;
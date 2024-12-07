import React from "react";
import { useState } from "react";
import "./ProfileUpload.css"
import { set } from "mongoose";
import { useNavigate } from "react-router-dom";

const ProfileUpload=()=>{
  const navigate=useNavigate();
    const [currprofile,setcurrprofile]=useState("../src/assets/images/img1.jpg");
    const [uploading,setuploading]=useState("Upload"); 
    const [bio,setbio]=useState("");
    var [file, setFile] = useState(null);
    const handleimage=(e)=>{
        file =e.target.files[0];
        if(file){
            setFile(file);
           const reader =new FileReader();
           reader.onload=()=>{
            setcurrprofile(reader.result);
           }
           reader.readAsDataURL(file);
        }
        else {console.log("No file selected");}
    }
    const handlebio=(e)=>{
        setbio(e.target.value);
    }

    const handleUpload = async (e) => {
        if (!file) {
          alert('Please select a file!');
          return;
        }
      
        const formdata = new FormData();
        formdata.append('profilePhoto', file); // Attach file
        formdata.append('bio', bio);          // Attach additional field
      
        try {
          setuploading("Uploading...");
          const response = await fetch('auth/api/user/profile', {
            method: 'POST',
            body: formdata 
          });
          
          const result = await response.json();
      
          setuploading("Uploaded Successfully");
          
          if (response.ok) {
            console.log('File uploaded successfully!');
            navigate(result.redirectTo);
          } else {
            setuploading("Failed to upload ");
            console.error(result.message || 'Failed to upload file');
          }
        } catch (error) {
          setuploading("Failed to upload ");
          console.error('Error during upload:', error);
        }
      };
    return(

        <>
        <div className="profile-upload-container">
            <div className="profile-container">
           

               <div className="profile-background"> 
               <h1>Profile</h1>
                <div className="profile-image">
                    <img  className="profile-img" src={currprofile} alt="" />
                </div>
                </div>
                <div className="profile-upload">
                    <input onChange={(e)=>handleimage(e)} type="file" id="profilePhoto" accept="image/*" />
                    <textarea onChange={(e)=>handlebio(e)} placeholder="Tell us about yourself" className="user-bio"/>
                    <button onClick={(e)=>handleUpload(e)}  type="submit" className="upload-button">{`${uploading}`}</button>
                </div>
            </div>
            
        </div>
        </>
    )
}

export default ProfileUpload;
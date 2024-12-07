import cloudinary from 'cloudinary'
import fs from 'fs/promises';
import { redirect } from 'react-router-dom';
const uploadprofile = async (req, res) => {
if(!req.file ){
    return res.status(400).json({ message: 'No file uploaded' });
}


try{
const result = await cloudinary.v2.uploader
.upload(req.file.path, {
  folder: 'Bondify/Profile',
  resource_type: 'image',
  access_mode: 'public',
  public_id: `profile-${Date.now()}`,
  overwrite: true
})

req.user.profilePicture = result.secure_url;
req.user.bio = req.body.bio;
await req.user.save();
await fs.unlink(req.file.path).catch((err) =>
  console.error('Failed to delete file:', err)
);

return res.status(200).json({ message: 'File uploaded successfully',redirectTo:"/home"});
}
catch(err){
    console.log(err);
    if (req.file?.path) {
        await fs.unlink(req.file.path).catch((err) =>
          console.error('Failed to delete file:', err)
        );
    }
    return res.status(500).json({ message: 'Error uploading file', error: err.message });
}
}

export default uploadprofile
import React, { useState } from "react";
import { serverTimestamp } from "firebase/firestore";
import { storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "../styles/ImageUpload.css";
import { Input, Button } from "@mui/material";

const ImageUpload = ({ username }) => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  // HANDLES CHANGE IN FILE
  // ----------------------------------------------------------------------------------------------------
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // UPLOADING TO FIREBASE STORAGE BY PRESSING THE BUTTON
  // ----------------------------------------------------------------------------------------------------
  const handleUpload = () => {
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // Error function ...
        console.log(error);
      },
      () => {
        // gives us the ref to the particular image which we want to download 👇🏽
        getDownloadURL(uploadTask.snapshot.ref)
          // returns a promise 👇🏽
          .then((url) => {
            setUrl(url);
            console.log(url);

            // post image inside db
            db.collection("posts").add({
              imageUrl: url,
              caption: caption,
              username: username,
              timestamp: serverTimestamp(),
            });

            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  // ----------------------------------------------------------------------------------------------------

  return (
    <div className="imageupload">
      <progress className="imageupload__progress" value={progress} max="100" />
      <Input
        className="imageupload__Input"
        placeholder="Enter a caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input
        className="imageupload__ChooseFile"
        type="file"
        onChange={handleChange}
      />

      <Button className="imageupload__button" onClick={handleUpload}>
        Upload
      </Button>
    </div>
  );
};

export default ImageUpload;

import "../styles/Post.css";
import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { db } from "../firebase";
import { serverTimestamp } from "firebase/firestore";

function Post({ user, postId, imageUrl, username, caption }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  // ADDING COMMENT TO FIRESTORE DATABASE
  // ----------------------------------------------------------------------------------------------------
  const postComment = (e) => {
    e.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: serverTimestamp(), // ordering the comments by timestamp
    });
    setComment(""); // clearing the comment after posting it
  };

  return (
    <div className="post">
      {/* HEADER : AVATAR + USERNAME*/}
      {/* ---------------------------------------------------------------------------------------------------- */}
      <div className="post__header">
        <Avatar
          className="post__avatar"
          src="/static/images/avatar/1.jpg"
          alt="Vladimir"
        />
        <h3>{username}</h3>
      </div>

      {/* IMAGE */}
      {/* ---------------------------------------------------------------------------------------------------- */}
      <img className="post__image" src={imageUrl} alt="" />

      {/* USERNAME + CAPTION */}
      {/* ---------------------------------------------------------------------------------------------------- */}
      <h4 className="post__text">
        <strong>{username}</strong>{" "}
        <span className="post__caption">{caption}</span>
      </h4>

      {/* RENDERING COMMMENT THAT IS READ FROM FIRESTORE DATABSE AFTER ADDING IT */}
      {/* ---------------------------------------------------------------------------------------------------- */}
      <div className="app__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      {/* COMMENT BOX */}
      {/* ---------------------------------------------------------------------------------------------------- */}
      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment}
            className="post__button"
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;

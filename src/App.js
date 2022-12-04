import "./App.css";
import Post from "./components/Post";
import { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { Button, Modal, Input, Box } from "@mui/material";
import ImageUpload from "./components/ImageUpload";
import { IGEmbed } from "react-ig-embed";

function App() {
  // every post is a document
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const handleClose = () => setOpen(false);

  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.essage));
    setOpenSignIn(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    borderRadius: "5px",
  };

  // Authentication
  // ----------------------------------------------------------
  useEffect(() => {
    // onAuthStateChanged keeps me logged in
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user logged in
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          // dont update username
        } else {
          // if we just created someone
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        // user has logged out
        setUser(null);
      }
    });
    return () => {
      // perform some cleanup actions
      unsubscribe();
    };
  }, [user, username]);
  // ----------------------------------------------------------

  // READING FROM FIREBASE DATABASE
  // ----------------------------------------------------------
  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        // every time a new post is added, this code fires
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);
  // ----------------------------------------------------------

  // LOGGING IN WITH EMAIL AND PASSWORD
  // ----------------------------------------------------------
  const handleLogin = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpen(false);
  };
  // ----------------------------------------------------------

  return (
    <div className="app">
      <div className="app__header">
        {/* IG LOGO ON TOP */}
        {/* ---------------------------------------------------------------------------------------------------- */}
        <img className="app__headerImage" src="iglogo.png" alt="" />

        {/* CHECKS IF USER IS LOGGED OUT. IF TRUE, THIS GIVES 'SIGN IN' AND 'SIGN UP' OPTIONS */}
        {/* ---------------------------------------------------------------------------------------------------- */}
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      {/* SIGNING UP MODAL */}
      {/* ---------------------------------------------------------------------------------------------------- */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <div>
            <center>
              <img
                className="app__headerImage"
                src="https://logos-download.com/wp-content/uploads/2016/03/Instagram_Logo_2016.png"
                alt=""
              />
            </center>
            <form className="app__signup">
              {/* Username */}
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
              {/* Email */}
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* Password */}
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            </form>
          </div>
        </Box>
      </Modal>
      {/* ---------------------------------------------------------------------------------------------------- */}

      {/* SIGNING IN MODAL */}
      {/* ---------------------------------------------------------------------------------------------------- */}
      <Modal
        open={openSignIn}
        onClose={() => {
          setOpenSignIn(false);
        }}
      >
        <Box sx={style}>
          <div>
            <center>
              <img
                className="app__headerImage"
                src="https://logos-download.com/wp-content/uploads/2016/03/Instagram_Logo_2016.png"
                alt=""
              />
            </center>
            <form className="app__signup">
              <Input
                placeholder="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>
                Sign In
              </Button>
            </form>
          </div>
        </Box>
      </Modal>
      {/* ---------------------------------------------------------------------------------------------------- */}

      {/* POSTS ON PAGE */}
      {/* ---------------------------------------------------------------------------------------------------- */}
      <div className="app__posts">
        {/* Posts  */}
        <div className="app__postsRight">
          {posts.map(({ id, post }) => (
            <Post
              user={user}
              key={id}
              postId={id}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              // comment={comment}
            />
          ))}
        </div>
        <IGEmbed
          className="app__postsLeft"
          url="https://www.instagram.com/p/ClvwaWtjnuR/"
        />
      </div>
      {/* ---------------------------------------------------------------------------------------------------- */}

      {/* CHECKS IF USER IS LOGGED IN TO UPLOAD */}
      {/* ---------------------------------------------------------------------------------------------------- */}
      {user?.displayName ? (
        <div className="app__upload">
          <ImageUpload username={user.displayName} />
        </div>
      ) : (
        <center>
          <h3>Sorry, you need to login to upload.</h3>
        </center>
      )}
      {/* ---------------------------------------------------------------------------------------------------- */}
    </div>
  );
}

export default App;

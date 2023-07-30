import React, { useState } from "react";
import Input from "../Input/Index";
import "./Style.css";
import Button from "../Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import { auth, db, provider } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function SignupSignin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  function signUpwithemail() {
    setLoading(true);
    console.log("name", name);
    console.log("email", email);
    console.log("password", password);
    console.log("confirm password", confirmPassword);

    //Authenticate the user,basically create a new accout using email and pass
    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword !== ""
    ) {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("User>>>>", user);
            toast.success("User Created");
            setLoading(false);
            setConfirmPassword("");
            setEmail("");
            setPassword("");
            setName("");
            // Craete the doc with user id as the following id
            createDoc(user);
            navigate("/dashboard");
          })
          .catch((error) => {
            // const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);

            // ..
          });
      } else {
        toast.error("Password and confirmPassword don't mathch");
        setLoading(false);
      }
    } else {
      toast.error("All fileds are mandatory");
      setLoading(false);
    }
  }

  function loginwithemail() {
    console.log("email", email);
    console.log("password", password);

    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          toast.success("User Logged In!");
          console.log("user logged in", user);
          setLoading(false);
          navigate("/dashboard");
        })
        .catch((error) => {
          // const errorCode = error.code;
          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage);
        });
    } else {
      toast.error("All fields are mandatory");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    //make sure that doc with uid doesn't match
    setLoading(true);
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.diplayName ? user.diplayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc created!");
        setLoading(false);
      } catch (e) {
        toast.error(e);
        setLoading(false);
      }
    } else {
      toast.error("Doc alredy exists!");
      setLoading(false);
    }
  }

  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth,provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log("User>>>>", user);
          setLoading(false);
          createDoc(user);
          navigate("/dashboard");
          toast.success("User Authenticated");
          // IdP data available using getAdditionalUserInfo(result)
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          setLoading(false);

          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(error.message);

          // ...
        });
    } catch (e) {
      setLoading(false);
      toast.error(e.message);
    }
  }

  return (
    <>
      {loginForm ? (
        <div className="signUp-wrapper">
          <h2 className="title">
            Login <span style={{ color: "var(--theme)" }}>Financely</span>
          </h2>
          <form>
            <Input
              type={email}
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"johnDeo@email.com"}
            />
            <Input
              type={"password"}
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading...." : "Login Using Email and Password"}
              onClick={loginwithemail}
            />
            <p className="p-login">Or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading...." : "Login Using Google"}
              blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Or Don't have an accout click here
            </p>
          </form>
        </div>
      ) : (
        <div className="signUp-wrapper">
          <h2 className="title">
            Sign Up <span style={{ color: "var(--theme)" }}>Financely</span>
          </h2>
          <form>
            <Input
              label={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"john Deo"}
            />
            <Input
              type={email}
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"johnDeo@email.com"}
            />
            <Input
              type={"password"}
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
            />
            <Input
              type={"password"}
              label={"Conform Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"Example@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading...." : "SignUp Using Email and Password"}
              onClick={signUpwithemail}
            />
            <p className="p-login">Or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading...." : "SignUp Using Google"}
              blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Or Have An Accout Alrady ? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSignin;

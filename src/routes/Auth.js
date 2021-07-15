import React, { useState } from "react";
import { authService, authInstance } from "fbase";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPasssword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPasssword(value);
    }
  };

  const goSocialAuth = async (event) => {
    const {
      target: { name },
    } = event;

    let provider;
    try {
      if (name === "google") {
        provider = new authInstance.GoogleAuthProvider();
      } else if (name === "github") {
        provider = new authInstance.GithubAuthProvider();
      }
      const data = await authService.signInWithPopup(provider);
      console.log(data);
    } catch (error) {
      //setError(error.message);
      console.log(error.message);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let data;
    try {
      if (newAccount) {
        data = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      } else {
        data = await authService.signInWithEmailAndPassword(email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => setNewAccount(!newAccount);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          required
        />
        <input
          type="submit"
          value={newAccount ? "Create Account" : "Sign In"}
        />
        <div>{error}</div>
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
      <div>
        <button name="google" onClick={goSocialAuth}>
          Continue with Google
        </button>
        <button name="github" onClick={goSocialAuth}>
          Continue with Github
        </button>
      </div>
    </div>
  );
};

export default Auth;

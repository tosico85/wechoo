import React, { useState } from "react";
import { authService, authInstance } from "fbase";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import "assets/scss/pages/auth.scss";

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
    <div className="auth-main main">
      <h1 className="login-title">Login</h1>
      <form className="signin-form" onSubmit={onSubmit}>
        <input
          type="text"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email Address *"
          className="signin-form__email"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password *"
          className="signin-form__password"
          required
        />
        <input
          type="submit"
          value={newAccount ? "회원가입" : "로그인"}
          className="signin-form__submit"
        />
        <div>{error}</div>
      </form>
      <div className="social-login">
        <button
          className="social-login__google"
          name="google"
          onClick={goSocialAuth}
        >
          <FontAwesomeIcon icon={faGoogle} className="faGoogle" />
          Continue with Google
        </button>
        <button
          className="social-login__github"
          name="github"
          onClick={goSocialAuth}
        >
          <FontAwesomeIcon icon={faGithub} />
          Continue with Github
        </button>
      </div>
      <span className="toggle-account" onClick={toggleAccount}>
        {newAccount ? "로그인" : "회원가입"}
      </span>
    </div>
  );
};

export default Auth;

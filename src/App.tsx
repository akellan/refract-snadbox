import React from "react";
import "./App.css";
import {
  googleAuthApi,
  GoogleAuthLoadingOverlay,
  GoogleAuthLogInButton,
} from "./google-auth";
import logo from "./logo.svg";

const App: React.FC = () => {
  return (
    <GoogleAuthLoadingOverlay
      clientId="160547990505-pi8bo68e71eoet5ueradlmu2rpttv0qe.apps.googleusercontent.com"
      googleApi={googleAuthApi}
    >
      <div className="App">
        <GoogleAuthLogInButton googleApi={googleAuthApi} />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </GoogleAuthLoadingOverlay>
  );
};

export default App;

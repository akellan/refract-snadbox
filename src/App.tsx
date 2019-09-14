import React from "react";
import "./App.css";
import { LoadingGoogleAuthOverlay } from "./google-auth/GoogleAuthLoading";
import { GoogleAuthorizationInit } from "./google-auth/GoogleAuthorizationInit";
import logo from "./logo.svg";

const App: React.FC = () => {
  return (
    <LoadingGoogleAuthOverlay show={true}>
      <GoogleAuthorizationInit clientId="160547990505-pi8bo68e71eoet5ueradlmu2rpttv0qe.apps.googleusercontent.com">
        <div className="App">
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
      </GoogleAuthorizationInit>
    </LoadingGoogleAuthOverlay>
  );
};

export default App;

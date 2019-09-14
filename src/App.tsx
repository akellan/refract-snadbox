import React from "react";
import "./App.css";
import { GoogleAuthLoadingOverlay } from "./google-auth/GoogleAuthLoadingOverlay";
import logo from "./logo.svg";

const App: React.FC = () => {
  return (
    <GoogleAuthLoadingOverlay
      show={true}
      clientId="160547990505-pi8bo68e71eoet5ueradlmu2rpttv0qe.apps.googleusercontent.com"
    >
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
    </GoogleAuthLoadingOverlay>
  );
};

export default App;

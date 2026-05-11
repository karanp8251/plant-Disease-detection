import React from "react";
import Upload from "./components/Upload";

function App() {
  return (
    <div className="app-shell">
      <header className="hero">
        <p className="hero-kicker">Smart Crop Protection</p>
        <h1>Plant Doctor AI</h1>
        <p className="hero-subtitle">
          Leaf photo upload karo aur seconds me disease detection, confidence score, aur treatment guidance pao.
        </p>
      </header>
      <Upload />
    </div>
  );
}
export default App;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Result from "./Result";
import Chatbot from "./Chatbot";

function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleUpload = async () => {
    if (!file) return;
    setErrorMsg("");
    setData(null);
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Using /api prefix which is proxied to localhost:8000 in vite.config.js
      const res = await axios.post("/api/predict", formData);
      if (res.data?.error) {
        setErrorMsg(`Prediction failed: ${res.data.error}`);
        return;
      }
      setData(res.data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Error connecting to server. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const setSelectedFile = (selected) => {
    setErrorMsg("");
    setData(null);

    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setFile(null);
      setPreview(null);
      setErrorMsg("Please choose a valid image file.");
      return;
    }

    setFile(selected);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(URL.createObjectURL(selected));
  };

  const onFileChange = (e) => {
    const selected = e.target.files[0];
    setSelectedFile(selected);
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    setSelectedFile(droppedFile);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Upload Plant Leaf Image</h2>
        <p className="muted-text">
          Our AI will analyze the leaf to detect diseases and suggest remedies.
        </p>

        <label
          className={`upload-zone ${isDragActive ? "active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={onDrop}
        >
          <input type="file" className="input-file" onChange={onFileChange} accept="image/*,.jpg,.jpeg,.png,.webp" />
          {preview ? (
            <img src={preview} alt="Preview" className="preview-image" />
          ) : (
            <div className="upload-placeholder">
              <div className="placeholder-icon">🌿</div>
              <p>Click to select or drag and drop leaf image</p>
              <p className="upload-hint">Supported: JPG, PNG, WEBP</p>
            </div>
          )}
        </label>

        <div className="upload-actions">
          <button className="btn" onClick={handleUpload} disabled={!file || loading}>
            {loading ? "Analyzing..." : "Start Diagnosis"}
          </button>
        </div>
        {file && (
          <p className="file-name">
            Selected file: {file.name}
          </p>
        )}
        {errorMsg && (
          <p className="error-text">
            {errorMsg}
          </p>
        )}
      </div>

      {data && (
        <div className="result-grid">
          <Result data={data} />
          <Chatbot disease={data.disease} response={data.chatbot} />
        </div>
      )}
    </div>
  );
}

export default Upload;

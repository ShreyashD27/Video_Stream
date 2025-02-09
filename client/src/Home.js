import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css"; // Use the same styles

const API_URL = "http://localhost:5000";

function Home() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Video uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload video.");
    }
  };

  return (
    <div className="container">
      <h1>Video Streaming App</h1>

      <div className="upload-section">
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload Video</button>
      </div>

      <button className="show-videos-btn" onClick={() => navigate("/videos")}>
        Show All Videos
      </button>
    </div>
  );
}

export default Home;

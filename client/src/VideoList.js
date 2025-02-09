import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

const API_URL = "http://localhost:5000";

function VideoList() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/videos`);
      setVideos(data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/video/${id}`);
      alert("Video deleted successfully!");
      fetchVideos(); // Refresh the list
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete video.");
    }
  };

  return (
    <div className="container">
      <h2>All Uploaded Videos</h2>
      <button className="back-btn" onClick={() => navigate("/")}>
        Back to Home
      </button>

      {videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <ul className="video-list">
          {videos.map((video) => (
            <li key={video._id}>
              <video controls>
                <source src={`${API_URL}/video/${video.filename}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p>{video.filename}</p>
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VideoList;

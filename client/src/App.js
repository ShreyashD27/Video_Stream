import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import VideoList from "./VideoList";
import "./App.css"; // Import CSS

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/videos" element={<VideoList />} />
      </Routes>
    </Router>
  );
}

export default App;

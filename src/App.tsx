import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import BreathingPage from "@/pages/BreathingPage";
import WalkingPage from "@/pages/WalkingPage";
import EatingPage from "@/pages/EatingPage";
import StretchingPage from "@/pages/StretchingPage";
import MoodPage from "@/pages/MoodPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/breathing" element={<BreathingPage />} />
        <Route path="/walking" element={<WalkingPage />} />
        <Route path="/eating" element={<EatingPage />} />
        <Route path="/stretching" element={<StretchingPage />} />
        <Route path="/mood" element={<MoodPage />} />
      </Routes>
    </Router>
  );
}

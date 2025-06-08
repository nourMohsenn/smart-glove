import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LangFunctionalityWatcher from "./components/LangFunctionalityWatcher/LangFunctionalityWatcher.jsx";
import SignLanguage from "./components/SignLanguage/SignLanguage.jsx";
import ObjectDetectV3Arabic from "./components/ObjectDetectV3Arabic/ObjectDetectV3Arabic.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LangFunctionalityWatcher />} />
        <Route path="/object-detection" element={<ObjectDetectV3Arabic/>} />
        <Route path="/sign-language" element={<SignLanguage />} />
      </Routes>
    </Router>
  );
}

export default App;

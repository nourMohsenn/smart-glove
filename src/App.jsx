import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LangFunctionalityWatcher from "./components/LangFunctionalityWatcher/LangFunctionalityWatcher.jsx";
import SignLanguage from "./components/SignLanguage/SignLanguage.jsx";
import ObjectDetectV3Arabic from "./components/ObjectDetectV3Arabic/ObjectDetectV3Arabic.jsx";
import SignLanguageArabic from './components/SignLanguageArabic/SignLanguageArabic.jsx'
import ObjectDetectionArabic from "./components/ObjectDetectionArabic/ObjectDetectionArabic.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LangFunctionalityWatcher />} />
        <Route path="/object-detection-en" element={<ObjectDetectV3Arabic/>} />
        <Route path="/object-detection-ar" element={<ObjectDetectionArabic/>} />
        <Route path="/sign-language-ar" element={<SignLanguageArabic/>} />
        <Route path="/sign-language-en" element={<SignLanguage />} />
      </Routes>
    </Router>
  );
}

export default App;

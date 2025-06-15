import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LangFunctionalityWatcher from "./components/LangFunctionalityWatcher/LangFunctionalityWatcher.jsx";
import SignLanguage from "./components/SignLanguage/SignLanguage.jsx";
import ObjectDetectV3Arabic from "./components/ObjectDetectV3Arabic/ObjectDetectV3Arabic.jsx";
import SignLanguageArabic from './components/SignLanguageArabic/SignLanguageArabic.jsx'
import ObjectDetectionArabic from "./components/ObjectDetectionArabic/ObjectDetectionArabic.jsx";
import React, { useState } from "react";

function App() {
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LangFunctionalityWatcher />} />
          <Route path="/object-detection-en" element={<ObjectDetectV3Arabic/>} />
          <Route path="/object-detection-ar" element={<ObjectDetectionArabic/>} />
          <Route path="/sign-language-ar" element={<SignLanguageArabic/>} />
          <Route path="/sign-language-en" element={<SignLanguage />} />
        </Routes>
      </Router>

      {/* Help Button */}
      <button
        className="font-bold w-12 h-12 leading-0.5 fixed bottom-6 right-6 z-50 bg-green-700 text-white rounded-full shadow-lg p-4 hover:bg-green-800 focus:outline-none"
        aria-label="Help"
        onClick={() => setShowHelp(true)}
      >
        ?
      </button>
      {/* About Button */}
      <button
        className="font-bold w-12 h-12 leading-0.5 fixed bottom-6 right-24 z-50 bg-blue-700 text-white rounded-full shadow-lg p-4 hover:bg-blue-800 focus:outline-none"
        aria-label="About"
        onClick={() => setShowAbout(true)}
      >
        i
      </button>
      {/* Help Popup */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative max-h-dvh overflow-y-auto">
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl font-bold"
              onClick={() => setShowHelp(false)}
              aria-label="Close Help"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">
              {document.documentElement.lang === "ar"
                ? "مساعدة"
                : "Help"}
            </h2>
            <div className="text-gray-800 text-lg space-y-3">
              <div>
                <span className="font-semibold">English:</span>
                <ul className="list-disc ml-6 mt-1">
                  <li>
                    Use the <b>Sign Language</b> section to communicate between a deaf and a normal person using speech and sign translation.
                  </li>
                  <li>
                    Use the <b>Object Detection</b> section to detect objects using the camera and get spoken feedback.
                  </li>
                  <li>
                    You can switch language and functionality using the smart glove.
                  </li>
                  <li>
                    For correct results, allow microphone and camera access.
                  </li>
                </ul>
              </div>
              <div dir="rtl">
                <span className="font-semibold">العربية:</span>
                <ul className="list-disc ml-6 mt-1 text-right">
                  <li>
                    استخدم قسم <b>لغة الإشارة</b> للتواصل بين شخص أصم وشخص طبيعي باستخدام الترجمة الصوتية والإشارية.
                  </li>
                  <li>
                    استخدم قسم <b>التعرف على الأشياء</b> لاكتشاف الأشياء بالكاميرا والحصول على وصف صوتي.
                  </li>
                  <li>
                    يمكنك تغيير اللغة أو الوظيفة باستخدام القفاز الذكي .
                  </li>
                  <li>
                    للحصول على النتائج بشكل صحيح، يرجى السماح بالوصول للميكروفون والكاميرا.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* About Popup */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full relative max-h-dvh overflow-y-auto">
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-2xl font-bold"
              onClick={() => setShowAbout(false)}
              aria-label="Close About"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">
              {document.documentElement.lang === "ar"
                ? "حول"
                : "About"}
            </h2>
            <div className="text-gray-800 text-lg space-y-3">
              <div>
                <span className="font-semibold">English:</span>
                <p>
                  Smart Glove is an accessibility project designed to bridge communication gaps for the deaf and visually impaired. It enables real-time sign language translation and object detection using modern AI and IoT technologies. Our mission is to empower everyone with inclusive, easy-to-use tools.
                </p>
              </div>
              <div dir="rtl">
                <span className="font-semibold">العربية:</span>
                <p className="text-right">
                  القفاز الذكي هو مشروع يهدف إلى تسهيل التواصل لذوي الإعاقة السمعية والبصرية. يوفر ترجمة فورية للغة الإشارة والتعرف على الأشياء باستخدام تقنيات الذكاء الاصطناعي وإنترنت الأشياء. مهمتنا تمكين الجميع من خلال أدوات شاملة وسهلة الاستخدام.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
    );
}

export default App;

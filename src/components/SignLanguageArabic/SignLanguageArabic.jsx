import React, { useEffect, useRef, useState } from "react";
import deafSvg from "../../assets/deaf-man-medium-skin-tone-svgrepo-com.svg";
import normalSvg from "../../assets/adult-medium-dark-skin-tone-svgrepo-com.svg";
import micSvgOn from "../../assets/mic-show-svgrepo-com.svg";
import micSvgOff from "../../assets/mic-off-svgrepo-com.svg";
import chatGreen from "../../assets/chat-pl-green.svg";
import chatOrange from "../../assets/chat-pl-orange.svg";
import upperEllipse from "../../assets/upper-ellipse.svg";
import lowerEllipse from "../../assets/lower-ellipse.svg";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";

export default function SignLanguage() {
  const [normalText, setNormalText] = useState("");
  const [deafText, setDeafText] = useState("");
  const [normalSpeak, setNormalSpeak] = useState(false);
  const recognitionRef = useRef(null);
  const intervalRef = useRef(null);
  const lastSpokenMessageRef = useRef(""); // Prevent repeating the same message
  const [btnStart, setBtnStart] = useState(false);
  let docDir = "rtl";
  document.documentElement.lang = "ar";
  //listen for changes
  const intervalRef2 = useRef(null);
  const navigate = useNavigate();
  //============
  useEffect(() => {
    const checkLangFunctionality = async () => {
      try {
        const res = await fetch(
          "https://flask-object-detect.vercel.app/get-lang-functionality"
        );
        const data = await res.json();

        if (data.waiting) {
          console.log("Waiting for lang and functionality...");
        } else {
          clearInterval(intervalRef.current);

          // Change HTML language

          document.documentElement.lang = "ar";

          // Navigate based on functionality
          if (data.functionality === "object-detection" && data.lang=="en") {
            navigate("/object-detection-en");
          } else if(data.functionality === "object-detection" && data.lang=="ar"){
            navigate("/object-detection-ar");
          }
           else if (
            data.functionality === "sign-language" &&
            data.lang == "en"
          ) {
            navigate("/sign-language-en");
          }
        }
      } catch (err) {
        console.error("Error fetching lang/functionality:", err);
        console.log("Error connecting to backend.");
      }
    };

    intervalRef2.current = setInterval(checkLangFunctionality, 5000);

    return () => clearInterval(intervalRef2.current);
  }, [navigate]);

  //set document direction
  if (document.documentElement.lang !== "en") {
    docDir = "rtl";
  }

  // Set up Speech Recognition on mount
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = document.documentElement.lang || "en-US";
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1][0].transcript;
        setNormalText(result);
      };

      recognition.onend = () => {
        setNormalSpeak(false); // Reset button state when recognition ends
      };

      recognitionRef.current = recognition;
    } else {
      alert("Speech Recognition is not supported in this browser.");
    }
  }, []);
  //

  // Set up polling for deaf_message every 3 seconds
  useEffect(() => {
    const fetchDeafMessage = async () => {
      try {
        const response = await fetch(
          "https://flask-object-detect.vercel.app/deaf_message"
        );
        const data = await response.json();

        if (data.message && data.message !== lastSpokenMessageRef.current) {
          lastSpokenMessageRef.current = data.message;
          setDeafText(data.message);

          const utterance = new SpeechSynthesisUtterance(data.message);
          utterance.lang = document.documentElement.lang;
          window.speechSynthesis.cancel(); // cancel previous speech
          window.speechSynthesis.speak(utterance);
        }
      } catch (error) {
        console.error("Failed to fetch deaf message:", error);
      }
    };
    console.log(window.navigator.language);
    console.log(document.documentElement.lang + "doc");
    // speechSynthesis.speak(new SpeechSynthesisUtterance("let's do it"))
    intervalRef.current = setInterval(fetchDeafMessage, 3000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const startRecognition = () => {
    setNormalSpeak(true);
    recognitionRef.current?.start();
  };

  // const stopRecognition = () => {
  //   recognitionRef.current?.stop();
  //   // setNormalSpeak(false)
  // };

  function sayMessage() {
    if (!btnStart) {
      const utterance = new SpeechSynthesisUtterance(
        `${"المحادثة الصوتية بدأت"}`
      );
      utterance.lang = "ar";
      window.speechSynthesis.cancel(); // cancel previous speech
      window.speechSynthesis.speak(utterance);
    }
    setBtnStart(true);
  }

  return (
    <div className="bg-[#C1CFCD] min-h-screen p-5 flex flex-col items-center justify-center content-center relative">
      <img
        src={upperEllipse}
        alt="*Decoration*"
        className="w-2/12 absolute top-0 right-0 z-0"
      />
      <img
        src={lowerEllipse}
        alt="*Decoration*"
        className="w-2/12 absolute bottom-0 left-0 z-0"
      />
      <h3 className="text-center border text-green-700 border-gray-700 p-5 z-10 rounded-2xl top-5 shadow-2xl bg-[#C1CFCD] mb-8">
        التواصل بلغة الإشارة
      </h3>
      <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8 z-10">
        {/* Normal Person */}
        <div className="flex flex-col items-center bg-orange-100 border-2 border-gray-700 rounded-xl shadow-lg w-full max-w-md p-5 relative">
          <h3 dir={docDir} className="text-xl font-semibold mb-2">
            شخص طبيعي
          </h3>
          <div className="relative w-full mb-2">
            <img src={chatOrange} alt="" className="w-full" />
            <textarea
              dir={docDir}
              id="result"
              value={normalText}
              readOnly
              className="absolute top-[100px] left-0 w-[98%] h-[100px] bg-transparent outline-none border-none text-2xl resize-none px-2"
              style={{ background: "transparent" }}
            ></textarea>
          </div>
          <div className="flex justify-center w-full mt-2">
            <img src={normalSvg} alt="Normal Person" className="w-3/4" />
          </div>
          <div className="flex flex-col items-center absolute justify-center mt-2 right-3 bottom-3">
            {/* Arrow pointing to the mic button */}
            <button
              onClick={startRecognition}
              className="focus:outline-none"
              aria-label="Start Speech Recognition"
            >
              <img
                src={normalSpeak ? micSvgOn : micSvgOff}
                className="w-[50px]"
                alt="Mic"
              />
            </button>
            <span className="flex flex-col items-center mt-3 justify-center">
              <span className="text-[#ff9800] font-bold text-base -mt-2 drop-shadow-sm whitespace-nowrap">
                اضغط للتحدث
              </span>
            </span>
          </div>
        </div>
        {/* Deaf Person */}
        <div className="flex flex-col items-center bg-green-100 border-2 border-gray-700 rounded-xl shadow-lg w-full max-w-md p-5">
          <h3 dir={docDir} className="text-xl font-semibold mb-2">
            شخص اصم
          </h3>
          <div className="relative w-full mb-2">
            <img src={chatGreen} className="w-full" alt="" />
            <textarea
              dir={docDir}
              id="deaf"
              className="absolute top-[100px] left-0 w-[98%] h-[100px] bg-transparent outline-none border-none text-2xl resize-none px-2"
              value={deafText}
              readOnly
              style={{ background: "transparent" }}
            ></textarea>
          </div>
          <div className="flex justify-center w-full mt-2">
            <img src={deafSvg} alt="Deaf Person" className="w-3/4" />
          </div>
        </div>
      </div>
      {/* Example button for speech synthesis */}
      <button
        onClick={sayMessage}
        className={`mt-8 py-2 px-4 ${
          btnStart ? "bg-green-700" : "bg-gray-700"
        } text-white rounded-xl shadow-lg`}
      >
        ابدأ
      </button>

      <Footer/>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import deafSvg from '../../assets/deaf-man-medium-skin-tone-svgrepo-com.svg'
import normalSvg from '../../assets/adult-medium-dark-skin-tone-svgrepo-com.svg'
import micSvgOn from '../../assets/mic-show-svgrepo-com.svg'
import micSvgOff from '../../assets/mic-off-svgrepo-com.svg'
import chatGreen from '../../assets/chat-pl-green.svg'
import chatOrange from '../../assets/chat-pl-orange.svg'
import { useNavigate } from "react-router-dom";


export default function SignLanguage() {
  const [normalText, setNormalText] = useState("");
  const [deafText, setDeafText] = useState("");
  const [normalSpeak, setNormalSpeak] = useState(false);
  const recognitionRef = useRef(null);
  const intervalRef = useRef(null);
  const lastSpokenMessageRef = useRef(""); // Prevent repeating the same message
  let docDir = "ltr";
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
          if (data.lang === "ar") {
            document.documentElement.lang = "ar";
          } else {
            document.documentElement.lang = "en";
          }

          // Navigate based on functionality
          if (data.functionality === "object-detection") {
            navigate("/object-detection");
          } else if (data.functionality === "sign-language") {
            navigate("/sign-language");
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
      // recognition.lang = window.navigator.language || "en-US";
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

  const stopRecognition = () => {
    recognitionRef.current?.stop();
    // setNormalSpeak(false)
  };

  function sayMessage() {
    const utterance = new SpeechSynthesisUtterance("message");
    utterance.lang = document.documentElement.lang;
    window.speechSynthesis.cancel(); // cancel previous speech
    window.speechSynthesis.speak(utterance);
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "green",
      }}
    >
      {/* Normal Person */}
      <div
        id="normalPerson"
        style={{
          backgroundColor: "burlywood",
          width: "400px",
          padding: "10px",
        }}
      >
        <h3 dir={docDir}>
          {document.documentElement.lang == "en"
            ? "Normal Person"
            : "شخص طبيعي"}
        </h3>
        <div style={{ position: "relative" }}>
          <img src={chatOrange} alt="" style={{ width: "100%" }} />
          <textarea
            dir={docDir}
            id="result"
            value={normalText}
            readOnly
            style={{
              width: "98%",
              height: "100px",
              position: "absolute",
              top: "100px",
              left: "0",
              backgroundColor: "transparent",
              outline: "0px",
              border: "none",
              fontSize: "2rem",
            }}
          ></textarea>
        </div>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img src={normalSvg} alt="Normal Person" style={{ width: "90%" }} />
        </div>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={normalSpeak ? micSvgOn : micSvgOff}
            onClick={startRecognition}
            style={{ width: "50px" }}
          />
          {/* <img src={speakerMutedSvg} onClick={stopRecognition} style={{ width: "50px" }}/> */}
        </div>
      </div>

      {/* Deaf Person */}
      <div
        id="deafPerson"
        style={{ backgroundColor: "bisque", width: "400px", padding: "10px" }}
      >
        <h3 dir={docDir}>
          {document.documentElement.lang == "en" ? "Deaf Person" : "شخص اصم"}
        </h3>
        <div style={{ backgroundColor: "", position: "relative" }}>
          <img src={chatGreen} style={{ width: "100%" }} alt="" />
          <textarea
            dir={docDir}
            id="deaf"
            style={{
              width: "98%",
              height: "100px",
              position: "absolute",
              top: "100px",
              left: "0",
              backgroundColor: "transparent",
              outline: "0px",
              border: "none",
              fontSize: "2rem",
            }}
            value={deafText}
            readOnly
          ></textarea>
        </div>
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img src={deafSvg} alt="Deaf Person" style={{ width: "90%" }} />
        </div>
      </div>
      <button onClick={sayMessage} on>
        hello
      </button>
    </div>
  );
}

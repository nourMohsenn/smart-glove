import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import blindPerson from '../../assets/blindPerson.svg'
import deafPerson from '../../assets/deafPng.webp'

export default function LangFunctionalityWatcher() {
  const [message, setMessage] = useState(
    "Waiting for lang and functionality..."
  );
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLangFunctionality = async () => {
      try {
        const res = await fetch(
          "https://flask-object-detect.vercel.app/get-lang-functionality"
        );
        const data = await res.json();

        if (data.waiting) {
          setMessage("Waiting for lang and functionality...");
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
        setMessage("Error connecting to backend.");
      }
    };

    intervalRef.current = setInterval(checkLangFunctionality, 5000);

    return () => clearInterval(intervalRef.current);
  }, [navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h2>{message}</h2>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          id="deaf"
          style={{
            textAlign: "center",
            fontSize: "2rem",
            backgroundColor: "bisque",
          }}
        >
          <p>I can hear you 😀</p>
          <img src={deafPerson} alt="" />
        </div>
        <div
          id="blind"
          style={{
            textAlign: "center",
            fontSize: "2rem",
            backgroundColor: "burlywood",
          }}
        >
          <p>and I can see you too 😎</p>
          <img src={blindPerson} style={{ width: "58%" }} alt="" />
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ObjectDetectV3Arabic() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [status, setStatus] = useState("Loading...");
  const [description, setDescription] = useState("");
  const [objects, setObjects] = useState([]);
  const [imageCaptured, setImageCaptured] = useState(false);
  const modelRef = useRef(null);
  const intervalRef = useRef(null);
  // let stream;
  let docDir = "ltr";
  const backendURL =
    "https://flask-object-detect.vercel.app/check_trigger?id=123456";
  //listen for changes
  const intervalRef2 = useRef(null);
  const navigate = useNavigate();
  if (document.documentElement.lang !== "en") {
    docDir = "rtl";
  }
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
            // stream.getTracks().forEach((track) => track.stop());
            navigate("/object-detection");
          } else if (data.functionality === "sign-language") {
            // stream.getTracks().forEach((track) => track.stop());
            navigate("/sign-language");
          }
        }
      } catch (err) {
        console.error("Error fetching lang/functionality:", err);
        console.log("Error connecting to backend.");
      }
    };

    intervalRef2.current = setInterval(checkLangFunctionality, 2000);

    return () => clearInterval(intervalRef2.current);
  }, [navigate]);

  const numberToWords = (n) => {
    const words = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
    ];
    return words[n] || n.toString();
  };

  useEffect(() => {
    const loadModel = async () => {
      const cocoSsd = await window.cocoSsd.load();
      modelRef.current = cocoSsd;
      setStatus("Model loaded successfully");
      startCamera();
    };

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          intervalRef.current = setInterval(checkTrigger, 5000);
        };
      } catch (err) {
        console.error("Error starting camera:", err);
      }
    };

    loadModel();
  }, []);

  const checkTrigger = async () => {
    try {
      const res = await fetch(backendURL);
      const data = await res.json();
      if (data.triggered) {
        clearInterval(intervalRef.current);
        setStatus("Triggered! Capturing...");
        captureAndDetect();
      }
    } catch (err) {
      console.error("Trigger check failed:", err);
    }
  };

  const captureAndDetect = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg");
    setImageCaptured(true);

    setTimeout(() => {
      if (imgRef.current) {
        imgRef.current.src = dataUrl;

        imgRef.current.onload = async () => {
          const predictions = await modelRef.current.detect(imgRef.current);
          setObjects(predictions);

          const counts = {};
          predictions.forEach((pred) => {
            const name = pred.class;
            counts[name] = (counts[name] || 0) + 1;
          });

          const desc = Object.entries(counts)
            .map(
              ([name, count]) =>
                `${numberToWords(count)} ${name}${count > 1 ? "s" : ""}`
            )
            .join(" and ");

          if (document.documentElement.lang === "ar") {
            try {
              const res = await fetch(
                "https://flask-translator.vercel.app/translate",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ text: desc }),
                }
              );

              const data = await res.json();
              const translatedText = data.translated_text; // ✅ Fix applied here

              setDescription(translatedText);

              const utterance = new SpeechSynthesisUtterance(translatedText);
              utterance.lang = "ar";
              window.speechSynthesis.speak(utterance);
            } catch (err) {
              console.error("Translation or speech failed:", err);
              setDescription(desc); // fallback
            }
          } else {
            setDescription(desc);
            const utterance = new SpeechSynthesisUtterance(desc);
            utterance.lang = "en";
            window.speechSynthesis.speak(utterance);
          }

          setStatus("Detection done. Waiting for next trigger...");
          intervalRef.current = setInterval(checkTrigger, 5000);
        };
      }
    }, 100);
  };

  return (
    <div style={{ padding: 20, backgroundColor: "#ffaaaa" }}>
      <h2 dir={docDir}>
        {document.documentElement.lang == "en"
          ? "Camera Feed"
          : "تغذية الكاميرا"}
      </h2>
      <div
        style={{
          width: "400px",
          height: "300px",
          border: "2px solid black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <video
          ref={videoRef}
          width="400"
          height="300"
          autoPlay
          style={{ objectFit: "cover" }}
        />
      </div>

      <h2 dir={docDir}>
        {document.documentElement.lang == "en"
          ? "Captured Image"
          : "إلتقاط الصورة"}
      </h2>
      <div
        style={{
          width: "400px",
          height: "300px",
          border: "2px solid black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10px",
          backgroundColor: "gray",
        }}
      >
        {imageCaptured ? (
          <img
            ref={imgRef}
            width="400"
            height="300"
            alt="Captured"
            style={{ objectFit: "cover" }}
          />
        ) : (
          "Waiting for capture..."
        )}
      </div>

      <canvas
        ref={canvasRef}
        width="400"
        height="300"
        style={{ display: "none" }}
      />

      <h2>Detected Objects</h2>
      <ul>
        {objects.length > 0 ? (
          objects.map((obj, i) => <li key={i}>{obj.class}</li>)
        ) : (
          <li>No objects detected</li>
        )}
      </ul>

      <h3 style={{ color: "green" }}>{status}</h3>
      <h3>{description}</h3>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import lowerEllipse from "../../assets/lower-ellipse.svg";
import upperEllipse from "../../assets/upper-ellipse.svg";

export default function ObjectDetectV3Arabic() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [status, setStatus] = useState("Loading...");
  const [description, setDescription] = useState("");
  const [_, setObjects] = useState([]);
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
              const translatedText = data.translated_text; 

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
    <div className="bg-[#C1CFCD]  min-h-screen p-5 flex flex-col items-center relative">
      
      <img src={upperEllipse} alt="*Decoration*" className="w-2/12 absolute top-0 right-0 z-0" />
      <img src={lowerEllipse} alt="*Decoration*" className="w-2/12 absolute bottom-0 left-0 z-0" />
      <h3 className=" text-center border text-green-700 border-gray-700 p-5 z-10  rounded-2xl top-5 shadow-2xl bg-[#C1CFCD]">{status}</h3>
      <div className="flex flex-col lg:flex-row items-center justify-center w-full mb-5 z-10">
        <div className="flex flex-col items-center w-full">
          <h2 dir={docDir} className="p-2 text-lg">
            {document.documentElement.lang == "en"
              ? "Camera Feed"
              : "تغذية الكاميرا"}
          </h2>
          <div
            className="rounded-xl border-2 w-8/12 md:w-1/2 lg:w-7/12 border-gray-700 flex justify-center items-center mb-2 z-10"
          >
            <video
              ref={videoRef}
              autoPlay
              className="w-full h-full rounded-xl z-10"
            />
          </div>
        </div>

        <div className={`flex flex-col items-center w-full ${imageCaptured ? "" : "hidden"}`}>
          <h2 dir={docDir} className="p-2 text-lg">
            {document.documentElement.lang == "en"
              ? "Captured Image"
              : "إلتقاط الصورة"}
          </h2>
          
          <div className="rounded-xl min-h-20 border-2 w-8/12 md:w-1/2 lg:w-7/12 border-gray-700 flex justify-center items-center mb-2 bg-gray-200">
              <img
                ref={imgRef}
                alt="Captured"
                className="w-full h-full rounded-xl"
              />
            
          </div>

          <canvas
            ref={canvasRef}
            width="400"
            height="300"
            style={{ display: "none" }}
          />
        </div>
      </div>
      <div className={`py-2 px-5 border-2 border-black text-[#C1CFCD] rounded-xl bg-gray-700 mt-4 ${imageCaptured ? "" : "hidden"}`}>{description == "" ? "No objects detected": description}</div>
    </div>
  );
}

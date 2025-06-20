import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"; 
import lowerEllipse from "../../assets/lower-ellipse.svg";
import upperEllipse from "../../assets/upper-ellipse.svg";
import Footer from "../Footer";

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
          if (data.functionality === "object-detection" && data.lang=="en") {
            navigate("/object-detection-en");
          } else if(data.functionality === "object-detection" && data.lang=="ar"){
            navigate("/object-detection-ar");
          } 
           else if (data.functionality === "sign-language" && data.lang == "ar") {
            navigate("/sign-language-ar");
          }
           else if (data.functionality === "sign-language" && data.lang == "en") {
            navigate("/sign-language-en");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#C1CFCD] relative">
      <img src={upperEllipse} alt="*Decoration*" className="w-2/12 absolute top-0 right-0 z-0" />
      <img src={lowerEllipse} alt="*Decoration*" className="w-2/12 absolute bottom-0 left-0 z-0" />
      <h2 className=" text-center p-5 z-10 absolute rounded-2xl top-5 shadow-2xl border border-gray-700 bg-[#C1CFCD]">{message}</h2>

      <div className="flex flex-col md:flex-row items-center mt-24 mb-10">
        <p className="text-4xl p-2">Smart Glove</p>
        <p className="text-4xl p-2">القفاز الذكي</p>
      </div>
      <img src={logo} alt="logo" className="rounded-full w-1/2 lg:w-1/4" />
      <p className="p-2 py-5 text-gray-700">Your accessibility, our mission.</p>

      <Footer/>
    </div>
  );
}

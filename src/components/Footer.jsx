import React from 'react';

const Footer = () => {
  return (
      <footer className="text-center text-gray-600 text-sm mt-4">
        <p>
          {document.documentElement.lang === "ar"
            ? "جميع الحقوق محفوظة © 2025"
            : "All rights reserved © 2025"}
        </p>
        <p>
          {document.documentElement.lang === "ar"
            ? "تم تطويره بواسطة فريق القفاز الذكي بالجامعة الحديثة للتكنولوجيا والمعلومات MTI"
            : "Developed by Smart Glove Team at Modern University for Technology and Information MTI"}
        </p>
      </footer>
  )
}

export default Footer
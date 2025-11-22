import { useEffect, useState } from "react";

export default function AnnouncementBar() {
  const messages = [
    "🚚 Free Shipping on all Orders!",
    "🔥 Exclusive Deals Updated Daily!",
    "💳 Secure Payments & Easy Returns",
    "⚡ Fast Delivery Across Pakistan",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000); // Change message every 3 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-green-600 text-white py-2 text-center font-medium">
      <div className="transition-all duration-700 ease-in-out">
        {messages[index]}
      </div>
    </div>
  );
}

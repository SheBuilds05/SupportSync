import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/test-db")
      .then((res) => res.json())
      .then((data) => {
        if (data.collections) {
          setMessage(
            "Connected to MongoDB ✅ Collections: " + data.collections.join(", ")
          );
        } else {
          setMessage("Connected to MongoDB ✅ but no collections found");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setMessage("Connection failed ❌");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  );
}

export default App;

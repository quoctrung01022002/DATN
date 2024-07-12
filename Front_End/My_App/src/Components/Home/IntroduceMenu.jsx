import { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import axios from "axios";

function IntroductionPage() {
  const [introduction, setIntroduction] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:7138/api/Introduce");
      console.log("ád", response.data);

      const activeIntroductions = response.data.filter((item) => item.isActive);
      setIntroduction(activeIntroductions);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching introduction:", error);
      setError(error);
      setLoading(false);
    }
  };

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  if (loading) {
    return (
      <animated.div
        style={{ textAlign: "center", marginTop: "20px", ...fadeIn }}
      >
        Loading...
      </animated.div>
    );
  }

  if (error) {
    return (
      <animated.div
        style={{
          textAlign: "center",
          marginTop: "20px",
          color: "red",
          ...fadeIn,
        }}
      >
        Error: {error.message}
      </animated.div>
    );
  }

  return (
    <animated.div className="introduction-page" style={fadeIn}>
      <div className="container">
        <h2
          className="mt-4 mb-4"
          style={{ textAlign: "center", display: "block" }}
        >
          Giới Thiệu
        </h2>
        <div className="introduction-content">
          {/* Render each introduction */}
          {introduction.map((item) => (
            <animated.div
              key={item.id}
              style={{
                ...fadeIn,
                marginBottom: "20px",
                padding: "20px",
                backgroundColor: "#f0f0f0",
                borderRadius: "5px",
              }}
            >
              <h3>{item.title}</h3>
              {item.content.split("-").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
              {item.imageUrl && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "20px",
                  }}
                >
                  <img
                    src={`https://localhost:7138${item.imageUrl}`}
                    alt={item.title}
                    style={{ maxWidth: "100%" }}
                  />
                </div>
              )}
            </animated.div>
          ))}
        </div>
      </div>
    </animated.div>
  );
}

export default IntroductionPage;

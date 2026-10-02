import { useState } from "react";
import "./App.css";

const API_URL = "/api/detect";
const API_BASE = "http://127.0.0.1:8001";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
  };

  const analyzeImage = async () => {
    if (!file) {
      alert("Please upload an image first.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message = `Backend returned HTTP ${response.status}`;

        try {
          const errorData = await response.json();
          message = errorData.detail || message;
        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(message);
      }

      const data = await response.json();

      console.log("Backend response:", data);

      setResult(data);
   } catch (error) {
  console.error("Frontend error:", error);

  setResult({
    accepted: false,
    reason: `Backend connection failed: ${error.message}`,
    quality: {
      accepted: false,
      reason: "Backend request failed",
      blur_score: 0,
      brightness: 0,
    },
    detections: [],
    average_confidence: {
      supporting_tower: 0,
      monopole_tower: 0,
    },
    image: null,
    connectionError: true,
  });
} finally {      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview("");
    setResult(null);
  };

  const getDetectionCount = () => {
    return result?.detections?.length || 0;
  };

  const getClassConfidence = (className) => {
    const value = result?.average_confidence?.[className];

    if (typeof value !== "number" || value <= 0) {
      return "0%";
    }

    return `${(value * 100).toFixed(2)}%`;
  };

  const getTowerTypes = () => {
    if (!result?.detections?.length) {
      return "No tower detected";
    }

    return [
      ...new Set(result.detections.map((d) => d.class)),
    ].join(", ");
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">⚡</div>

          <div>
            <h1>TowerVision AI</h1>
            <p>Intelligent Tower Detection & Inspection</p>
          </div>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          AI SYSTEM ONLINE
        </div>
      </header>

      <main className="dashboard">

        <section className="welcome">
          <div>
            <p className="small-title">
              AI-POWERED INFRASTRUCTURE INSPECTION
            </p>

            <h2>
              Detect Your Tower <span>Instantly.</span>
            </h2>

            <p className="description">
              Upload a tower image. Our AI first checks image quality,
              then performs real YOLO-based tower detection.
            </p>
          </div>

          <div className="ai-orb">
            <div className="orb-ring"></div>
            <div className="orb-core">AI</div>
          </div>
        </section>

        <section className="stats">

          <div className="stat-card">
            <div className="stat-icon">📷</div>
            <div>
              <span>INPUT</span>
              <strong>{file ? "Received" : "Waiting"}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div>
              <span>IMAGE QUALITY</span>
              <strong>
                {result?.quality
                  ? result.quality.accepted
                    ? "Accepted"
                    : "Rejected"
                  : "--"}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🗼</div>
            <div>
              <span>TOWER TYPE</span>
              <strong>
                {result?.detections?.length
                  ? result.detections.map((d) => d.class).join(", ")
                  : "--"}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div>
              <span>STATUS</span>
              <strong>
                {loading
                  ? "Processing"
                  : result
                  ? result.accepted
                    ? "Completed"
                    : "Rejected"
                  : "Ready"}
              </strong>
            </div>
          </div>

        </section>

        <section className="main-grid">

          <div className="panel upload-panel">

            <div className="panel-heading">
              <div>
                <p className="panel-label">IMAGE INPUT</p>
                <h3>Tower Image</h3>
              </div>

              <span className="step-number">01</span>
            </div>

            {!preview ? (
              <label className="upload-box">

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                />

                <div className="upload-icon">⬆</div>

                <h4>Upload Tower Image</h4>

                <p>Click here to browse your computer</p>

                <span className="supported">
                  JPG • JPEG • PNG • WEBP
                </span>

              </label>
            ) : (
              <div className="preview-container">

                <img
                  src={preview}
                  alt="Uploaded tower"
                  className="tower-image"
                />

                <div className="image-info">

                  <span>📄</span>

                  <div>
                    <strong>{file?.name}</strong>
                    <small>
                      Image ready for AI inspection
                    </small>
                  </div>

                </div>

              </div>
            )}

            {file && (
              <div className="button-group">

                <button
                  className="analyze-button"
                  onClick={analyzeImage}
                  disabled={loading}
                >
                  {loading
                    ? "AI ANALYZING..."
                    : "⚡ ANALYZE TOWER"}
                </button>

                <button
                  className="new-image-button"
                  onClick={reset}
                  disabled={loading}
                >
                  ↻ Upload New Image
                </button>

              </div>
            )}

          </div>

          <div className="panel process-panel">

            <div className="panel-heading">

              <div>
                <p className="panel-label">AI PIPELINE</p>
                <h3>Detection Process</h3>
              </div>

              <span className="live-badge">LIVE</span>

            </div>

            <div className="pipeline">

              <div className="pipeline-item">

                <div className="pipeline-icon completed-icon">
                  01
                </div>

                <div className="pipeline-content">

                  <strong>Image Quality Check</strong>

                  <span>
                    {loading
                      ? "Checking image quality..."
                      : result?.quality
                      ? result.quality.accepted
                        ? "Image quality accepted"
                        : result.quality.reason ||
                          result.reason
                      : "Waiting for analysis"}
                  </span>

                </div>

              </div>

              <div className="pipeline-item">

                <div className="pipeline-icon">02</div>

                <div className="pipeline-content">

                  <strong>Object Detection</strong>

                  <span>
                    {loading
                      ? "YOLO model processing..."
                      : result?.accepted
                      ? `${getDetectionCount()} detection(s) found`
                      : result
                      ? "Detection skipped"
                      : "AI model waiting"}
                  </span>

                </div>

              </div>

              <div className="pipeline-item">

                <div className="pipeline-icon">03</div>

                <div className="pipeline-content">

                  <strong>Analysis Completion</strong>

                  <span>
                    {loading
                      ? "Processing..."
                      : result
                      ? result.accepted
                        ? "Detection successfully completed"
                        : "Image rejected"
                      : "Processing pending"}
                  </span>

                </div>

              </div>

            </div>

            {loading && (
              <div className="progress-section">

                <div className="progress-top">
                  <span>Processing</span>
                  <strong>AI</strong>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: "70%" }}
                  ></div>
                </div>

              </div>
            )}

          </div>

        </section>

        {result && !result.accepted && (
          <section className="rejection-panel">

            <div className="rejection-icon">⚠</div>

            <div className="rejection-content">

              <p className="panel-label">
                IMAGE QUALITY VALIDATION
              </p>

              <h3>Image Rejected</h3>

              <p>{result.reason}</p>

              <span>
                Object detection was skipped to avoid unreliable results.
              </span>

              {result.quality && (
                <p>
                  Blur Score:{" "}
                  {result.quality.blur_score ?? "N/A"}
                  {" | "}
                  Brightness:{" "}
                  {result.quality.brightness ?? "N/A"}
                </p>
              )}

            </div>

          </section>
        )}

        {result?.accepted && (
          <section className="result-panel">

            <div className="result-header">

              <div>
                <p className="panel-label">AI RESULT</p>
                <h3>Detection Output</h3>
              </div>

              <div className="success-notification">
                ✓ Analysis Completed Successfully
              </div>

            </div>

            <div className="result-grid">

              <div className="output-image-container">

                <div className="detection-wrapper">

                  <img
                    src={
                      result.image
                        ? `${API_BASE}${result.image}`
                        : preview
                    }
                    alt="Detection output"
                  />

                </div>

              </div>

              <div className="result-information">

                <div className="detected-card">

                  <div className="tower-symbol">🗼</div>

                  <div>

                    <span>DETECTED STRUCTURES</span>

                    <h2>{getTowerTypes()}</h2>

                    <p>
                      Real YOLO model detection result.
                    </p>

                  </div>

                </div>

                <div className="result-details">

                  <div>
                    <span>Image Quality</span>
                    <strong>Accepted</strong>
                  </div>

                  <div>
                    <span>Detections</span>
                    <strong>{getDetectionCount()}</strong>
                  </div>

                  <div>
                    <span>Supporting Tower</span>
                    <strong>
                      {getClassConfidence("supporting_tower")}
                    </strong>
                  </div>

                  <div>
                    <span>Monopole Tower</span>
                    <strong>
                      {getClassConfidence("monopole_tower")}
                    </strong>
                  </div>

                  <div>
                    <span>Detection Status</span>
                    <strong className="green">Verified</strong>
                  </div>

                  <div>
                    <span>Analysis</span>
                    <strong>Completed</strong>
                  </div>

                </div>

                {getDetectionCount() > 0 && (
                  <div className="result-details">

                    <div>
                      <span>Detected Classes</span>
                      <strong>
                        {getTowerTypes()}
                      </strong>
                    </div>

                    <div>
                      <span>Bounding Boxes</span>
                      <strong>
                        {getDetectionCount()} localized
                      </strong>
                    </div>

                  </div>
                )}

              </div>

            </div>

          </section>
        )}

        <footer>

          <span>
            TowerVision AI • Intelligent Infrastructure Analysis
          </span>

          <span>
            AI MODEL STATUS: <b>READY</b>
          </span>

        </footer>

      </main>
    </div>
  );
}

export default App;
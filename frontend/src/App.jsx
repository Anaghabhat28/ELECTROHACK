import { useState } from "react";
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [quality, setQuality] = useState(null);
  const [qualityStatus, setQualityStatus] = useState(null);
  const [towerType, setTowerType] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Waiting for image");
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [rejected, setRejected] = useState(false);

  // =========================
  // IMAGE UPLOAD
  // =========================
  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    setImageName(file.name);
    setSelectedImage(imageURL);

    setQuality(null);
    setQualityStatus(null);
    setTowerType(null);
    setConfidence(null);
    setProgress(0);
    setCompleted(false);
    setRejected(false);
    setProcessing(false);
    setStatus("Image uploaded successfully");
  };

  // =========================
  // AI ANALYSIS
  // =========================
  const analyzeImage = () => {
    if (!selectedImage) {
      alert("Please upload a tower image first.");
      return;
    }

    setProcessing(true);
    setCompleted(false);
    setRejected(false);
    setTowerType(null);
    setConfidence(null);

    setProgress(10);
    setStatus("Checking image quality...");

    // STEP 1 - IMAGE QUALITY
    setTimeout(() => {
      const fileName = imageName.toLowerCase();

      /*
        DEMO QUALITY TESTING

        If filename contains:
        blur / blurred       -> image rejected
        overexposed / over   -> image rejected
        underexposed / under -> image rejected

        Otherwise image is accepted.
      */

      const badImage =
        fileName.includes("blur") ||
        fileName.includes("overexposed") ||
        fileName.includes("over") ||
        fileName.includes("underexposed") ||
        fileName.includes("under");

      if (badImage) {
        setQuality(35);
        setQualityStatus("Rejected");
        setProgress(35);
        setRejected(true);
        setProcessing(false);
        setStatus("Image rejected - unsuitable for detection");
        return;
      }

      setQuality(92);
      setQualityStatus("Accepted");
      setProgress(30);
      setStatus("Image quality check completed");
    }, 1200);

    // STEP 2 - OBJECT DETECTION
    setTimeout(() => {
      if (rejected) return;

      setProgress(55);
      setStatus("Detecting tower structure...");
    }, 2200);

    // STEP 3 - TOWER DETECTION
    setTimeout(() => {
      const fileName = imageName.toLowerCase();

      let result = "Unknown Tower";
      let score = 88;

      /*
        TEMPORARY DEMO DETECTION

        supporting.jpg -> Supporting Tower
        monopole.jpg   -> Monopole Tower

        Later this section will be replaced
        with your trained AI model.
      */

      if (
        fileName.includes("supporting") ||
        fileName.includes("support")
      ) {
        result = "Supporting Tower";
        score = 94;
      } else if (
        fileName.includes("monopole") ||
        fileName.includes("mono")
      ) {
        result = "Monopole Tower";
        score = 96;
      }

      setTowerType(result);
      setConfidence(score);
      setProgress(80);
      setStatus("Tower structure detected");
    }, 3500);

    // STEP 4 - COMPLETION
    setTimeout(() => {
      setProgress(100);
      setStatus("Analysis completed successfully");
      setProcessing(false);
      setCompleted(true);
    }, 4700);
  };

  // =========================
  // RESET
  // =========================
  const resetDashboard = () => {
    setSelectedImage(null);
    setImageName("");
    setQuality(null);
    setQualityStatus(null);
    setTowerType(null);
    setConfidence(null);
    setProgress(0);
    setStatus("Waiting for image");
    setProcessing(false);
    setCompleted(false);
    setRejected(false);
  };

  return (
    <div className="app">

      {/* BACKGROUND */}
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>
      <div className="grid-background"></div>

      {/* HEADER */}
      <header className="header">

        <div className="brand">

          <div className="brand-icon">◈</div>

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

      {/* DASHBOARD */}
      <main className="dashboard">

        {/* WELCOME */}
        <section className="welcome">

          <div>

            <p className="small-title">
              AI-POWERED INFRASTRUCTURE INSPECTION
            </p>

            <h2>
              Detect Your Tower
              <span> Instantly.</span>
            </h2>

            <p className="description">
              Upload a tower image and let our intelligent vision
              system check image quality, detect the tower structure,
              and generate a detailed inspection result.
            </p>

          </div>

          <div className="ai-orb">
            <div className="orb-ring"></div>
            <div className="orb-core">AI</div>
          </div>

        </section>

        {/* STAT CARDS */}
        <section className="stats">

          <div className="stat-card">
            <div className="stat-icon">📷</div>
            <div>
              <span>INPUT</span>
              <strong>
                {selectedImage ? "Received" : "Waiting"}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✨</div>
            <div>
              <span>IMAGE QUALITY</span>
              <strong>
                {quality ? `${quality}%` : "--"}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🗼</div>
            <div>
              <span>TOWER TYPE</span>
              <strong>
                {towerType || "--"}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div>
              <span>STATUS</span>
              <strong>
                {rejected
                  ? "Rejected"
                  : completed
                  ? "Completed"
                  : processing
                  ? "Processing"
                  : "Ready"}
              </strong>
            </div>
          </div>

        </section>

        {/* MAIN TWO COLUMN AREA */}
        <section className="main-grid">

          {/* =========================
              LEFT - IMAGE INPUT
          ========================= */}
          <div className="panel upload-panel">

            <div className="panel-heading">

              <div>
                <p className="panel-label">
                  IMAGE INPUT
                </p>

                <h3>
                  Tower Image
                </h3>
              </div>

              <span className="step-number">
                01
              </span>

            </div>

            {/* NO IMAGE */}
            {!selectedImage ? (

              <label className="upload-box">

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />

                <div className="upload-icon">
                  ↑
                </div>

                <h4>
                  Upload Tower Image
                </h4>

                <p>
                  Click here to browse your computer
                </p>

                <span className="supported">
                  JPG • JPEG • PNG
                </span>

              </label>

            ) : (

              <div className="preview-container">

                <img
                  src={selectedImage}
                  alt="Uploaded tower"
                  className="tower-image"
                />

                <div className="image-info">

                  <span>📁</span>

                  <div>
                    <strong>
                      {imageName}
                    </strong>

                    <small>
                      Image ready for AI inspection
                    </small>
                  </div>

                </div>

              </div>

            )}

            {/* BUTTONS */}
            {selectedImage && (

              <div className="button-group">

                <button
                  className="analyze-button"
                  onClick={analyzeImage}
                  disabled={processing}
                >
                  {processing
                    ? "AI ANALYZING..."
                    : "▶ ANALYZE TOWER"}
                </button>

                <label className="new-image-button">

                  ↻ Upload New Image

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                </label>

              </div>

            )}

          </div>

          {/* =========================
              RIGHT - AI PIPELINE
          ========================= */}
          <div className="panel process-panel">

            <div className="panel-heading">

              <div>

                <p className="panel-label">
                  AI PIPELINE
                </p>

                <h3>
                  Detection Process
                </h3>

              </div>

              <span className="live-badge">
                LIVE
              </span>

            </div>

            <div className="pipeline">

              {/* QUALITY */}
              <div className="pipeline-item">

                <div
                  className={`pipeline-icon ${
                    quality
                      ? rejected
                        ? "rejected-icon"
                        : "completed-icon"
                      : ""
                  }`}
                >
                  {quality
                    ? rejected
                      ? "!"
                      : "✓"
                    : "01"}
                </div>

                <div className="pipeline-content">

                  <strong>
                    Image Quality Check
                  </strong>

                  <span>
                    {quality
                      ? rejected
                        ? "Image quality insufficient"
                        : `Quality Score: ${quality}%`
                      : "Waiting for analysis"}
                  </span>

                </div>

              </div>

              {/* OBJECT DETECTION */}
              <div className="pipeline-item">

                <div
                  className={`pipeline-icon ${
                    towerType ? "completed-icon" : ""
                  }`}
                >
                  {towerType ? "✓" : "02"}
                </div>

                <div className="pipeline-content">

                  <strong>
                    Object Detection
                  </strong>

                  <span>
                    {towerType
                      ? "Tower structure detected"
                      : rejected
                      ? "Detection skipped"
                      : "AI model waiting"}
                  </span>

                </div>

              </div>

              {/* COMPLETION */}
              <div className="pipeline-item">

                <div
                  className={`pipeline-icon ${
                    completed ? "completed-icon" : ""
                  }`}
                >
                  {completed ? "✓" : "03"}
                </div>

                <div className="pipeline-content">

                  <strong>
                    Analysis Completion
                  </strong>

                  <span>
                    {completed
                      ? "Detection successfully completed"
                      : rejected
                      ? "Detection process terminated"
                      : "Processing pending"}
                  </span>

                </div>

              </div>

            </div>

            {/* PROGRESS */}
            <div className="progress-section">

              <div className="progress-top">

                <span>
                  Processing Progress
                </span>

                <strong>
                  {progress}%
                </strong>

              </div>

              <div className="progress-bar">

                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`
                  }}
                ></div>

              </div>

            </div>

            {/* CURRENT STATUS */}
            <div className="current-status">

              <span className="status-small-dot"></span>

              <div>

                <small>
                  CURRENT STATUS
                </small>

                <strong>
                  {status}
                </strong>

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            IMAGE QUALITY REJECTION
        ========================= */}
        {rejected && (

          <section className="rejection-panel">

            <div className="rejection-icon">
              ⚠
            </div>

            <div className="rejection-content">

              <p className="panel-label">
                IMAGE QUALITY VALIDATION
              </p>

              <h3>
                Image Rejected
              </h3>

              <p>
                Image quality is insufficient for reliable detection.
              </p>

              <span>
                Detection process terminated.
              </span>

            </div>

          </section>

        )}

        {/* =========================
            RESULT
        ========================= */}
        {towerType && !rejected && (

          <section className="result-panel">

            <div className="result-header">

              <div>

                <p className="panel-label">
                  AI RESULT
                </p>

                <h3>
                  Detection Output
                </h3>

              </div>

              {completed && (

                <div className="success-notification">

                  <span>✓</span>

                  Analysis Completed Successfully

                </div>

              )}

            </div>

            <div className="result-grid">

              {/* OUTPUT IMAGE */}
              <div className="output-image-container">

                {selectedImage && (

                  <div className="detection-wrapper">

                    <img
                      src={selectedImage}
                      alt="Detection output"
                    />

                    <div className="detection-box">

                      <span>
                        {towerType}
                      </span>

                      <div className="corner tl"></div>
                      <div className="corner tr"></div>
                      <div className="corner bl"></div>
                      <div className="corner br"></div>

                    </div>

                  </div>

                )}

              </div>

              {/* RESULT INFORMATION */}
              <div className="result-information">

                <div className="detected-card">

                  <div className="tower-symbol">
                    🗼
                  </div>

                  <div>

                    <span>
                      DETECTED STRUCTURE
                    </span>

                    <h2>
                      {towerType}
                    </h2>

                    <p>
                      AI vision system identified
                      the uploaded tower structure.
                    </p>

                  </div>

                </div>

                <div className="result-details">

                  <div>
                    <span>Image Quality</span>
                    <strong>
                      {quality}%
                    </strong>
                  </div>

                  <div>
                    <span>Detection Status</span>
                    <strong className="green">
                      Verified
                    </strong>
                  </div>

                  <div>
                    <span>Object</span>
                    <strong>
                      Tower
                    </strong>
                  </div>

                  <div>
                    <span>Class</span>
                    <strong>
                      {towerType}
                    </strong>
                  </div>

                  <div>
                    <span>Confidence</span>
                    <strong>
                      {confidence}%
                    </strong>
                  </div>

                  <div>
                    <span>Analysis</span>
                    <strong>
                      {completed
                        ? "Completed"
                        : "Processing"}
                    </strong>
                  </div>

                </div>

              </div>

            </div>

          </section>

        )}

        {/* =========================
            OVERALL SUMMARY
        ========================= */}
        {completed && !rejected && (

          <section className="summary-panel">

            <div className="summary-icon">
              ✓
            </div>

            <div className="summary-content">

              <p className="panel-label">
                OVERALL SUMMARY
              </p>

              <h3>
                Tower Inspection Completed
              </h3>

              <p>
                The uploaded image was successfully processed
                through the AI inspection pipeline. The image
                quality was checked, the tower structure was
                detected, and the final result was generated.
              </p>

              <div className="summary-tags">

                <span>
                  ✓ Image Quality: {quality}%
                </span>

                <span>
                  ✓ Object: Tower
                </span>

                <span>
                  ✓ Type: {towerType}
                </span>

                <span>
                  ✓ Confidence: {confidence}%
                </span>

                <span>
                  ✓ Status: Completed
                </span>

              </div>

            </div>

          </section>

        )}

        {/* =========================
            COMPLETION NOTIFICATION
        ========================= */}
        {completed && !rejected && (

          <div className="notification show">

            <div className="notification-icon">
              ✓
            </div>

            <div>

              <strong>
                Detection Complete
              </strong>

              <span>
                {towerType} successfully identified.
              </span>

            </div>

          </div>

        )}

        {/* FOOTER */}
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

# 🚀 TowerVision AI

### AI-Powered Tower Detection & Image Quality Inspection System

TowerVision AI is an AI-based infrastructure inspection system that uses **YOLO object detection** to identify tower structures from images. Before performing detection, the system checks the uploaded image for **blur and exposure quality** to reduce unreliable predictions.

The system currently detects:

* 🏗️ Supporting Tower
* 🗼 Monopole Tower

It provides the detected tower class, confidence score, bounding box, and an annotated output image through a **FastAPI backend** and **React frontend**.

---

## 🎯 Problem Statement

AI-Based Tower Component Detection and Visualization

Tower inspection often relies on manually reviewing images captured from different environments. Poor-quality images such as blurry, underexposed, or overexposed images can result in unreliable detection.

TowerVision AI addresses this by introducing an automated pipeline:

```text
Upload Image
      ↓
Image Quality Validation
      ↓
 ┌───────────────┐
 │ Suitable?     │
 └───────┬───────┘
       YES│NO
          │
          ├──────────────→ Reject Image
          │
          ↓
     YOLO Detection
          ↓
   Tower Classification
          ↓
 Bounding Box + Confidence
          ↓
    Annotated Image
          ↓
      Final Result
```

---

## ✨ Features

### 🖼️ Image Upload

Users can upload tower images through the React-based web interface.

Supported formats:

* JPG
* JPEG
* PNG
* WebP
* BMP

Maximum file size:

```text
10 MB
```

### 🔍 Image Quality Validation

Before AI detection, the system evaluates image quality using:

* Blur/sharpness analysis
* Brightness analysis

Images may be rejected when they are:

* Too blurry
* Underexposed
* Overexposed

This prevents the detection model from producing results on unsuitable images.

### 🤖 AI Tower Detection

A custom-trained YOLO model is used for object detection.

Current classes:

```text
0 → supporting_tower
1 → monopole_tower
```

### 📦 Bounding Box Detection

The model identifies the location of the detected tower using bounding-box coordinates.

### 📊 Confidence Score

The system returns the confidence score associated with each detection.

### 🖼️ Annotated Output

Detected towers are highlighted with bounding boxes and class labels.

### 🌐 Web Dashboard

The React frontend displays:

* Uploaded image
* Image quality status
* Tower type
* Confidence
* Detection status
* Processing progress
* Detection output

---

# 🧠 System Architecture

```text
                    USER
                      │
                      ▼
              ┌───────────────┐
              │  React + Vite │
              │   Frontend    │
              └───────┬───────┘
                      │
                Upload Image
                      │
                      ▼
              ┌───────────────┐
              │    FastAPI    │
              │    Backend    │
              └───────┬───────┘
                      │
                      ▼
          ┌─────────────────────────┐
          │   Image Quality Check   │
          │                         │
          │ Blur + Brightness      │
          └────────────┬────────────┘
                       │
                 ┌─────┴─────┐
                 │           │
              Invalid      Valid
                 │           │
                 ▼           ▼
              REJECT      YOLO Model
                             │
                             ▼
                    ┌────────────────┐
                    │    best.pt     │
                    │                │
                    │ Supporting     │
                    │ Monopole       │
                    └───────┬────────┘
                            │
                            ▼
                  Bounding Box +
                    Confidence
                            │
                            ▼
                   Annotated Image
                            │
                            ▼
                      React UI
                            │
                            ▼
                     Final Result
```

---

# 📁 Project Structure

```text
ELECTROHACK/
│
├── backend/
│   │
│   ├── main.py
│   ├── requirements.txt
│   │
│   ├── models/
│   │   └── best.pt
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   └── detect.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── detector.py
│   │   └── image_quality.py
│   │
│   └── outputs/
│
├── frontend/
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   │
│   ├── public/
│   │
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       └── index.css
│
├── dataset/
│   │
│   ├── images/
│   │   ├── train/
│   │   └── val/
│   │
│   └── labels/
│       ├── train/
│       └── val/
│
├── annotate.py
├── auto_label.py
├── box_only.py
├── click_box.py
├── fast_annotate.py
├── simple_annotate.py
├── split_dataset.py
│
└── yolov8n.pt
```

---

# 🗂️ Dataset

The dataset follows the YOLO object-detection format.

```text
dataset/
├── images/
│   ├── train/
│   └── val/
│
└── labels/
    ├── train/
    └── val/
```

### Training Dataset

Images in:

```text
dataset/images/train/
```

are used to train the object detection model.

### Validation Dataset

Images in:

```text
dataset/images/val/
```

are used to evaluate the model on images that were not used directly during training.

### Annotations

Each image has corresponding YOLO-format annotation information containing:

```text
class
x_center
y_center
width
height
```

---

# 🤖 Model

TowerVision AI uses a custom-trained YOLO model.

The trained model is stored at:

```text
backend/models/best.pt
```

The model contains two classes:

```text
Class 0 → supporting_tower
Class 1 → monopole_tower
```

The model was trained specifically for the tower detection task rather than using the default COCO object classes.

---

# 🛠️ Technology Stack

## AI / Machine Learning

* Python
* YOLO
* Ultralytics
* PyTorch
* OpenCV
* NumPy
* Pillow

## Backend

* FastAPI
* Uvicorn
* Python

## Frontend

* React
* Vite
* JavaScript
* CSS

## Dataset / Annotation

* YOLO annotation format
* LabelImg / annotation utilities
* Training and validation split

## Development

* Git
* GitHub
* VS Code

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ELECTROHACK
```

---

# 🐍 Backend Setup

Create and activate a Python virtual environment.

### Windows

```bash
python -m venv .venv
```

Activate:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

---

# ▶️ Start Backend

From the project root:

```bash
cd backend
uvicorn main:app --reload --port 8001
```

The backend will run at:

```text
http://127.0.0.1:8001
```

API endpoint:

```text
POST /detect
```

Full endpoint:

```text
http://127.0.0.1:8001/detect
```

---

# 💻 Frontend Setup

Open another terminal.

Navigate to:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173/
```

or another available Vite port if the default port is already in use.

---

# 🔗 Frontend–Backend Integration

The frontend communicates with the FastAPI backend using:

```javascript
const API_URL = "http://127.0.0.1:8001/detect";
```

The workflow is:

```text
React
  │
  │ POST image
  ▼
FastAPI /detect
  │
  ▼
Image Quality Check
  │
  ▼
YOLO best.pt
  │
  ▼
Detection Result
  │
  ▼
React Dashboard
```

---

# 🧪 Testing

The system has been tested with different image conditions.

### ✅ Good Image

```text
Accepted
↓
YOLO Detection
↓
Tower Class + Confidence
```

Example:

```text
supporting_tower
Confidence: 0.9453
```

### 🗼 Monopole Detection

Example:

```text
monopole_tower
Confidence: 0.7671
```

### ❌ Blurry Image

Example:

```text
blurred_test.jpg
```

Result:

```text
Image rejected
Reason: Image is too blurry.
```

### ❌ Underexposed Image

Example:

```text
underexposed_test3.jpg
```

Result:

```text
Image rejected
Reason: Image is underexposed.
```

### ❌ Overexposed Image

Example:

```text
overexposed_test.jpg
```

Result:

```text
Image rejected
Reason: Image is overexposed.
```

---

# 📡 API Response

A successful detection returns information similar to:

```json
{
  "accepted": true,
  "quality": {
    "accepted": true,
    "reason": "Image quality is acceptable."
  },
  "detections": [
    {
      "class": "supporting_tower",
      "confidence": 0.9453,
      "bbox": [
        1209,
        57,
        3947,
        3597
      ]
    }
  ],
  "average_confidence": {
    "supporting_tower": 0.9453,
    "monopole_tower": 0
  },
  "image": "/outputs/example.jpg"
}
```

For an unsuitable image:

```json
{
  "accepted": false,
  "reason": "Image is too blurry. Please upload a sharper image.",
  "detections": [],
  "image": null
}
```

---

# 🔐 Input Validation

The backend validates:

* File type
* Empty uploads
* Maximum file size
* Image decoding
* Image quality

Maximum upload size:

```text
10 MB
```

---

# 🎯 Current Implementation

### Phase 1

```text
Dataset Preparation
       ↓
Image Annotation
       ↓
Train / Validation Split
       ↓
YOLO Model Training
       ↓
Custom best.pt
       ↓
Model Testing
```

### Phase 2

```text
Image Upload
       ↓
Image Quality Validation
       ↓
FastAPI Backend
       ↓
YOLO Inference
       ↓
Tower Classification
       ↓
Confidence + Bounding Box
       ↓
Annotated Output
       ↓
React Frontend
```

---

# 🚀 Future Scope

The current system can be extended with additional inspection capabilities such as:

* Tower component-level detection
* Structural defect detection
* Rust/corrosion detection
* Missing or damaged components
* Crack detection
* Image-based maintenance recommendations
* Severity classification
* Inspection report generation
* Database storage of inspection history
* User authentication
* Cloud deployment
* Mobile-friendly inspection workflow

These features can be incorporated as the project progresses.

---

# 👥 Team

Developed as part of **ELECTROHACK 4.0**.

### Project

**TowerVision AI — Intelligent Tower Detection & Inspection**

---

# 📌 Disclaimer

This project is a prototype developed for hackathon purposes. Detection results depend on image quality and the training dataset and should not be treated as a replacement for professional structural inspection.

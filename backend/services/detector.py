
from pathlib import Path

import cv2
from ultralytics import YOLO


BASE_DIR = Path(__file__).resolve().parent.parent

# Temporary model
MODEL_PATH = BASE_DIR.parent / "yolov8n.pt"

# Load model
model = YOLO(str(MODEL_PATH))


def detect_towers(
    image,
    confidence_threshold=0.25
):

    results = model.predict(
        source=image,
        conf=confidence_threshold,
        verbose=False
    )

    result = results[0]

    detections = []

    annotated_image = image.copy()

    names = model.names

    if result.boxes is not None:

        for box in result.boxes:

            class_id = int(
                box.cls[0].item()
            )

            confidence = float(
                box.conf[0].item()
            )

            x1, y1, x2, y2 = (
                box.xyxy[0]
                .cpu()
                .numpy()
                .astype(int)
            )

            class_name = names[class_id]

            detections.append({
                "class": class_name,
                "confidence": round(
                    confidence,
                    4
                ),
                "bbox": [
                    int(x1),
                    int(y1),
                    int(x2),
                    int(y2)
                ]
            })

            # Draw bounding box
            cv2.rectangle(
                annotated_image,
                (x1, y1),
                (x2, y2),
                (0, 255, 0),
                2
            )

            label = (
                f"{class_name} "
                f"{confidence:.2f}"
            )

            cv2.putText(
                annotated_image,
                label,
                (x1, max(y1 - 10, 20)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 255, 0),
                2
            )

    return {
        "detections": detections,
        "annotated_image": annotated_image
    }
from pathlib import Path

import cv2
from ultralytics import YOLO


BASE_DIR = Path(__file__).resolve().parent.parent

# Temporary model
MODEL_PATH = BASE_DIR.parent / "yolov8n.pt"

# Load model
model = YOLO(str(MODEL_PATH))


def detect_towers(
    image,
    confidence_threshold=0.25
):

    results = model.predict(
        source=image,
        conf=confidence_threshold,
        verbose=False
    )

    result = results[0]

    detections = []

    annotated_image = image.copy()

    names = model.names

    if result.boxes is not None:

        for box in result.boxes:

            class_id = int(
                box.cls[0].item()
            )

            confidence = float(
                box.conf[0].item()
            )

            x1, y1, x2, y2 = (
                box.xyxy[0]
                .cpu()
                .numpy()
                .astype(int)
            )

            class_name = names[class_id]

            detections.append({
                "class": class_name,
                "confidence": round(
                    confidence,
                    4
                ),
                "bbox": [
                    int(x1),
                    int(y1),
                    int(x2),
                    int(y2)
                ]
            })

            # Draw bounding box
            cv2.rectangle(
                annotated_image,
                (x1, y1),
                (x2, y2),
                (0, 255, 0),
                2
            )

            label = (
                f"{class_name} "
                f"{confidence:.2f}"
            )

            cv2.putText(
                annotated_image,
                label,
                (x1, max(y1 - 10, 20)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 255, 0),
                2
            )

    return {
        "detections": detections,
        "annotated_image": annotated_image
    }
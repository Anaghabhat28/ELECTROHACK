from pathlib import Path

import cv2
from ultralytics import YOLO


# =====================================================
# MODEL PATH
# =====================================================

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "models" / "best.pt"

print("Loading YOLO model from:")
print(MODEL_PATH)


# =====================================================
# LOAD MODEL ONCE
# =====================================================

model = YOLO(str(MODEL_PATH))

print("YOLO model loaded successfully.")
print("Model classes:", model.names)


# =====================================================
# DETECTION FUNCTION
# =====================================================

def detect_towers(
    image,
    confidence_threshold=0.25
):

    print("Starting YOLO detection...")

    results = model.predict(
        source=image,
        conf=confidence_threshold,
        verbose=False
    )

    print("YOLO detection completed.")

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

    print("Detections:", detections)

    return {
        "detections": detections,
        "annotated_image": annotated_image
    }
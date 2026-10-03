from pathlib import Path
import gc

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

    # -------------------------------------------------
    # Resize very large images before inference
    # -------------------------------------------------

    max_dimension = 1280

    height, width = image.shape[:2]

    scale = min(
        max_dimension / width,
        max_dimension / height,
        1.0
    )

    if scale < 1.0:

        new_width = int(width * scale)
        new_height = int(height * scale)

        image = cv2.resize(
            image,
            (new_width, new_height),
            interpolation=cv2.INTER_AREA
        )

        print(
            f"Image resized to: "
            f"{new_width}x{new_height}"
        )

    # -------------------------------------------------
    # YOLO inference
    # -------------------------------------------------

    results = model.predict(
        source=image,
        conf=confidence_threshold,
        imgsz=320,
        device="cpu",
        batch=1,
        max_det=10,
        verbose=False
    )

    print("YOLO detection completed.")

    result = results[0]

    detections = []

    annotated_image = image.copy()

    names = model.names

    # -------------------------------------------------
    # Process detections
    # -------------------------------------------------

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

            # -------------------------------------------------
            # Draw bounding box
            # -------------------------------------------------

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
                (
                    x1,
                    max(y1 - 10, 20)
                ),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 255, 0),
                2
            )

    print("Detections:", detections)

    # -------------------------------------------------
    # Release temporary memory
    # -------------------------------------------------

    del results
    gc.collect()

    return {
        "detections": detections,
        "annotated_image": annotated_image
    }
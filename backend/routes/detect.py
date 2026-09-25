from pathlib import Path
from uuid import uuid4

import cv2
import numpy as np

from fastapi import (
    APIRouter,
    File,
    HTTPException,
    UploadFile
)

from services.detector import detect_towers
from services.image_quality import check_image_quality


router = APIRouter(
    prefix="/detect",
    tags=["Detection"]
)


BASE_DIR = Path(__file__).resolve().parent.parent

OUTPUT_DIR = BASE_DIR / "outputs"

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True
)


ALLOWED_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/bmp"
}

MAX_FILE_SIZE = 10 * 1024 * 1024


@router.post("")
async def detect_image(
    file: UploadFile = File(...)
):

    # 1. Validate file type

    if file.content_type not in ALLOWED_TYPES:

        raise HTTPException(
            status_code=400,
            detail="Unsupported image format"
        )

    # 2. Read file

    image_bytes = await file.read()

    if not image_bytes:

        raise HTTPException(
            status_code=400,
            detail="Empty image file"
        )

    if len(image_bytes) > MAX_FILE_SIZE:

        raise HTTPException(
            status_code=413,
            detail="Image exceeds 10 MB"
        )

    # 3. Decode image

    image_array = np.frombuffer(
        image_bytes,
        dtype=np.uint8
    )

    image = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR
    )

    if image is None:

        raise HTTPException(
            status_code=400,
            detail="Unable to decode image"
        )

    # 4. Image quality check

    quality = check_image_quality(image)

    if not quality["accepted"]:

        return {
            "accepted": False,
            "reason": quality["reason"],
            "quality": quality,
            "detections": [],
            "average_confidence": {
                "supporting_tower": 0,
                "monopole_tower": 0
            },
            "image": None
        }

    # 5. YOLO detection

    try:

        result = detect_towers(
            image=image,
            confidence_threshold=0.25
        )

    except Exception as error:

        print("Detection error:", error)

        raise HTTPException(
            status_code=500,
            detail="Detection failed"
        )

    detections = result["detections"]

    annotated_image = result["annotated_image"]

    # 6. Save processed image

    output_filename = (
        f"{uuid4().hex}.jpg"
    )

    output_path = OUTPUT_DIR / output_filename

    saved = cv2.imwrite(
        str(output_path),
        annotated_image
    )

    if not saved:

        raise HTTPException(
            status_code=500,
            detail="Failed to save output image"
        )

    # 7. Average confidence

    target_classes = [
        "supporting_tower",
        "monopole_tower"
    ]

    average_confidence = {}

    for class_name in target_classes:

        scores = [
            d["confidence"]
            for d in detections
            if d["class"] == class_name
        ]

        average_confidence[class_name] = (
            round(sum(scores) / len(scores), 4)
            if scores else 0
        )

    # 8. Return response

    return {
        "accepted": True,
        "quality": quality,
        "detections": detections,
        "average_confidence": average_confidence,
        "image": f"/outputs/{output_filename}"
    }
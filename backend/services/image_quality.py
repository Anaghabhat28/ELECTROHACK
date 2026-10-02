import cv2
import numpy as np


BLUR_THRESHOLD = 100.0
UNDEREXPOSED_THRESHOLD = 50.0
OVEREXPOSED_THRESHOLD = 200.0


def check_image_quality(image) -> dict:
    """
    Check whether an OpenCV image is suitable for object detection.

    Checks:
    - Blur using Laplacian variance
    - Underexposure using mean brightness
    - Overexposure using mean brightness
    """

    if image is None:
        return {
            "accepted": False,
            "reason": "Could not read the image file.",
            "blur_score": None,
            "brightness": None
        }

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Blur detection
    blur_score = cv2.Laplacian(
        gray,
        cv2.CV_64F
    ).var()

    # Exposure detection
    brightness = float(np.mean(gray))

    # Check blur first
    if blur_score < BLUR_THRESHOLD:
        return {
            "accepted": False,
            "reason": "Image is too blurry. Please upload a sharper image.",
            "blur_score": round(blur_score, 2),
            "brightness": round(brightness, 2)
        }

    # Check underexposure
    if brightness < UNDEREXPOSED_THRESHOLD:
        return {
            "accepted": False,
            "reason": "Image is underexposed (too dark). Please upload a better-lit image.",
            "blur_score": round(blur_score, 2),
            "brightness": round(brightness, 2)
        }

    # Check overexposure
    if brightness > OVEREXPOSED_THRESHOLD:
        return {
            "accepted": False,
            "reason": "Image is overexposed (too bright/washed out). Please upload a better-exposed image.",
            "blur_score": round(blur_score, 2),
            "brightness": round(brightness, 2)
        }

    # Image passed all checks
    return {
        "accepted": True,
        "reason": "Image quality is acceptable.",
        "blur_score": round(blur_score, 2),
        "brightness": round(brightness, 2)
    }
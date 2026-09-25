"""
image_quality.py
Checks if an uploaded image is sharp enough and correctly exposed
before it is sent to the YOLO model for tower detection.

Used in backend/main.py like this:
    from services.image_quality import check_image_quality
    result = check_image_quality(image_path)
    if not result["is_acceptable"]:
        # reject the image, return result["reason"] to frontend
"""

import cv2
import numpy as np


# ---- Tune these thresholds if needed after testing on real sample images ----
BLUR_THRESHOLD = 100.0          # below this = too blurry (Laplacian variance)
UNDEREXPOSED_THRESHOLD = 50.0   # below this mean brightness (0-255) = too dark
OVEREXPOSED_THRESHOLD = 200.0   # above this mean brightness (0-255) = too bright
# -------------------------------------------------------------------------


def check_image_quality(image_path: str) -> dict:
    """
    Reads an image and checks blur + exposure.
    Returns a dictionary with the verdict and the reason.
    """
    image = cv2.imread(image_path)

    if image is None:
        return {
            "is_acceptable": False,
            "reason": "Could not read the image file. It may be corrupted.",
            "blur_score": None,
            "brightness": None
        }

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # --- Blur check ---
    # Laplacian highlights edges. A sharp image has many strong edges,
    # so the variance of the Laplacian is high. Blurry images have low variance.
    laplacian_variance = cv2.Laplacian(gray, cv2.CV_64F).var()

    # --- Exposure check ---
    # Mean pixel value tells us if the image is generally too dark or too bright.
    mean_brightness = np.mean(gray)

    # --- Decide pass/fail ---
    if laplacian_variance < BLUR_THRESHOLD:
        return {
            "is_acceptable": False,
            "reason": "Image is too blurry. Please upload a sharper image.",
            "blur_score": round(laplacian_variance, 2),
            "brightness": round(mean_brightness, 2)
        }

    if mean_brightness < UNDEREXPOSED_THRESHOLD:
        return {
            "is_acceptable": False,
            "reason": "Image is underexposed (too dark). Please upload a better-lit image.",
            "blur_score": round(laplacian_variance, 2),
            "brightness": round(mean_brightness, 2)
        }

    if mean_brightness > OVEREXPOSED_THRESHOLD:
        return {
            "is_acceptable": False,
            "reason": "Image is overexposed (too bright/washed out). Please upload a better-exposed image.",
            "blur_score": round(laplacian_variance, 2),
            "brightness": round(mean_brightness, 2)
        }

    # Passed all checks
    return {
        "is_acceptable": True,
        "reason": "Image quality is acceptable.",
        "blur_score": round(laplacian_variance, 2),
        "brightness": round(mean_brightness, 2)
    }


# Quick manual test — run this file directly to test on a sample image
if __name__ == "__main__":
    test_image_path = "test_image.jpg"  # change this to a real image path to test
    result = check_image_quality(test_image_path)
    print(result)
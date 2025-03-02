from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import face_recognition
import numpy as np
from pymongo import MongoClient
import os
from pathlib import Path
from scipy.spatial.distance import cosine
import cv2

# Create storage directories if they don't exist
STORAGE_DIR = Path("./storage")
USER_IMAGES_DIR = STORAGE_DIR / "users"
VENDOR_IMAGES_DIR = STORAGE_DIR / "vendors"
VERIFICATION_IMAGES_DIR = STORAGE_DIR / "verification"

# Ensure directories exist
USER_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
VENDOR_IMAGES_DIR.mkdir(parents=True, exist_ok=True)
VERIFICATION_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (Change this in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# 🔹 Connect to Local MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["blinkpay"]
users_collection = db["users"]
vendors_collection = db["vendors"]

### 📌 Helper Function: Process Face Image ###
def process_face_image(image_bytes):
    """Detects a face from an image and returns cropped face image with additional checks"""
    try:
        # Convert image bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Convert to RGB (face_recognition uses RGB)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Detect faces
        face_locations = face_recognition.face_locations(image_rgb)

        if len(face_locations) == 0:
            return None, "No faces detected"

        # Extract the first detected face
        top, right, bottom, left = face_locations[0]
        face_image = image_rgb[top:bottom, left:right]

        # Check face size (minimum size requirement)
        if (right - left) < 100 or (bottom - top) < 100:
            return None, "Face too small for reliable detection"

        # Check if the face is too blurry
        laplacian_var = cv2.Laplacian(cv2.cvtColor(face_image, cv2.COLOR_RGB2GRAY), cv2.CV_64F).var()
        if laplacian_var < 100:  # Increased threshold for blurriness
            return None, "Face image is too blurry"

        # Resize to standard dimensions for consistency
        face_image = cv2.resize(face_image, (150, 150))

        return face_image, "Success"
    except Exception as e:
        print(f"Error processing face image: {str(e)}")
        return None, f"Error processing image: {str(e)}"

### 📌 Helper Function: Extract Features ###
def extract_features(face_img):
    """Extract features from face image for comparison"""
    try:
        # Use face_recognition to get face encodings
        face_encoding = face_recognition.face_encodings(face_img)

        if len(face_encoding) == 0:
            return None

        return face_encoding[0]
    except Exception as e:
        print(f"Error extracting features: {str(e)}")
        return None

### 📌 Helper Function: Compare Face Features ###
def compare_face_features(image_path, face_data, threshold=0.83):  # Set threshold to 95%
    """Compare stored image with new face data and return if they match"""
    try:
        # Load stored image
        stored_img = face_recognition.load_image_file(image_path)
        stored_encoding = extract_features(stored_img)

        if stored_encoding is None:
            return False, 0

        # Extract features from the new face data
        new_encoding = extract_features(face_data)

        if new_encoding is None:
            return False, 0

        # Calculate cosine similarity (1 - cosine distance)
        similarity = 1 - cosine(stored_encoding, new_encoding)
        print(f"Similarity score: {similarity}")

        # Add extra checks for very high similarity (potential fraud)
        if similarity > 0.99:
            print("Warning: Extremely high similarity detected. Potential image reuse.")
            # Additional verification could be added here

        return similarity > threshold, similarity
    except Exception as e:
        print(f"Error comparing features: {str(e)}")
        return False, 0

### 📌 User Registration Route ###
@app.post("/register_user/")
async def register_user(
    image: UploadFile = File(...),
    name: str = Form(...),
    upi_id: str = Form(...)
):
    """Registers a user with a face scan & UPI ID"""
    try:
        # Read the uploaded image
        image_bytes = await image.read()

        # Process the face image
        face_img, message = process_face_image(image_bytes)

        if face_img is None:
            return JSONResponse(content={"success": False, "message": message}, status_code=400)

        # Create a unique filename
        image_id = f"user_{name.replace(' ', '_')}_{upi_id.replace('@', '_')}_{len(os.listdir(USER_IMAGES_DIR)) + 1}.jpg"
        image_path = str(USER_IMAGES_DIR / image_id)

        # Save the processed face image to disk
        cv2.imwrite(image_path, cv2.cvtColor(face_img, cv2.COLOR_RGB2BGR))

        # Store user data in MongoDB
        user = {
            "name": name,
            "upi_id": upi_id,
            "eye_data_path": image_path,
        }
        users_collection.insert_one(user)

        return {"success": True, "message": "User Registered Successfully"}
    except Exception as e:
        print(f"Error registering user: {str(e)}")
        return JSONResponse(content={"success": False, "message": f"Error: {str(e)}"}, status_code=500)

### 📌 User Eye Verification Route (now Face) ###
@app.post("/verify_eye/")
async def verify_eye(image: UploadFile = File(...)):
    """Verifies if the scanned face belongs to a registered user or vendor"""
    try:
        # Read the uploaded image
        image_bytes = await image.read()

        # Process the face image
        face_img, message = process_face_image(image_bytes)

        if face_img is None:
            return JSONResponse(content={"success": False, "message": message}, status_code=400)

        # Save the verification image
        verification_image_path = VERIFICATION_IMAGES_DIR / f"verification_{len(os.listdir(VERIFICATION_IMAGES_DIR)) + 1}.jpg"
        cv2.imwrite(str(verification_image_path), cv2.cvtColor(face_img, cv2.COLOR_RGB2BGR))

        # Store best match info
        best_match = {"role": None, "similarity": 0, "data": None}

        # Check users first
        for user_image_path in USER_IMAGES_DIR.iterdir():
            if user_image_path.is_file():
                is_match, similarity = compare_face_features(str(user_image_path), face_img)
                if is_match and similarity > best_match["similarity"]:
                    best_match = {
                        "role": "user",
                        "similarity": similarity,
                        "data": {"name": user_image_path.stem.split('_')[1].replace('_', ' '), "upi_id": user_image_path.stem.split('_')[2].replace('_', '@')}
                    }

        # Then check vendors
        for vendor_image_path in VENDOR_IMAGES_DIR.iterdir():
            if vendor_image_path.is_file():
                is_match, similarity = compare_face_features(str(vendor_image_path), face_img)
                if is_match and similarity > best_match["similarity"]:
                    best_match = {
                        "role": "vendor",
                        "similarity": similarity,
                        "data": {"name": vendor_image_path.stem.split('_')[1].replace('_', ' '), "upi_id": vendor_image_path.stem.split('_')[2].replace('_', '@')}
                    }

        # Return the best match if found
        if best_match["role"] is not None:
            return {
                "success": True,
                "message": f"{best_match['role'].capitalize()} Verified",
                "role": best_match["role"],
                "name": best_match["data"]["name"],
                "upi_id": best_match["data"]["upi_id"],
                "similarity_score": round(best_match["similarity"] * 100, 2)
            }

        return {"success": False, "message": "No matching user found"}
    except Exception as e:
        print(f"Error verifying face: {str(e)}")
        return JSONResponse(content={"success": False, "message": f"Error: {str(e)}"}, status_code=500)

### 📌 Vendor Registration Route ###
@app.post("/register_vendor/")
async def register_vendor(
    image: UploadFile = File(...),
    name: str = Form(...),
    upi_id: str = Form(...)
):
    """Registers a vendor with a face scan & UPI ID"""
    try:
        # Read the uploaded image
        image_bytes = await image.read()

        # Process the face image
        face_img, message = process_face_image(image_bytes)

        if face_img is None:
            return JSONResponse(content={"success": False, "message": message}, status_code=400)

        # Create a unique filename
        image_id = f"vendor_{name.replace(' ', '_')}_{upi_id.replace('@', '_')}_{len(os.listdir(VENDOR_IMAGES_DIR)) + 1}.jpg"
        image_path = str(VENDOR_IMAGES_DIR / image_id)

        # Save the processed face image to disk
        cv2.imwrite(image_path, cv2.cvtColor(face_img, cv2.COLOR_RGB2BGR))

        # Store vendor data in MongoDB
        vendor = {
            "name": name,
            "upi_id": upi_id,
            "eye_data_path": image_path,
        }
        vendors_collection.insert_one(vendor)

        return {"success": True, "message": "Vendor Registered Successfully"}
    except Exception as e:
        print(f"Error registering vendor: {str(e)}")
        return JSONResponse(content={"success": False, "message": f"Error: {str(e)}"}, status_code=500)

### ✅ Run the Server (Only for Local Testing) ###
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

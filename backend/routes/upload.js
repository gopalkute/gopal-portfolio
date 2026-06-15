const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const auth = require("../middleware/auth");
const Profile = require("../models/Profile");
const Project = require("../models/Project");
const router = express.Router();

// Use memory storage — file goes straight to Cloudinary, never touches disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// Helper — upload buffer to Cloudinary
function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    stream.end(buffer);
  });
}

// Helper — delete old file from Cloudinary by public_id
// Cloudinary URLs look like: https://res.cloudinary.com/<cloud>/image/upload/v.../portfolio/images/<publicId>
async function deleteFromCloudinary(url, resourceType = "image") {
  if (!url || !url.includes("cloudinary.com")) return;
  try {
    // Extract public_id — everything after /upload/v<version>/ or /upload/
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(\.[^.]+)?$/);
    if (match) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    }
  } catch (e) {
    /* ignore — don't block the upload */
  }
}

// ── POST /api/upload/avatar ───────────────────────────────────────────────────
router.post("/avatar", auth, upload.single("avatar"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(req.file.mimetype))
    return res.status(400).json({ message: "Only JPG, PNG, WEBP allowed" });

  try {
    // Delete old avatar from Cloudinary
    const profile = await Profile.findOne();
    if (profile?.avatar) await deleteFromCloudinary(profile.avatar);

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "portfolio/avatar",
      transformation: [
        {
          width: 400,
          height: 400,
          crop: "fill",
          gravity: "face",
          quality: "auto",
        },
      ],
    });

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error("Cloudinary avatar upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ── POST /api/upload/image ────────────────────────────────────────────────────
router.post("/image", auth, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(req.file.mimetype))
    return res
      .status(400)
      .json({ message: "Only JPG, PNG, WEBP, GIF allowed" });

  try {
    // Delete old project image from Cloudinary first
    if (req.body.projectId) {
      const project = await Project.findById(req.body.projectId);
      if (project?.image) await deleteFromCloudinary(project.image);
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "portfolio/projects",
      transformation: [
        { width: 800, height: 500, crop: "fill", quality: "auto" },
      ],
    });

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ── POST /api/upload/resume ───────────────────────────────────────────────────
router.post("/resume", auth, upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  if (req.file.mimetype !== "application/pdf")
    return res.status(400).json({ message: "Only PDF files allowed" });

  try {
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "portfolio/resume",
      resource_type: "raw",
      format: "pdf",
      public_id: `Gopal_Resume_Resume`, // unique name
    });

    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;

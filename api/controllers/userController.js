import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

// Ensure Cloudinary config is correctly loaded
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Get all users (for Admin Panel)
// @route   GET /api/v1/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select("name email role phone facebookUrl profileImage createdAt")
    .sort({ createdAt: -1 });

  res.status(200).json(users);
});

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Private (self or admin/manager/trainer)
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found." });
  res.status(200).json(user);
});

// @desc    Update user profile (image, password, phone, facebookUrl)
// @route   PUT /api/v1/users/:id/profile
// @access  Private (self or admin/manager/trainer)
export const updateUserProfile = asyncHandler(async (req, res) => {
  console.log("--- updateUserProfile called ---");
  console.log("Request Params ID:", req.params.id);
  console.log("Authenticated User ID:", req.user ? req.user._id : "N/A");
  console.log("Authenticated User Role:", req.user ? req.user.role : "N/A");
  console.log("Request Body Keys:", Object.keys(req.body)); // Log all keys received in the body

  const user = await User.findById(req.params.id);
  if (!user) {
    console.log("Error: User not found for ID:", req.params.id);
    return res.status(404).json({ error: "User not found." });
  }

  // Update basic profile fields
  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.facebookUrl !== undefined)
    user.facebookUrl = req.body.facebookUrl;
  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.email !== undefined) user.email = req.body.email;

  // --- Image Upload Logic ---
  if (req.body.profileImage) {
    console.log("profileImage field received in request body.");
    console.log("profileImage data length:", req.body.profileImage.length); // Check length of base64 string
    // Log first 100 characters of base64 to confirm it's not empty/malformed
    console.log(
      "profileImage snippet:",
      req.body.profileImage.substring(0, 100) + "..."
    );

    try {
      console.log("Attempting to upload image to Cloudinary...");
      const uploadResult = await cloudinary.uploader.upload(
        req.body.profileImage, // This expects a base64 string (data URI)
        {
          folder: "users", // Your Cloudinary folder
          public_id: `user_${user._id}`, // Unique ID for the image, overwrites if exists
          overwrite: true, // Overwrite existing image with the same public_id
          resource_type: "auto", // Let Cloudinary detect image type (e.g., 'image', 'video')
        }
      );
      user.profileImage = uploadResult.secure_url; // Store the secure URL from Cloudinary
      console.log(
        "Cloudinary upload successful. Secure URL:",
        uploadResult.secure_url
      );
    } catch (err) {
      console.error("Cloudinary image upload failed with error:", err); // Log the full error object
      // Provide more specific error messages to the frontend if possible
      let errorMessage = "Image upload failed.";
      if (err.http_code) {
        errorMessage += ` HTTP Status: ${err.http_code}.`;
      }
      if (err.message) {
        errorMessage += ` Details: ${err.message}.`;
      }
      if (err.error && err.error.message) {
        errorMessage += ` Cloudinary Error: ${err.error.message}.`;
      }
      return res.status(400).json({ error: errorMessage, details: err });
    }
  } else if (req.body.profileImage === null) {
    // This handles the case where the frontend explicitly sends null to clear the image
    user.profileImage = null;
    console.log("Profile image explicitly set to null (cleared by user).");
  } else {
    console.log(
      "profileImage field not present or empty (not null) in request body. Skipping image upload."
    );
  }

  // Password handling: This route should ideally not handle password changes.
  // The frontend has a separate route for this.
  if (req.body.password) {
    console.warn(
      "Warning: Password field received in main profile update. This should ideally be handled by the /password route."
    );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  await user.save(); // Save the updated user document to the database
  console.log("User profile saved successfully to MongoDB for ID:", user._id);
  console.log("--- updateUserProfile finished ---");
  res.status(200).json({ message: "Profile updated", user });
});

// --- ADMIN ONLY FUNCTIONS ---

// @desc    Update a user's role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (
    ![
      "ADMIN",
      "MANAGER",
      "MEMBER",
      "TRAINER",
      "Developer",
      "Teaching Assistant",
    ].includes(role)
  ) {
    return res.status(400).json({ error: "Invalid role specified." });
  }

  const user = await User.findById(req.params.id);
  if (user) {
    user.role = role;
    await user.save();
    res.json({ message: "User role updated successfully." });
  } else {
    res.status(404).json({ error: "User not found." });
  }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ message: "User deleted successfully." });
});

// @desc    Admin: Create a new user with all details and a default password
// @route   POST /api/v1/users
// @access  Private/Admin
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, facebookUrl, profileImage } =
    req.body;
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ error: "Name, email, password, and role are required." });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ error: "User already exists." });
  }
  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    facebookUrl,
    profileImage,
  });
  res.status(201).json({
    message: "User created successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    User: Change password
// @route   PUT /api/v1/users/:id/password
// @access  Private (self or admin)
export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found." });
  // Only self or admin can change password
  if (
    req.user.role !== "ADMIN" &&
    req.user._id.toString() !== user._id.toString()
  ) {
    return res.status(403).json({ error: "Not authorized." });
  }
  const { oldPassword, newPassword } = req.body;
  // If not admin, verify old password
  if (req.user.role !== "ADMIN") {
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Old password is incorrect." });
  }
  // Hash and save new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();
  res.status(200).json({ message: "Password updated successfully." });
});

// @desc    Admin: Update any user (all fields, including role)
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
export const adminUpdateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found." });

  // Only update fields if provided
  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.email !== undefined) user.email = req.body.email;
  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.facebookUrl !== undefined)
    user.facebookUrl = req.body.facebookUrl;
  if (req.body.profileImage !== undefined) {
    if (
      typeof req.body.profileImage === "string" &&
      req.body.profileImage.startsWith("data:image/")
    ) {
      // It's a base64 string, upload to Cloudinary
      try {
        console.log(
          "[adminUpdateUser] Attempting to upload image to Cloudinary..."
        );
        const uploadResult = await cloudinary.uploader.upload(
          req.body.profileImage,
          {
            folder: "users",
            public_id: `user_${user._id}`,
            overwrite: true,
            resource_type: "auto",
          }
        );
        user.profileImage = uploadResult.secure_url;
        console.log(
          "[adminUpdateUser] Cloudinary upload successful. Secure URL:",
          uploadResult.secure_url
        );
      } catch (err) {
        console.error(
          "[adminUpdateUser] Cloudinary image upload failed with error:",
          err
        );
        let errorMessage = "Image upload failed.";
        if (err.http_code) errorMessage += ` HTTP Status: ${err.http_code}.`;
        if (err.message) errorMessage += ` Details: ${err.message}.`;
        if (err.error && err.error.message)
          errorMessage += ` Cloudinary Error: ${err.error.message}.`;
        return res.status(400).json({ error: errorMessage, details: err });
      }
    } else if (
      typeof req.body.profileImage === "string" &&
      req.body.profileImage.startsWith("http")
    ) {
      // It's already a URL, just store it
      user.profileImage = req.body.profileImage;
    } else if (req.body.profileImage === null) {
      user.profileImage = null;
    } else {
      console.warn(
        "[adminUpdateUser] profileImage field present but not a valid base64 string or URL."
      );
    }
  }
  if (req.body.role !== undefined) {
    const allowedRoles = [
      "ADMIN",
      "MANAGER",
      "MEMBER",
      "TRAINER",
      "Developer",
      "Teaching Assistant",
    ];
    if (!allowedRoles.includes(req.body.role)) {
      return res.status(400).json({ error: "Invalid role specified." });
    }
    user.role = req.body.role;
  }
  await user.save();
  res.status(200).json({ message: "User updated", user });
});

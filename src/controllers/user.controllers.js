import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  if (
    [username, email, fullname, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists!");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  // The above can also be implemented using chaining like:
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar must be present!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar!");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  });

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!userCreated) {
    throw new ApiError(500, "Something went wrong while registering the user!");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, userCreated, "User Registered Successfully!"));
});

export default registerUser;

// STEPS TO REGISTER THE USER
// 1. get user details from the frontend
// 2. validation - not empty
// 3. check if user already exists: username, email
// 4. check for avatar as required and check for image(cover)
// 5. upload them to cloudinary, avatar
// 6. create user object - create entry in db
// 7. remove password and refresh token field from response
// 8. check for user creation
// 9. return response

import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized Request");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  // The jwt.verify() either gives a decoded object
  // or
  // Execution jumps to asyncHandler catch, it does not return 'null' or 'undefined'

  //   The below check is redundant because of above
  //   if (!decodedToken) {
  //     throw new ApiError(401, "Invalid Access Token!");
  //   }

  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Invalid Access Token!");
  }

  req.user = user;

  next();
});

// This method checks if user is logged in, and if he is, then we append the user info to the req

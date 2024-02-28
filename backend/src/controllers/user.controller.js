import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

// const registerUser=asyncHandler(async (req,res)=>{
//     res.status(500).json({
//         message:"code",
//
//     })
// })

const signup = asyncHandler(async (req, res) => {
  const { name, email,  password } =
    req.body;
  // let username=email;
  
  if (
    [name, email,password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [ { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with same username or email exists");
  }
 
  const user = await User.create({
    name,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while user registration");
  }else{
    // alert("usercreated");
    console.log(createdUser);
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});


const genrateAccestokenAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.genrateAccestoken();
    const refreshToken = user.genrateRefreshtoken();

    user.refreshToken = refreshToken;
    // now we added refreshToken but we have to save it soo

    await user.save({ validateBeforeSave: false }); //by this line we can save but every time we save
    // we need password to validate so {validateBeforeSave : false} it will skip validation

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error", error);
    throw new ApiError(
      500,
      "something went wrong while genrating acces Tokens and refresh Tokens"
    );
  }
};



const login = asyncHandler(async (req, res) => {
  // ask for user name and password,
  // check if user exists
  // take passwrod and send it to encripter and match with data base password
  // if match then allow user to log in
  // and give acces token

  // 1. req body => data
  // 2. username ,email
  // 3. find user
  // 4. acess token and refresh token
  // 5. send cookie

  const { email, username, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "username or email required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "user doesnot  exits");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "password invalid");
  }
  const { accessToken, refreshToken } = await genrateAccestokenAndRefreshTokens(
    user?._id
  );

  const logedinuser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    // while we send cookie we degine ootin
    // when we add this both option httpOnly,secure true then coookie is only modified by server not by front end
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: logedinuser,
          accessToken,
          refreshToken,
        },
        "user loggedin "
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  
    res.cookie("jwt","",{maxAge:0});
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
         
        },
        "user loggedout "
      )
    );

});
const refreshAcessToken = asyncHandler(async (req, res) => {
  try {
    const incommingRefreshToken =
      req.cookie.refreshToken || req.body.refreshToken;
    if (!incommingRefreshToken) {
      throw new ApiError(401, "unautoriserequest");
    }

    const decodedToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRTE
    );

    const user = await User.findById(decodedToken?.id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incommingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token is invalid or used");
    }
    const options = {
      httpOnly: true,
      // while we send cookie we degine ootin
      // when we add this both option httpOnly,secure true then coookie is only modified by server not by front end
      secure: true,
    };

    const { accessToken, newrefreshToken } =
      await genrateAccestokenAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("acessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "AcessToken refreshed ......"
        )
      );
  } catch (error) {
    throw new ApiResponse(401, error?.message || "INVALID REFRESH TOEKN");
  }

  try {
  } catch (error) {}
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  // if(!(newPassword===reenterPassword)){
  //   throw new ApiError(400,"new password and reentered password does not match");
  // }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "invalid old password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed ....."));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // const currentUser = User.id;
  return res
    .status(200)
    .josn(new ApiResponse(200, req.user, "current User featched"));
});

const UpdateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  // if we are updateing any files like photo then we should have different controllers for this
  if (!fullName || !email) {
    throw new ApiError(
      401,
      "give both email and fullName  (all field required)"
    );
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,
      },
    },
    { new: true } //this will return us updated user
  ).select("-password");
  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "account details updated (email and fullname ")
    );
});
const UpdateAvatar = asyncHandler(async (req, res) => {
  const avatarLocarpath = req.file?.path;
  if (!avatarLocarpath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocarpath);

  if (!avatar) {
    throw new ApiError(400, "problem in uploading avatar image on cloudinary ");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");
  //   if(avatarLocarpath){
  //     fs.unlinkSync(avatarLocarpath);
  // }

  return res
    .status(200)
    .json(new ApiResponse(200), user, "updated avarat successfully ");
});

const UpdateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalpath = req.file?.path;
  if (!avatarLocalpath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalpath);

  if (!coverImage) {
    throw new ApiError(400, "problem in uploading cover  image on cloudinary ");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");
  // if(coverImageLocalpath){
  //     fs.unlinkSync(coverImageLocalpath);
  // }

  return res
    .status(200)
    .json(new ApiResponse(200), user, "updated coverImage  successfully ");
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username?.trim()) {
    throw ApiError(400, "username is misssing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 0,
        subscribersCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (channel?.length) {
    throw ApiError(401, "channel does not exists ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "user chanel fatched succesfully"));
});

export {
  refreshAcessToken,
  changeCurrentPassword,
  getCurrentUser,
  UpdateAccountDetails,
  UpdateAvatar,
  UpdateCoverImage,
  getUserChannelProfile,
  signup,
  genrateAccestokenAndRefreshTokens,
  login,
  logout,
};

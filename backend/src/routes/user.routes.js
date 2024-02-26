import { Router } from "express";
import {  refreshAcessToken,signup,login,logout} from "../controllers/user.controller.js";

import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route('/signup').post(
    upload.fields([
    {
        name:"avatar",
        maxCount:1
    },

    {
        name:"coverImage",
        maxCount:1
    }

    ]),
    signup)

// router.route('/register').post(
//     upload.fields([
//     {
//         name:"avatar",
//         maxCount:1
//     },

//     {
//         name:"coverImage",
//         maxCount:1
//     }

//     ]),
//     registerUser)


router.route("/login").post(login);


// secured routes
router.route("/logout").post(logout);

router.route("./refresh-token").post(refreshAcessToken);



export default router



import { Router } from "express";
import multer from "multer";
import { signUp } from "../Controlers/AuthControler/SignUpControler.js";
import { loginAuth } from "../Controlers/AuthControler/LoginAuthControler.js";

const authRouter = Router();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

authRouter.post('/sign', upload.single('image'),signUp)
authRouter.post('/login',loginAuth)

export {authRouter}
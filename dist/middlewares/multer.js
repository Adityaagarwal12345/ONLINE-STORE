import multer from "multer";
import fs from "fs";
import { v4 as uuid } from 'uuid';
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        const id = uuid();
        const extName = file.originalname.split(".").pop();
        callback(null, `${id}.${extName}`);
    },
});
export const singleUpload = multer({ storage }).single("photo");

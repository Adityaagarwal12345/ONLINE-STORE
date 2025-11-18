import multer from "multer";
import fs from "fs";
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}
const storage = multer.diskStorage({

    destination(req, file, callback) {
        callback(null,"uploads");
    },
    filename(req,file,callback){
        callback(null,file.originalname);
    },


});

export const singleUpload = multer({storage}).single("photo");
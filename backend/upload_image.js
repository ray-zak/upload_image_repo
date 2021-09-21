import express from "express";
import dotenv from "dotenv"
import multer from "multer";
import AWS from 'aws-sdk'
import ImagesURLs from "./DB_models/image_urls.js";




dotenv.config()
export const router = express.Router()

let storage = multer.memoryStorage({
    destination: function(req, file, callback) {
        callback(null, '');
    }
});

let upload = multer({ storage: storage }).single('image');


router.post('/',upload, async(req, res)=>{
    const file = req.file;
    //console.log(file.buffer , file.originalname)
    //console.log(file)
    let s3 = new AWS.S3({
        accessKeyId: process.env.Access_Key_ID,
        secretAccessKey: process.env.Secret_Access_Key,
        BucketName: process.env.Bucket_Name
    })

    const params = {
        ACL: "public-read",
        Body: file.buffer,
        Bucket: process.env.Bucket_Name,
        Key: file.originalname
    }
     await s3.upload(params , (err, data)=>{
        if(err){
            console.log(err.message)
            console.log(params.Key , params.Bucket)
            return res.status(500).send(err)
        }

        console.log("success")
        return res.status(200).send(data)


    })

})


router.post("/saving_image_url" , async (req,res)=>{
   try{
       const url = req.body.url;
       console.log(url);
       const imageURL = new ImagesURLs({
           URL: url
       })
       await imageURL.save();
       res.send({imageURL})
   }
   catch(err){
       console.log(err.message)
   }

})

router.get("/get_all_images", async(req,res)=>{
   await ImagesURLs.find()
       .then(result=>{
           res.send(result)
       })
       .catch(err=>{
           res.status(500).send(err.message)
       })
})
export default router


















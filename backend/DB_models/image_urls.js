import mongoose from "mongoose";

const Schema  = mongoose.Schema;

const ImagesURLs = new Schema({
    URL: {type: String},

})
export default mongoose.model("ImagesURLs" , ImagesURLs)

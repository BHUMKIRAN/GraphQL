import mongoose from "mongoose";

const subjectSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    }
})

const subject = mongoose.model("Subject",subjectSchema);
export default subject

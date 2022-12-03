import mongoose from 'mongoose';

const uri = "mongodb+srv://Creditio:ETHIndiaCreditio@cluster0.iybbah2.mongodb.net/ETHIndia";

mongoose.connect(uri, (err) => {
    if(!err){
        console.log("Database Connected Successfully");
    }else{
        console.log("Error in connecting to database!");
    }
});

export default mongoose;
import * as mongoose from "mongoose";

const uri: string = "mongodb://127.0.0.1:27017/shop";

mongoose.connect(uri, { useFindAndModify: false });
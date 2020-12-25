import * as mongoose from "mongoose";

const uri: string = "mongodb://127.0.0.1:27017/mshop";

mongoose.connect(uri, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
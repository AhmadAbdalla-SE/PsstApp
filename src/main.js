
import cors from 'cors';
import express from 'express';
import { bootstrapDB } from './DB/connection.db.js';
import { ORIGINS, PORT } from './config.js';
import { globalErrorHandling } from './middleware/index.js';
import { authenticationController, messageController, userController } from './modules/index.js';
import helmet from 'helmet';
import { generateLimiter } from './common/utils/limiter.js';
import { requestController } from './modules/request/index.js';
import { conversationController } from './modules/conversation/index.js';
import morgan from 'morgan';

const app = express()
await bootstrapDB(app, PORT)

var corsOptions = {
  origin: function (origin, callback) {
    if (!ORIGINS.includes(origin)) {
        callback(new Error("Unauthorized origin"), {cause: {status:401}}, ORIGINS)
    }
    else {
        callback(null, ORIGINS)
    }
  }
}

app.set("trust proxy", true)
const limiter = generateLimiter({limit: 10})
app.use(helmet(), morgan("common"),limiter, cors(),express.json()) // remember to put back limiter before deployment
app.use("/assets", express.static("./assets"))
app.all("/", (req,res)=>res.status(200).send({message: "Welcome to BE API"}))

app.use("/auth",authenticationController)
app.use("/message", messageController)
app.use("/user", userController)
app.use("/request", requestController)
app.use("/conversation", conversationController)

app.all("/*dummy", (req,res)=> res.status(404).send({message: "Invalid Application Routing"}))

app.use(globalErrorHandling)




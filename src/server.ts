import express from "express"
import colors from "colors"
import cors, {CorsOptions} from "cors"
import morgan from "morgan"
import swaggerUI from "swagger-ui-express"
import swaggerSpec from "./config/swagger"

import router from "./router"
import db from "./config/db"

//Conectar a la base de datos
export async function connectDb() {
    try {
        await db.authenticate()
        db.sync()
        // console.log(colors.cyan.bold("Se ha conectado con la base de datos"))

    } catch (error) {
        // console.log(error)
        console.log(colors.bgRed.bold("Error al conectar con la base de datos "))
    }
}

connectDb()

// Instancia de express
const server = express()

// Permitir conexiones
const corsOptions : CorsOptions = {
    origin: function (origin, callback) {
        if(origin === process.env.FRONTEND_URL){
            callback(null,true)
        }else{
            callback(new Error("Error de CORS"), false)
        }
    }

}
server.use(cors(corsOptions))

// Leer datos de formulario
server.use(express.json())

server.use(morgan("dev"))

server.use("/api/products", router)

server.get("/api", (req, res) => {
    res.json({ msg: "Desde API" })


})

//Documentacion
server.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec))


export default server 
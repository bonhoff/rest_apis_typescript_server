import request from "supertest"
import server,{connectDb} from "../server"
import db from "../config/db"


describe('GET /api', () => {

    it('should send back a JSON response', async () => {
        const res = await request(server).get('/api')
        console.log(res)

        expect(res.status).toBe(200)
        expect(res.header["content-type"]).toMatch(/json/)
        expect(res.body.msg).toBe("Desde API")

        expect(res.status).not.toBe(404)
        expect(res.body.msg).not.toBe("desde api")

    })

})

jest.mock("../config/db.ts")

describe("coonectDB",() =>{
    it("should handle database connection error", async()=>{
        jest.spyOn(db, "authenticate").mockRejectedValueOnce(new Error("Error al conectar con la base de datos"))
        const consoleSpy = jest.spyOn(console, "log")
        await connectDb()

        expect(consoleSpy).toHaveBeenLastCalledWith(expect.stringContaining("Error al conectar con la base de datos"))

    })
})

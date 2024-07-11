import server from "../../server";
import request from "supertest"

describe("POST - /api/products", () => {

    it("should display validation errors", async () => {
        const res = await request(server).post('/api/products').send({})
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("errors")
        expect(res.body.errors).toHaveLength(4)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(2)
    })

    it("should validate that price is greater than 0", async () => {
        const res = await request(server).post('/api/products').send({
            name: "Teclado Logitech - Testing",
            price: 0
        })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("errors")
        expect(res.body.errors).toHaveLength(1)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(2)
    })

    it("should validate that price is number and greater than 0", async () => {
        const res = await request(server).post('/api/products').send({
            name: "Teclado Logitech - Testing",
            price: "hola"
        })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("errors")
        expect(res.body.errors).toHaveLength(2)

        expect(res.status).not.toBe(404)
        expect(res.body.errors).not.toHaveLength(4)
    })

    it("Should create a new product", async () => {
        const res = await request(server).post('/api/products').send({
            name: "Teclado Logitech - Test",
            price: 120
        })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty("data")

        expect(res.status).not.toBe(404)
        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty("errors")

    })

})

describe("GET - /api/products", () => {

    it("should check if api/products url exists", async () => {
        const res = await request(server).get("/api/products")
        expect(res.status).not.toBe(404)

    })
    it("GET a JSON responde with products", async () => {
        const res = await request(server).get("/api/products")
        expect(res.status).toBe(200)
        expect(res.headers["content-type"]).toMatch(/json/)
        expect(res.body).toHaveProperty("data")
        expect(res.body.data).toHaveLength(1)

        expect(res.status).not.toHaveProperty("errors")
    })
})

describe("GET /api/products/:id", () => {

    it("should return a 404 response for a non-existent product", async () => {
        const productId = 2000
        const res = await request(server).get(`/api/products/${productId}`)
        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty("error")
        expect(res.body.error).toBe("No se ha encontrado el producto")
    })

    it("should check a valid ID in the URL", async () => {
        const res = await request(server).get("/api/products/not-valid-url")
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("errors")
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe("ID no válido")
    })

    it("get a JSON response for a single product", async () => {
        const res = await request(server).get("/api/products/1")
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("data")
    })

})

describe("PUT /api/products/:id", () => {

    it("should check a valid ID in the URL", async () => {
        const res = await request(server).put("/api/products/not-valid-url").send({
            name: "Teclado Logitech - Actualizado",
            price: 300,
            availability: true,
        })
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("errors")
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].msg).toBe("ID no válido")
    })

    it("should display a validation error messages when updating a product", async () => {
        const res = await request(server).put("api/products/1").send({})

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("errors")
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(5)

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty("data")
    })

    it("should validate that the price is greater than 0", async () => {


        const res = await request(server).put("api/products/1").send({
            name: "Teclado Logitech - Actualizado",
            price: 0,
            availability: true,
        })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("errors")
        expect(res.body.errors).toBeTruthy()
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors.msg).toBe("El Precio debe ser mayor que 0")

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty("data")
    })

    it("should return a 404 response for a non-existent product", async () => {


        const res = await request(server).put("api/products/2000").send({
            name: "Teclado Logitech - Actualizado",
            price: 300,
            availability: true,
        })

        expect(res.status).toBe(400)
        expect(res.body.error).toBe("No se ha encontrado el producto")

        expect(res.status).not.toBe(200)
        expect(res.body).not.toHaveProperty("data")
    })

    it("should update an existing product with a valid data", async () => {

        const res = await request(server).put("api/products/1").send({
            name: "Teclado Logitech - Actualizado",
            price: 300,
            availability: true,
        })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("data")

        expect(res.status).not.toBe(400)
        expect(res.body).not.toHaveProperty("errors")
    })



})

describe("DELETE /api/products/:id", () => {
    it("should check a valid ID", async () => {
        const res = await request(server).delete("/api/products/not-valid")
        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty("errors")
        expect(res.body.errors[0].msg).toBe("ID no válido")
    })
    it("should return a 404 response for a non-existent product", async () => {
        const res = await request(server).delete("/api/products/2000")
        expect(res.status).toBe(404)
        expect(res.body.error).toBe("No se ha encontrado el producto")

        expect(res.status).not.toBe(200)
    })
    it("should delete a product", async () => {
        const res = await request(server).delete("/api/products/1")
        expect(res.status).toBe(200)
        expect(res.body).toBe("Producto Eliminado")

        expect(res.status).not.toBe(404)
        expect(res.status).not.toBe(400)
    })
})

describe("PATCH /api/products/:id", () => {
    
    it("should return a 404 response for a non-existing product", async() => {
        const res = await request(server).patch("api/products/2000")

        expect(res.status).toBe(404)
        expect(res.body.error).toBe("No se ha encontrado el producto")
        
        expect(res.body.status).not.toBe(200)
        expect(res.body).not.toHaveProperty("data")
    })
    
    it("should update the product availability", async() => {
        const res = await request(server).patch("api/products/1")

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("data")
        expect(res.body.data.availability).toBe(false)
        
        expect(res.body.status).not.toBe(400)
        expect(res.body).not.toHaveProperty("error")
    })
})
import { Router } from "express"
import { body, param } from "express-validator"
import { CreateProduct, deleteProduct, getProducts, getProductsByID, updateAvailability, updateProduct } from "./handlers/product"
import { handleInputErrors } from "./middleware"

const router = Router()

/**
 * @swagger
 * components:
 *      schemas:
 *          Product: 
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The Product ID
 *                      example: 1
 *                  name:
 *                      type: string
 *                      description: The Product Name
 *                      example: Monitor curvo de 27 pulgadas
 *                  price:
 *                      type: number
 *                      description: The Product Price
 *                      example: 300
 *                  availability:
 *                      type: boolean
 *                      description: The Product Availability
 *                      example: true
 */

/**
 * @swagger
 * /api/products:
 *     get:
 *      summary: Get a list of Products
 *      tags:
 *          - Products
 *      description: Return a list of products
 *      responses:
 *          200:
 *              description: Succesful Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Not Found
 *          400:
 *              description: Bad Request
 * 
 */
router.get("/",
    getProducts
)

/**
 * @swagger
 * /api/products/{id}:
 *     get:
 *      summary: Get a product by ID
 *      tags:
 *          - Products
 *      description: Return a product based on its unique ID
 *      parameters: 
 *        - in: path
 *          name: id
 *          description: The id of the product to retrieve
 *          required: true
 *          schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: Succesful Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Not Found
 *          400:
 *              description: Bad Request - Invalid ID
 * 
 */


router.get("/:id",
    param("id").isInt().withMessage("ID no válido"),
    handleInputErrors,
    getProductsByID
)

/**
 * @swagger
 * /api/products:
 *      post:
 *          summary: Creates a new product
 *          tags:
 *              - Products
 *          description: Returns a new record in the database
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object  
 *                          properties:
 *                              name: 
 *                                  type: string
 *                                  example: "Monitor curvo de 27 pulgadas"
 *                              price:
 *                                  type: number    
 *                                  example: 300
 *          responses:
 *              201:
 *                  description: Succesfull response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400: 
 *                  description: Bad Request - invalid input data
 * 
 */

router.post("/",
    // Validación
    body("name")
        .notEmpty().withMessage("Tienes que asignar un nombre al Producto"),
    body("price")
        .isNumeric().withMessage("El precio debe ser un número")
        .notEmpty().withMessage("Hay que asignar un precio al Producto")
        .custom((value) => value > 0).withMessage("El Precio debe ser mayor que 0"),
    handleInputErrors,
    CreateProduct
)

/**
 * @swagger
 * /api/products/{id}:
*      put:
*          summary: Update a product with user input
*          tags:
*              - Products
*          description: Returns the updated product
*          parameters: 
*            - in: path
*              name: id
*              description: The id of the product to retrieve
*              required: true
*              schema:
*                  type: integer    
*          
*          requestBody:
*                  required: true
*                  content:
*                      application/json:
*                          schema:
*                              type: object  
*                              properties:
*                                  name: 
*                                      type: string
*                                      example: "Monitor curvo de 27 pulgadas"
*                                  price:
*                                      type: number    
*                                      example: 300               
*          responses:
*               200:  
*                  description: Succesfull response
*                  content:
*                      application/json:
*                          schema:
*                              $ref: '#/components/schemas/Product'
*               400:  
*                  description: Bad Request - Invalid ID or Invalid input data
*               404:  
*                  description: Product Not Found
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
// Put realiza modificaciones totales, no edita solo un campo
router.put("/:id",
    // Validación
    body("name")
        .notEmpty().withMessage("Tienes que asignar un nombre al Producto"),
    body("price")
        .isNumeric().withMessage("El precio debe ser un número")
        .notEmpty().withMessage("Hay que asignar un precio al Producto")
        .custom((value) => value > 0).withMessage("El Precio debe ser mayor que 0"),
    body("availability")
        .isBoolean().withMessage("Valor no válido para la Disponibilidad"),
    handleInputErrors,
    updateProduct
)

/**
 * @swagger
 * /api/products/{id}:
 *      patch:
 *          summary: Update Product availability
 *          tags:
 *              - Products
 *          description: Returns the updated availability
 *          parameters: 
 *            - in: path
 *              name: id
 *              description: The id of the product to retrieve
 *              required: true
 *              schema:
 *                  type: integer
 *          responses:
 *              200:
 *                  description: Succesfull response
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/components/schemas/Product'
 *              400:    
 *                  description: Bad Request - Invalid ID
 *              404: 
 *                  description: Product Not Found   
 * 
 */

// Patch nos permite moficiaciones de un solo campo
router.patch("/:id",
    // Validación
    param("id").isInt().withMessage("ID no válido"),
    body("availability")
        .isBoolean().withMessage("Valor no válido para la Disponibilidad"),
    handleInputErrors,
    updateAvailability
)

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Delete a Product by a given ID
 *      tags:
 *          - Products
 *      description: return a confirmation message
 *      parameters:
 *        - in : path
 *          name: id
 *          description: The id of the product to delete
 *          required: true
 *          schema: 
 *              type: integer
 *      responses:
 *          200:
 *              description: Succesfull response
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: "Producto Eliminado"
 *          400:   
 *              description: Bad Request - Invalid ID
 *          404: 
 *              description: Product not Found
 *               
 *      
 * 
 * 
 * 
 * 
 * 
 * 
 */
router.delete("/:id",
    //Valiadción
    param("id").isInt().withMessage("ID no válido"),
    handleInputErrors,
    deleteProduct
)





export default router
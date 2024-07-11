import { Request, Response } from "express"
import Product from "../models/Product.model"

export const CreateProduct = async (req: Request, res: Response) => {

    try {
        const product = await Product.create(req.body)
        res.status(201).json({ data: product }) //201 es el código para "crear"
    } catch (error) {
        console.log(error)
    }

}

export const getProducts = async (req: Request, res: Response) => { //Req => Request || Res => Response

    try {

        const products = await Product.findAll({
            order: [
                ['id', 'ASC']
            ],
            attributes: { exclude: ["createdAt", "updatedAt"] }
        })
        res.json({ data: products })

    } catch (error) {
        console.log(error)
    }

}

export const getProductsByID = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if (!product) {
            res.status(404).json({
                error: "No se ha encontrado el producto"
            })
        }

        res.json({ data: product })

    } catch (error) {
        console.log(error)
    }

}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if (!product) {
            res.status(404).json({
                error: "No se ha encontrado el producto"
            })
        }

        // Actualizar
        await product.update(req.body)
        await product.save()

        res.json({ data: product })

    } catch (error) {
        console.log(error)
    }
}

export const updateAvailability = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const product = await Product.findByPk(id)

        if (!product) {
            res.status(404).json({
                error: "No se ha encontrado el producto"
            })
        }

        // Actualizar
        // await product.update(req.body)
        product.availability = !product.dataValues.availability
        await product.save()

        res.json({ data: product })

    } catch (error) {
        console.log(error)
    }
}

export const deleteProduct = async (req: Request, res: Response) => {

    const { id } = req.params
    const product = await Product.findByPk(id)

    if (!product) {
        res.status(404).json({
            error: "No se ha encontrado el producto"
        })
    }

    // Eliminar
    await product.destroy()
    res.json({ data: "Producto Eliminado" })

}
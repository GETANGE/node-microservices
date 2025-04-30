import express from "express"
import { readFileSync } from "fs";
import { APIError, asyncHandler } from "../middleware/errorHandler.js";

const router = express.Router()

const itemData = JSON.parse(readFileSync(new URL("../data-json/item-data.json", import.meta.url), "utf-8"));


router.get('/item', asyncHandler(async(req, res, next)=>{
    res.json({data: itemData})
}))

router.post('/item', asyncHandler(async(req, res, next)=>{
    if(!req.body.name){
        throw new APIError(`Item name is required`, 400)
    }

    const newItem = {
        id: itemData.length + 1,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock
    }

    itemData.push(newItem)

    res.status(201).json({
        status: true
    })
}))
export default router;
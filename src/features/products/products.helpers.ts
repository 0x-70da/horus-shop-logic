import type { Response } from "express";
import type { GetProductsQuery, ValidatedGetProductsQuery } from "./products.types.js";

export const validateGetProductsQuery = (query: GetProductsQuery, res: Response): ValidatedGetProductsQuery | Response => {
    try{

        const {category, subcategory, brand, minPrice, maxPrice, inStock, sortBy, sortOrder, page, limit } = query;
    
        if (page && (isNaN(parseInt(page)) || parseInt(page) < 1)) {
            throw new Error("Page must be a positive integer");
        }
    
        if (limit && (isNaN(parseInt(limit)) || parseInt(limit) < 1)) {
            throw new Error("Limit must be a positive integer");
        }
    
        if (minPrice && (isNaN(parseFloat(minPrice)) || parseFloat(minPrice) < 0)) {
            throw new Error("minPrice must be a valid positive number");
        }
    
        if (maxPrice && (isNaN(parseFloat(maxPrice)) || parseFloat(maxPrice) < 0) || (minPrice && maxPrice && parseFloat(maxPrice) < parseFloat(minPrice))) {
            throw new Error("maxPrice must be a valid positive number and greater than or equal to minPrice");
        }
    
        const validSortByValues = ["price", "newest", "popularity", "rating"];
        if (sortBy && !validSortByValues.includes(sortBy)) {
            throw new Error(`sortBy must be one of ${validSortByValues.join(", ")}`);
        }
    
        const validSortOrderValues = ["asc", "desc"];
        if (sortOrder && !validSortOrderValues.includes(sortOrder)) {
            throw new Error(`sortOrder must be one of ${validSortOrderValues.join(", ")}`);
        }

        if (inStock && !["true", "false"].includes(inStock.toLowerCase())) {
            throw new Error("inStock must be either 'true' or 'false'");
        }

        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? Math.min(parseInt(limit, 10), 50) : 20;
    
        return { ...query, page: pageNumber, limit: limitNumber };
    } catch (error) {
        return res.status(400).json({ success: false, message: (error as Error).message });
    }
}
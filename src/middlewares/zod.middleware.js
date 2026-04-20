import { ZodError } from "zod";
export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body); 
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            error.statusCode = 400;
            error.message = error.issues
                .map((issue) => issue.message)
                .join(", ");
        } else {
            error.statusCode = error.statusCode || 500;
        }
        
        next(error);
    }
};
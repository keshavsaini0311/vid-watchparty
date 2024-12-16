import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request) => {
    try {
        const encodedToken = request.cookies.get("token")?.value || "";
        
        const decodedToken = jwt.verify(encodedToken, process.env.token_secret);
        return decodedToken.id;
    } catch (error) {
        console.log((error.message));
    }
}
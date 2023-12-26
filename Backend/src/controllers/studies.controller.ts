import { Request, Response, NextFunction } from "express";
import { parseJwt } from "../utils/helper.util";
import { getStudies } from "../services/studies.service";
import ControllerError from "../errors/RegisterError.error";

export async function studiesController(req: Request,
    res: Response, next: NextFunction) {
    let token;
    if(req.headers.authorization){
        token = parseJwt(req.headers.authorization);
        if(!token)
        {
            next(new ControllerError({
                message: "Invalid token",
                code: 400
            }))
        }
    }
    let resp_studies = await getStudies(token?.username);
    if(resp_studies.ok)
    {
        res.json({studies_list: resp_studies.data});
        return;
    }
    if(typeof resp_studies.data === "string")
    {
        next(new ControllerError({
            message: resp_studies.data,
            code: 400
        }))
        return;
    }
    console.error("List of studies returned, but not valid");
    next(new ControllerError({
        message: "Invalid list of studies",
        code: 500
    }))
    
}
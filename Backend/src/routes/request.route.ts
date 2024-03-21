import { Router } from "express";
import { pat_make_request } from "../controllers/requests.controller";

const router = Router();

router.put('/', pat_make_request);

export default router;
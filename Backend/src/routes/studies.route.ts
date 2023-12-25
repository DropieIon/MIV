import { Router } from "express";
import { studiesController } from "../controllers/studies.controller";
const router = Router();

router.post('/', studiesController);

export default router;
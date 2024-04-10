import { Router } from "express";
import { conDetailsController } from "../../controllers/account_data/details.controller";
const router = Router();

router.put('/', conDetailsController);

export default router;
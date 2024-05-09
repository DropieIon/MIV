import { Router } from "express";
import { conDetailsController, conGetPfp } from "../../controllers/account_data/details.controller";

const router = Router();

router.put('/', conDetailsController);
router.post('/pfp', conGetPfp);

export default router;
import { Router } from "express";
import { conDetailsController, conGetPfp, conGetPfpsStudy } from "../../controllers/account_data/details.controller";

const router = Router();

router.put('/', conDetailsController);
router.post('/pfp', conGetPfp);
router.post('/study_pfps', conGetPfpsStudy);

export default router;
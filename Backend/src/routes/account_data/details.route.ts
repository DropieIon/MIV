import { Router } from "express";
import { conPostDetailsController, conGetPfp, conGetPfpsStudy, conGetDetailsController, conUpdateDetailsController } from "../../controllers/account_data/details.controller";

const router = Router();

router.get('/', conGetDetailsController);
router.post('/', conPostDetailsController);
router.put('/', conUpdateDetailsController);
router.post('/pfp', conGetPfp);
router.post('/study_pfps', conGetPfpsStudy);

export default router;
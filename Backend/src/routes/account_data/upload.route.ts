import { Router } from "express";
import { conAllowUnlim4h } from "../../controllers/account_data/upload.controller";
const router = Router();

router.put('/allowUnlim', conAllowUnlim4h);

export default router;
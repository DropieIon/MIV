import { Router } from "express";
import { conDemotePat, conPromotePat } from "../../controllers/account_data/admin.controller";
const router = Router();

router.put('/promote', conPromotePat);
router.put('/demote', conDemotePat);

export default router;
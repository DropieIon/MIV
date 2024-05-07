import { Router } from "express";
import { conAssignStudy } from "../../controllers/account_data/studies.controller";

const router = Router();

router.put('/assign', conAssignStudy);

export default router;
import { Router } from "express";
import { conAssignStudy, conDeleteStudy, conUnassignStudy } from "../../controllers/account_data/studies.controller";

const router = Router();

router.put('/assign', conAssignStudy);
router.put('/unassign', conUnassignStudy);
router.delete('/', conDeleteStudy);

export default router;
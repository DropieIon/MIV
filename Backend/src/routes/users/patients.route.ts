import { Router } from "express";
import { conPatAll, conPatAssigned } from "../../controllers/users/patients.controller"
import { conDocAll } from "../../controllers/users/doctors.controller";

const router = Router();

router.get('/patients', conPatAssigned);
router.get('/all_patients', conPatAll);
router.get('/all_doctors', conDocAll);

export default router;
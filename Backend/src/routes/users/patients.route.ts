import { Router } from "express";
import { conPatAll, conPatAssigned } from "../../controllers/users/patients.controller"
import { conDocAll, conMyDocs } from "../../controllers/users/doctors.controller";

const router = Router();

router.get('/patients', conPatAssigned);
router.get('/all_patients', conPatAll);
router.get('/all_doctors', conDocAll);
router.get('/my_doctors', conMyDocs);

export default router;
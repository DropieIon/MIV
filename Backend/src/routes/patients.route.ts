import { Router } from "express";
import { has_completedController, patientsController } from "../controllers/patients.controller";
const router = Router();

router.post('/', patientsController);
router.get('/has_completed', has_completedController);

export default router;
import { Router } from "express";
import { get_personal_requestsController } from "../controllers/personal_requests.controller";

const router = Router();

router.get('/', get_personal_requestsController);

export default router;
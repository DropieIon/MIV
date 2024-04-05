import { Router } from "express";
import { ans_request, pat_make_request } from "../../controllers/account_data/requests.controller";

const router = Router();

router.put('/', pat_make_request);
router.put('/accept', ans_request);
router.put('/decline', ans_request);
router.put('/assign', ans_request);

export default router;
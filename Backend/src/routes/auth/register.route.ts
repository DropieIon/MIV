import { Router } from "express";
import { registerController, registerUUID } from "../../controllers/auth/register.controller";
const router = Router();

router.post('/', registerController);
router.get('/:uuid', registerUUID)

export default router;
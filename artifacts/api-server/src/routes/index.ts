import { Router, type IRouter } from "express";
import healthRouter from "./health";
import paperRouter from "./paper";

const router: IRouter = Router();

router.use(healthRouter);
router.use(paperRouter);

export default router;

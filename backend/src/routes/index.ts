import express, { Router } from "express";

const router: Router = Router();





router.get(["/", "/health"], (req: express.Request, res: express.Response) => {
  res.json({ status: "ok" });
});

export default router;

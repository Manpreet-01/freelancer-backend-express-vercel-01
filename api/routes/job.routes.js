import { Router } from "express";
import { createJob, deleteJob, getAllJobs, updateJob } from "../controller/job.controller.js";
import { forClientsOnly, forOwnerOnly } from "../middlewares/job.middleware.js";

const router = Router();

router.route("/create").post(forClientsOnly, createJob);
router.route("/update").put(forClientsOnly, forOwnerOnly, updateJob);
router.route("/delete").delete(forClientsOnly, forOwnerOnly, deleteJob);


// admin routes
router.route("/get-all").get(getAllJobs);


export { router as jobRouter };

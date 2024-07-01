import { Router } from "express";
import { createJob, deleteJob, getAllJobs, getClientJobs, getJobById, updateJob } from "../controller/job.controller.js";
import { forClientsOnly, forOwnerOnly } from "../middlewares/job.middleware.js";

const router = Router();

router.route("/create").post(forClientsOnly, createJob);
router.route("/update").put(forClientsOnly, forOwnerOnly, updateJob);
router.route("/delete").delete(forClientsOnly, forOwnerOnly, deleteJob);



//protected routes
router.route("/client/get-all").get(getClientJobs);

// admin routes
router.route("/get-all").get(getAllJobs);
router.route(["/get", "/get/:id"]).get(getJobById);


export { router as jobRouter };

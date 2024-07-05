import { Router } from "express";
import { createJob, deleteJob, getAllJobs, getClientJobs, getJobById, toggleJobIsSaved, updateJob } from "../controller/job.controller.js";
import { forClientsOnly, forFreelancersOnly, forJobOwnerOnly } from "../middlewares/job.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//protected routes for clients only
router.route("/create").post(verifyJWT, forClientsOnly, createJob);
router.route("/update").put(verifyJWT, forClientsOnly, forJobOwnerOnly, updateJob);
router.route("/delete").delete(verifyJWT, forClientsOnly, forJobOwnerOnly, deleteJob);
router.route("/client/get-all").get(verifyJWT, forClientsOnly, getClientJobs);

//protected routes for freelancers only
router.route("/get-all").get(verifyJWT, forFreelancersOnly, getAllJobs);
router.route("/save/toggle").put(verifyJWT, forFreelancersOnly, toggleJobIsSaved);

//protected routes for both freelancers and clients only
router.route(["/get", "/get/:id"]).get(verifyJWT, getJobById);


export { router as jobRouter };

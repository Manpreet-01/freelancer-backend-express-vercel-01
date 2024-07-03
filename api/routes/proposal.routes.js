import { Router } from "express";
import { forClientsOnly, forFreelancersOnly } from "../middlewares/job.middleware.js";
import { createProposal, getAllProposals, updateProposals } from "../controller/proposal.controller.js";


const router = Router();


router.route("/create").post(forFreelancersOnly, createProposal);
router.route("/update").post(forFreelancersOnly, updateProposals);
router.route("/get-all").get(forFreelancersOnly, getAllProposals);


export { router as proposalRouter };
import { Router } from "express";
import { forClientsOnly, forFreelancersOnly } from "../middlewares/job.middleware.js";
import { createProposal, deleteProposal, getAllProposals, getProposal, updateProposals } from "../controller/proposal.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.use(verifyJWT);

router.route("/create").post(forFreelancersOnly, createProposal);
router.route("/update").post(forFreelancersOnly, updateProposals);
router.route("/delete").delete(forFreelancersOnly, deleteProposal);
router.route("/get").get(forFreelancersOnly, getProposal);
router.route("/get-all").get(forFreelancersOnly, getAllProposals);

export { router as proposalRouter };
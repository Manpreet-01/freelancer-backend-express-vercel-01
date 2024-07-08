import { Router } from "express";
import { forClientsOnly, forFreelancersOnly } from "../middlewares/job.middleware.js";
import { acceptOrRejectProposal, createProposal, deleteProposal, getAllProposals, getProposal, updateProposals } from "../controller/proposal.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.use(verifyJWT);

// for freelancers only
router.route("/create").post(forFreelancersOnly, createProposal);
router.route("/update").post(forFreelancersOnly, updateProposals);
router.route("/delete").delete(forFreelancersOnly, deleteProposal);
router.route("/get").get(forFreelancersOnly, getProposal);
router.route("/get-all").get(forFreelancersOnly, getAllProposals);

// for clients only
router.route("/toggle-status/:proposalId").put(forClientsOnly, acceptOrRejectProposal);


export { router as proposalRouter };
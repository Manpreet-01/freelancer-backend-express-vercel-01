import { Router } from "express";
import { forClientsOnly, forFreelancersOnly, forJobOwnerOnly } from "../middlewares/job.middleware.js";
import { acceptOrRejectProposal, cancelProposalWithdrawn, createProposal, deleteAllProposals, deleteProposal, getAllProposals, getAllProposalsOfJob, getProposal, updateProposals, withdrawProposal } from "../controller/proposal.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.use(verifyJWT);

// for freelancers only
// TODO: add validation: if job is cancelled then throw error on create, update, withdraw, get proposals
router.route("/create").post(forFreelancersOnly, createProposal);
router.route("/update").post(forFreelancersOnly, updateProposals);
router.route("/withdraw").delete(forFreelancersOnly, withdrawProposal);
router.route("/get").get(forFreelancersOnly, getProposal);
router.route("/get-all").get(forFreelancersOnly, getAllProposals);

// for clients only
router.route("/toggle-status/:proposalId").put(forClientsOnly, forJobOwnerOnly, acceptOrRejectProposal);
router.route("/get-all/:jobId").get(forClientsOnly, forJobOwnerOnly, getAllProposalsOfJob);

//   TODO: only admin should allowed
router.route("/delete/admin").delete(deleteProposal);
router.route("/delete-all/admin").delete(deleteAllProposals);
router.route("/withdraw/cancel/admin").put(forFreelancersOnly, cancelProposalWithdrawn);

export { router as proposalRouter };
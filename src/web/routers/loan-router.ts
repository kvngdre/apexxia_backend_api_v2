import { Router } from "express";
import { container } from "tsyringe";
import { LoanController } from "@web/controllers";

export const loanRouter = Router();
const loanController = container.resolve(LoanController);

loanRouter.post("/", loanController.createLoan);
loanRouter.get("/", loanController.getLoans);
loanRouter.get("/:loanId", loanController.getLoanById);
// loanRouter.patch("/:loanId", loanController.updateLoan);
// loanRouter.delete("/:loanId", loanController.deleteLoan);

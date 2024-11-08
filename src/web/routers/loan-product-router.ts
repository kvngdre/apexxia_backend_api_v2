import { Router } from "express";
import { container } from "tsyringe";
import { LoanProductController } from "@web/controllers";

export const loanProductRouter = Router();
const loanProductController = container.resolve(LoanProductController);

loanProductRouter.post("/", loanProductController.createLoanProduct);
loanProductRouter.get("/", loanProductController.getLoanProducts);
loanProductRouter.get("/:loanProductId", loanProductController.getLoanProductById);
loanProductRouter.patch("/:loanProductId", loanProductController.updateLoanProduct);
loanProductRouter.delete("/:loanProductId", loanProductController.deleteLoanProduct);

import { Router } from "express";
import { container } from "tsyringe";
import { CustomerController } from "@web/controllers";

export const customerRouter = Router();
const customerController = container.resolve(CustomerController);

customerRouter.get("/", customerController.getCustomers);
customerRouter.post("/", customerController.createCustomer);
customerRouter.delete("/:customerId", customerController.deleteCustomer);

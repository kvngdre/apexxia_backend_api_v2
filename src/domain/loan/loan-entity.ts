import { HydratedDocument, Model, Schema, Types } from "mongoose";
import { container } from "tsyringe";
import { Entity } from "@shared-kernel/entity";
import { Lender } from "@domain/lender";
import { Customer } from "@domain/customer";
import { LoanProduct } from "@domain/loan-product";
import { LoanStatus } from "./loan-status-enum";
import { AuditTrail, IAuditTrailRepository } from "@domain/audit-trail";
import { AuditTrailAction } from "@domain/audit-trail/audit-trail-action-enum";
import { LoanExceptions } from "./loan-exceptions";
import { User } from "@domain/user";

export class Loan extends Entity {
  public static readonly collectionName = "Loan";

  public static readonly schema = new Schema<Loan, LoanModel, ILoanMethods>(
    {
      customerId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: Customer.collectionName,
        index: true
      },

      lenderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: Lender.collectionName
      },

      loanProductId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: LoanProduct.collectionName
      },

      parentLoanId: {
        type: Schema.Types.ObjectId,
        ref: LoanProduct.collectionName,
        default: null
      },

      amountRequested: {
        type: Number,
        required: true
      },

      amountRecommended: {
        type: Number,
        default: function (this: Loan) {
          return this.amountRequested;
        }
      },

      tenureInMonthsRequested: {
        type: Number,
        required: true
      },

      tenureInMonthsRecommended: {
        type: Number,
        default: function (this: Loan) {
          return this.tenureInMonthsRequested;
        }
      },

      status: {
        type: String,
        enum: LoanStatus,
        default: LoanStatus.NEW
      },

      interestRateInPercentage: {
        type: Number,
        required: true
      },

      isTopUp: {
        type: Boolean,
        default: false
      },

      //   repaymentSchedule: [
      //     {
      //       dueDate: { type: Date, required: true },
      //       amountDue: { type: Number, required: true },
      //       amountPaid: { type: Number, default: 0 },
      //       status: {
      //         type: String,
      //         enum: ["paid", "pending", "late"],
      //         default: "pending",
      //       },
      //     },
      //   ],

      analysedBy: {
        type: Schema.Types.ObjectId,
        ref: User.collectionName,
        default: null
      },

      analysedAt: {
        type: Date,
        default: null
      },

      analysisNotes: {
        type: String,
        default: null
      },

      createdAt: Date,

      updatedAt: Date
    },
    { timestamps: true }
  );

  constructor(
    public customerId: Types.ObjectId | string,
    public lenderId: Types.ObjectId | string,
    public loanProductId: Types.ObjectId | string,
    public amountRequested: number,
    public tenureInMonthsRequested: number,
    public interestRateInPercentage: number,
    public customerIncome: number
  ) {
    super();
    this.amountRecommended = this.amountRequested;
    this.tenureInMonthsRecommended = tenureInMonthsRequested;
  }

  public amountRecommended: number;
  public tenureInMonthsRecommended: number;
  public repaymentStartDate: Date;
  public repaymentEndDate: Date;
  public repaymentAmount: number;
  public totalRepaymentAmount: number;
  public percentageDTI: number;
  public status: LoanStatus = LoanStatus.NEW;
  public parentLoanId: Types.ObjectId | null = null;
  public isTopUp: boolean = false;
  public auditTrail: AuditTrail[] = [];
  public analysedBy: Types.ObjectId | string | null = null;
  public analysedAt: Date | null = null;
  public analysisNotes: string | null = null;
  public _doc: Loan;
  public customer?: Customer;
  public lender?: Lender;
  public loanProduct?: LoanProduct;
}

Loan.schema.virtual("repaymentAmount").get(function (this: Loan) {
  const value1 = this.amountRecommended * (this.interestRateInPercentage / 100);
  const value2 = this.amountRecommended / this.tenureInMonthsRecommended;
  const repayment = value1 + value2;

  // Rounding to two decimal places
  return Math.round(repayment * 100) / 100;
});

Loan.schema.virtual("totalRepaymentAmount").get(function (this: Loan) {
  const totalRepayment = this.repaymentAmount * this.tenureInMonthsRecommended;

  // Rounding to two decimal places
  return Math.round(totalRepayment * 100) / 100;
});

Loan.schema.virtual("percentageDTI").get(function (this: Loan) {
  const totalRepayment = this.repaymentAmount * this.tenureInMonthsRecommended;

  // Rounding to two decimal places
  return Math.round(totalRepayment * 100) / 100;
});

Loan.schema.virtual("auditTrail", {
  ref: AuditTrail.collectionName,
  localField: "_id",
  foreignField: "entityId",
  options: {
    sort: { timestamp: -1 },
    limit: 5
  }
});

Loan.schema.methods.checkLoanProductCompliance = function (this: Loan, loanProduct: LoanProduct) {
  const exceptions = [];

  // Validating the RECOMMENDED loan amount
  if (this.amountRecommended < loanProduct.minLoanAmount) {
    exceptions.push(LoanExceptions.LoanAmountBelowMinimum(loanProduct.minLoanAmount));
  } else if (this.amountRecommended > loanProduct.maxLoanAmount) {
    exceptions.push(LoanExceptions.LoanAmountExceedsMaximum(loanProduct.maxLoanAmount));
  }

  // Validating the RECOMMENDED loan tenure
  if (this.tenureInMonthsRecommended < loanProduct.minTenureInMonths) {
    exceptions.push(LoanExceptions.LoanTenureBelowMinimum(loanProduct.minTenureInMonths));
  } else if (this.tenureInMonthsRecommended > loanProduct.maxTenureInMonths) {
    exceptions.push(LoanExceptions.LoanTenureExceedsMaximum(loanProduct.maxTenureInMonths));
  }

  // Validating the D.T.I
  if (this.percentageDTI > loanProduct.maxDTIInPercentage) {
    exceptions.push(LoanExceptions.DTIGreaterThanMaximum(loanProduct.maxDTIInPercentage));
  }

  return exceptions;
};

Loan.schema.post("updateOne", { document: false, query: true }, async function () {
  const auditTrailRepository: IAuditTrailRepository = container.resolve("AuditTrailRepository");

  const auditTrailContext = this.get("auditTrailContext");
  if (!auditTrailContext) {
    throw new Error("Missing audit trail context");
  }

  const changes = this.getUpdate();

  await auditTrailRepository.insert(
    auditTrailContext.tenantId,
    new AuditTrail(
      this.getQuery()._id,
      Loan.collectionName,
      AuditTrailAction.UPDATED,
      auditTrailContext.performedBy,
      null,
      changes
    )
  );
});

// Loan.schema.methods.checkLoanProductCompliance = function (
//   this: LoanProduct,
//   customer: Customer,
//   loanProduct: LoanProduct
// ) {
//   const exceptions = [];

//   // Validating the RECOMMENDED loan amount
//   if (loan.amountRecommended < this.minLoanAmount) {
//     exceptions.push(LoanExceptions.LoanAmountBelowMinimum(this.minLoanAmount));
//   } else if (loan.amountRecommended > this.maxLoanAmount) {
//     exceptions.push(LoanExceptions.LoanAmountExceedsMaximum(this.maxLoanAmount));
//   }

//   // Validating the RECOMMENDED loan tenure
//   if (loan.tenureInMonthsRecommended < this.minTenureInMonths) {
//     exceptions.push(LoanExceptions.LoanTenureBelowMinimum(this.minTenureInMonths));
//   } else if (loan.tenureInMonthsRecommended > this.maxTenureInMonths) {
//     exceptions.push(LoanExceptions.LoanTenureExceedsMaximum(this.maxTenureInMonths));
//   }

//   // Validating the D.T.I
//   if (loan.percentageDTI > this.maxDTIInPercentage) {
//     exceptions.push(LoanExceptions.DTIGreaterThanMaximum(this.maxDTIInPercentage));
//   }

//   // Validating Customer Income
//   if (customer.income < this.minIncome) {
//     exceptions.push(CustomerExceptions.IncomeBelowMinimum(this.minIncome));
//   } else if (customer.income > this.maxIncome) {
//     exceptions.push(CustomerExceptions.IncomeExceedsMaximum(this.maxIncome));
//   }

//   return exceptions;
// };

// // Pre-save hook to create audit trail when a loan doc is created or modified
// Loan.schema.post("updateOne", { document: false, query: true }, async function (next) {
//   const auditTrailRepository: IAuditTrailRepository = container.resolve("AuditTrailRepository");

//   const auditTrailContext = this.get("auditTrailContext");
//   console.log(auditTrailContext);
// if (!auditTrailContext) {
//   throw new Error("Missing audit trail context");
// }

// const isStatusModified = this.modifiedPaths().includes("status");
// const changes = {};
// console.log(this.directModifiedPaths());
// for (const field of this.modifiedPaths()) {
//   console.log({ field });
//   //@ts-expect-error string indexer
//   changes[field] = this[field];
// }
// const originalDoc = await this.findOne(this.getQuery());
//   console.log({ this: this });
//   console.log(this.getUpdate());

//   console.log(changes);

// await auditTrailRepository.insert(
//   auditTrailContext.tenantId,
//   new AuditTrail(
//     this._id,
//     Loan.collectionName,
//     isStatusModified ? AuditTrailAction.STATUS_CHANGED : AuditTrailAction.UPDATED,
//     auditTrailContext.performedBy,
//     this._doc,
//     this.toObject()
//   )
// );

// next();
// });

// Ensure virtual fields are included in JSON output
Loan.schema.set("toJSON", { virtuals: true });
Loan.schema.set("toObject", { virtuals: true });

export type HydratedLoanDocument = HydratedDocument<Loan, ILoanMethods>;

export interface ILoanMethods {
  checkLoanProductCompliance(this: Loan, loanProduct: LoanProduct): LoanExceptions[];
}

export type LoanModel = Model<Loan, object, ILoanMethods>;

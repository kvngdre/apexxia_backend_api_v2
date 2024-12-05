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
import { Exception } from "@shared-kernel/exception";

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
    public interestRateInPercentage: number
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
  public status: LoanStatus = LoanStatus.NEW;
  public parentLoanId: Types.ObjectId | null = null;
  public isTopUp: boolean = false;
  public auditTrail: AuditTrail[] = [];
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

Loan.schema.virtual("auditTrail", {
  ref: AuditTrail.collectionName,
  localField: "_id",
  foreignField: "entityId",
  options: {
    sort: { timestamp: -1 },
    limit: 5
  }
});

Loan.schema.methods.validateAgainstLoanProductRules = function (
  this: Loan,
  loanProduct: LoanProduct
) {
  if (this.amountRecommended > loanProduct.maxLoanAmount) {
    return LoanExceptions.LoanAmountExceedsMaximum(loanProduct.maxLoanAmount);
  }

  return null;
};

// // Pre-save hook to create audit trail when a loan doc is created or modified
// Loan.schema.pre("save", async function (next) {
//   const auditTrailRepository: IAuditTrailRepository = container.resolve("AuditTrailRepository");

//   const auditTrailContext = this.get("auditTrailContext");
//   console.log(auditTrailContext);
//   if (!auditTrailContext) {
//     throw new Error("Missing audit trail context");
//   }

//   await auditTrailRepository.insert(
//     auditTrailContext.tenantId,
//     new AuditTrail(
//       this._id,
//       Loan.collectionName,
//       this.isNew ? AuditTrailAction.CREATED : AuditTrailAction.UPDATED,
//       auditTrailContext.performedBy,
//       this.isNew ? null : this._doc,
//       this.isNew ? null : this.toObject()
//     )
//   );

//   next();
// });

// // Pre-save hook to create audit trail when a loan doc is created or modified
// Loan.schema.post("updateOne", { document: false, query: true }, async function (next) {
//   const auditTrailRepository: IAuditTrailRepository = container.resolve("AuditTrailRepository");

//   const auditTrailContext = this.get("auditTrailContext");
//   console.log(auditTrailContext);
//   // if (!auditTrailContext) {
//   //   throw new Error("Missing audit trail context");
//   // }

//   // const isStatusModified = this.modifiedPaths().includes("status");
//   const changes = {};
//   // console.log(this.directModifiedPaths());
//   // for (const field of this.modifiedPaths()) {
//   //   console.log({ field });
//   //   //@ts-expect-error string indexer
//   //   changes[field] = this[field];
//   // }
//   // const originalDoc = await this.findOne(this.getQuery());
//   console.log({ this: this });
//   console.log(this.getUpdate());

//   console.log(changes);

//   // await auditTrailRepository.insert(
//   //   auditTrailContext.tenantId,
//   //   new AuditTrail(
//   //     this._id,
//   //     Loan.collectionName,
//   //     isStatusModified ? AuditTrailAction.STATUS_CHANGED : AuditTrailAction.UPDATED,
//   //     auditTrailContext.performedBy,
//   //     this._doc,
//   //     this.toObject()
//   //   )
//   // );

//   // next();
// });

// Ensure virtual fields are included in JSON output
Loan.schema.set("toJSON", { virtuals: true });
Loan.schema.set("toObject", { virtuals: true });

export type HydratedLoanDocument = HydratedDocument<Loan, ILoanMethods>;

export interface ILoanMethods {
  validateAgainstLoanProductRules(loanProduct: LoanProduct): Exception | null;
}

export type LoanModel = Model<Loan, object, ILoanMethods>;

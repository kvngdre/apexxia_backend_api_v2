import joi from "joi";
import { singleton } from "tsyringe";
import {
  AbstractValidator,
  bankAccountNumberRule,
  bvnRule,
  emailRule,
  genderRule,
  idExpirationRule,
  idNumberRule,
  idTypeRule,
  incomeRule,
  latitudeRule,
  longitudeRule,
  maritalStatusRule,
  nameRule,
  objectIdStringRule,
  personNameRule,
  phoneNumberRule,
  relationshipRule,
  ValidationResultType
} from "@shared-kernel/validation";
import { CreateCustomerCommand } from "./create-customer-command";
import { ageExtension, JoiDateExtend } from "@shared-kernel/validation/extensions/date-extension";

const extendedJoi: JoiDateExtend = joi.extend(ageExtension);

@singleton()
export class CreateCustomerCommandValidator extends AbstractValidator<CreateCustomerCommand> {
  public validate(request: CreateCustomerCommand): ValidationResultType<CreateCustomerCommand> {
    const schema = joi.object<CreateCustomerCommand>({
      tenant: extendedJoi.any(),
      lenderId: objectIdStringRule,
      firstName: personNameRule.label("First name").required(),
      middleName: personNameRule.label("Middle name").allow(null).required(),
      lastName: personNameRule.label("Last name").required(),
      gender: genderRule.required(),
      dateOfBirth: extendedJoi
        .date()
        .label("Date of birth")
        .iso()
        .isAbove18()
        .isBelow60()
        .required(),
      residentialAddress: extendedJoi
        .object({
          addressLine1: extendedJoi
            .string()
            .label("Residential address line 1")
            .trim()
            .max(256)
            .required(),
          addressLine2: extendedJoi
            .string()
            .label("Residential address line 2")
            .trim()
            .max(256)
            .allow(null)
            .default(null)
            .optional(),
          city: extendedJoi.string().label("Residential address city").trim().max(256).required(),
          state: extendedJoi.string().label("Residential address state").trim().max(50).required(),
          latitude: latitudeRule.label("Residential address latitude").required(),
          longitude: longitudeRule.label("Residential address longitude").required()
        })
        .required(),
      phone: phoneNumberRule.required(),
      email: emailRule.optional(),
      maritalStatus: maritalStatusRule.required(),
      bvn: bvnRule.required(),
      idType: idTypeRule.required(),
      idNumber: idNumberRule.required(),
      idExpiration: idExpirationRule.required(),
      nextOfKin: extendedJoi
        .object({
          name: nameRule.label("Next of kin name").required(),
          address: extendedJoi.string().trim().max(256).label("Next of kin address"),
          phone: phoneNumberRule.label("Next of kin phone number").required(),
          relationship: relationshipRule.label("Next of kin relationship").required()
        })
        .required(),
      income: incomeRule.required(),
      accountName: nameRule.label("Account name").required(),
      accountNumber: bankAccountNumberRule.required(),
      bank: nameRule.label("Bank").max(50)
    });

    const result = schema.validate(request);

    return this.mapToValidationResult(result);
  }
}

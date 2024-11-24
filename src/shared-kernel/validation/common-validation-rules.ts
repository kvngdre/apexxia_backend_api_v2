import joi from "joi";
import { JoiPasswordExtend, joiPasswordExtendCore } from "joi-password";
import { OnboardingProcessStatus } from "@domain/user/onboarding-process";
import { JoiStringEnumExtend, stringEnumExtension } from "./extensions/enum-extension";
import { Gender, IdType, MaritalStatus, RelationShip } from "@domain/customer";

export const joiPassword: JoiPasswordExtend = joi.extend(joiPasswordExtendCore);
export const joiStringEnum: JoiStringEnumExtend = joi.extend(stringEnumExtension);

// ========================= RULES ====================================

export const bankAccountNumberRule = joi
  .string()
  .label("Account number")
  .trim()
  .pattern(/[0-9]{10}/)
  .messages({
    "string.pattern.base": "{#label} is not valid"
  });

export const bvnRule = joi
  .number()
  .label("BVN")
  .custom((bvn, helpers) => {
    const bvnString: string = bvn.toString();

    const bvnPattern = /^22\d{9}$/;

    if (!bvnPattern.test(bvnString)) {
      return helpers.error("number.invalid");
    }

    return bvn;
  });

export const emailRule = joi.string().label("Email").email().lowercase().trim().messages({
  "string.email": "Invalid email address"
});

export const genderRule = joiStringEnum.string().label("Gender").enum(Gender).trim();

export const idExpirationRule = joi.date().iso().greater("now").label("Id expiration date");

export const idNumberRule = joi.string().label("Id Number").trim().max(16);

export const idTypeRule = joiStringEnum.string().label("Id Type").enum(IdType).trim();

export const lenderNameRule = joi
  .string()
  .label("Lender name")
  .trim()
  .min(1)
  .max(63)
  .pattern(/^[a-zA-Z0-9,\s]+(-[a-zA-Z0-9,\s]+)*$/)
  .messages({
    // "string.base": "{#label} should be a text",
    "string.empty": "{#label} cannot be empty",
    "string.min": "{#label} is too short",
    "string.max": "{#label} is too long",
    "string.pattern.base":
      "{#label} is invalid. {#label} can only contain alphanumeric characters and hyphens (not consecutively, nor at the start or end)"
  });

export const latitudeRule = joi.number().precision(7).min(-90).max(90).label("Latitude");

export const longitudeRule = joi.number().min(-180).max(180).label("Longitude");

export const maritalStatusRule = joiStringEnum
  .string()
  .label("Marital status")
  .trim()
  .enum(MaritalStatus);

export const nameRule = joi
  .string()
  .label("Name")
  .trim()
  .min(1)
  .max(100)
  .pattern(/^[a-zA-Z0-9]+([\s\-a-zA-Z0-9]+)*$/)
  .messages({
    // "string.base": "{#label} should be a text",
    "string.empty": "{#label} cannot be empty",
    "string.min": "{#label} is too short",
    "string.max": "{#label} is too long",
    "string.pattern.base":
      "{#label} is invalid. {#label} can only contain alphanumeric characters and hyphens (not consecutively, nor at the start or end)"
  });

export const numberRule = joi.number().min(0);

export const objectIdStringRule = joi
  .string()
  .trim()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "{#label} ID is not valid"
  });

export const onb = joi.string<OnboardingProcessStatus>().trim();

export const personNameRule = joi
  .string()
  .min(1)
  .max(128)
  .trim()
  .pattern(/^[A-Z][a-z]+([-'’][A-Z][a-z]+)?$/)
  .custom((value, helpers) => {
    if (/\s/.test(value)) {
      return helpers.error("string.noWhitespace");
    }
    return value;
  })
  .messages({
    "string.min": "{#label} is too short",
    "string.max": "{#label} is too long",
    "string.pattern.base": "{#label} is invalid",
    "string.noWhitespace": "{#label} should not contain whitespace"
  });

export const passwordRule = joiPassword
  .string()
  .label("Password")
  .minOfUppercase(1)
  .minOfSpecialCharacters(1)
  .minOfNumeric(1)
  .noWhiteSpaces()
  .min(8)
  .max(256)
  .messages({
    "password.minOfUppercase": "{#label} should contain at least {#min} uppercase character",
    "password.minOfSpecialCharacters": "{#label} should contain at least {#min} special characters",
    "password.minOfNumeric": "{#label} should contain at least {#min} numbers",
    "password.noWhiteSpaces": "{#label} cannot contain white spaces"
  });

export const phoneNumberRule = joi
  .string()
  .trim()
  .label("Phone number")
  .pattern(/^(\+?234|0)(70|[89][01])\d{8}$/)
  .messages({
    "string.pattern.base": "{#label} is not valid",
    "any.required": "{#label} is required"
  });

export const relationshipRule = joiStringEnum
  .string()
  .label("Relationship")
  .trim()
  .enum(RelationShip);

export const subdomainRule = joi
  .string()
  .label("subdomain")
  .trim()
  .min(1)
  .max(63)
  .pattern(/^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/)
  .messages({
    // "string.base": "{#label} should be a text",
    "string.empty": "{#label} cannot be empty",
    "string.min": "{#label} is too short",
    "string.max": "{#label} is too long",
    "string.pattern.base":
      "{#label} is invalid. {#label} can only contain alphanumeric characters and hyphens (not consecutively, nor at the start or end)"
  });

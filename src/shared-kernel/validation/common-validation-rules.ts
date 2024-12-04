import Joi from "joi";
import { JoiPasswordExtend, joiPasswordExtendCore } from "joi-password";
import { OnboardingProcessStatus } from "@domain/user/onboarding-process";
import { JoiStringEnumExtend, stringEnumExtension } from "./extensions/enum-extension";
import { Gender, IdType, MaritalStatus, RelationShip } from "@domain/customer";

export const JoiPassword: JoiPasswordExtend = Joi.extend(joiPasswordExtendCore);
export const JoiStringEnum: JoiStringEnumExtend = Joi.extend(stringEnumExtension);

// ========================= RULES ====================================

export const bankAccountNumberRule = Joi.string()
  .label("Account number")
  .trim()
  .pattern(/[0-9]{10}/)
  .messages({
    "string.pattern.base": "{#label} is not valid"
  });

export const bvnRule = Joi.number()
  .label("BVN")
  .custom((bvn, helpers) => {
    const bvnString: string = bvn.toString();

    const bvnPattern = /^22\d{9}$/;

    if (!bvnPattern.test(bvnString)) {
      return helpers.error("number.invalid");
    }

    return bvn;
  });

export const emailRule = Joi.string().label("Email").email().lowercase().trim().messages({
  "string.email": "Invalid email address"
});

export const genderRule = JoiStringEnum.string().label("Gender").enum(Gender).trim();

export const idExpirationRule = Joi.date().iso().greater("now").label("Id expiration date");

export const idNumberRule = Joi.string().label("Id Number").trim().max(16);

export const idTypeRule = JoiStringEnum.string().label("Id Type").enum(IdType).trim();

export const lenderNameRule = Joi.string()
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

export const latitudeRule = Joi.number().precision(7).min(-90).max(90).label("Latitude");

export const longitudeRule = Joi.number().min(-180).max(180).label("Longitude");

export const maritalStatusRule = JoiStringEnum.string()
  .label("Marital status")
  .trim()
  .enum(MaritalStatus);

export const nameRule = Joi.string()
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

export const positiveNumberRule = Joi.number().min(0);

export const objectIdStringRule = Joi.string()
  .trim()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "{#label} ID is not valid"
  });

export const onb = Joi.string<OnboardingProcessStatus>().trim();

export const personNameRule = Joi.string()
  .min(1)
  .max(128)
  .trim()
  .pattern(/^[A-Za-z]+([-'][A-Za-z]+)?$/)
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

export const passwordRule = JoiPassword.string()
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

export const phoneNumberRule = Joi.string()
  .trim()
  .label("Phone number")
  .pattern(/^(\+?234|0)(70|[89][01])\d{8}$/)
  .messages({
    "string.pattern.base": "{#label} is not valid",
    "any.required": "{#label} is required"
  });

export const relationshipRule = JoiStringEnum.string()
  .label("Relationship")
  .trim()
  .enum(RelationShip);

export const subdomainRule = Joi.string()
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

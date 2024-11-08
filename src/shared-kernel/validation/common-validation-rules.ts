import joi from "joi";
import { JoiPasswordExtend, joiPasswordExtendCore } from "joi-password";
import { OnboardingProcessStatus } from "@domain/user/onboarding-process";

export const extendedJoi: JoiPasswordExtend = joi.extend(joiPasswordExtendCore);

// ========================= RULES ====================================
export const emailRule = joi.string().label("Email").email().lowercase().trim().messages({
  "string.email": "Invalid email address"
});

export const idRule = joi
  .string()
  .trim()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "{#label} ID is not valid"
  });

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

export const passwordRule = extendedJoi
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

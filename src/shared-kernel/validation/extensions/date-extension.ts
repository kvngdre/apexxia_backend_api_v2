import { DateSchema, ExtensionFactory, Root } from "joi";

export interface JoiAgeExtend<T> extends DateSchema<T> {
  isAbove18(): this;
  isBelow60(): this;
}

export interface JoiDateExtend extends Root {
  date<T = Date>(): JoiAgeExtend<T>;
}

export const ageExtension: ExtensionFactory = (joi) => ({
  type: "date",
  base: joi.date(),
  messages: {
    "date.isAbove18": "{#label} should be at least 18 years old.",
    "date.isBelow60": "{#label} should be not older than 60 years."
  },
  rules: {
    isAbove18: {
      validate: (value, helpers) => {
        const birthDate = value instanceof Date ? value : new Date(value);
        const today = new Date();

        let age = today.getUTCFullYear() - birthDate.getUTCFullYear();

        // Adjust age if the birthday hasn't occurred yet this year
        const monthDiff = today.getUTCMonth() - birthDate.getUTCMonth();
        const dayDiff = today.getUTCDate() - birthDate.getUTCDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }

        if (age < 18) return helpers.error("date.isAbove18");

        return value;
      }
    },
    isBelow60: {
      validate: (value, helpers) => {
        const birthDate = value instanceof Date ? value : new Date(value);
        const today = new Date();

        let age = today.getUTCFullYear() - birthDate.getUTCFullYear();

        // Adjust age if the birthday hasn't occurred yet this year
        const monthDiff = today.getUTCMonth() - birthDate.getUTCMonth();
        const dayDiff = today.getUTCDate() - birthDate.getUTCDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }

        if (age > 60) return helpers.error("date.isBelow60");

        return value;
      }
    }
  }
});

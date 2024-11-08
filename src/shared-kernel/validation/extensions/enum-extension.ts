import { ExtensionFactory, Root, StringSchema } from "joi";

export interface JoiStringExtend<T> extends StringSchema<T> {
  enum(enumType: unknown): StringSchema;
}

export interface JoiStringEnumExtend extends Root {
  string<T = string>(): JoiStringExtend<T>;
}

// Define a custom Joi extension
export const stringEnumExtension: ExtensionFactory = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.enum": "{#label} must be one of: {#values}"
  },
  rules: {
    enum: {
      method(enumType: object) {
        return this.$_addRule({
          name: "enum",
          args: { enumType }
        });
      },
      args: [
        {
          name: "enumType",
          assert: (value) => typeof value === "object",
          message: "must be an object or enum"
        }
      ],
      validate: (value, helpers, { enumType = {} }) => {
        const enumValues = Object.values(enumType);

        if (!enumValues.includes(value)) {
          return helpers.error("string.enum", { values: enumValues.join(", ") });
        }

        return value;
      }
    }
  }
});

import { ExtensionFactory } from "joi";

// export interface JoiStringExtend<T> extends StringSchema<T> {
//   enum(enumType: object): AnySchema;
// }

// export interface JoiStringEnumExtend extends Root {
//   string(): JoiStringExtend<string>;
// }

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
          name: "nativeEnum",
          args: { enumType }
        });

        // return this.valid(...enumValues).message({
        //   "string.enum": { values: enumValues.join(", ") }
        // });
      },
      args: [
        {
          name: "enumType",
          assert: (value) => typeof value === "object",
          message: "must be an object or enum"
        }
      ],
      validate: (value, helpers, { enumType = {} }) => {
        // Extract enum values for Joi.valid()
        const enumValues = Object.values(enumType);

        if (!enumValues.includes(value)) {
          return helpers.error("string.enum", { values: enumValues.join(", ") });
        }

        return value;
      }
    }
  }
});

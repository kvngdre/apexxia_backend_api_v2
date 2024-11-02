import { ExtensionFactory } from "joi";

// Define a custom Joi extension
const StringEnumExtension: ExtensionFactory = (joi) => ({
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

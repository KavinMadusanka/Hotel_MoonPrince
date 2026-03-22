import Joi from "joi";

export const availabilityQuerySchema = Joi.object({
  roomTypeId: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      "string.base": "roomTypeId must be a string",
      "string.empty": "roomTypeId is required",
      "string.length": "roomTypeId must be a valid MongoDB ObjectId",
      "string.hex": "roomTypeId must be a valid MongoDB ObjectId",
      "any.required": "roomTypeId is required"
    }),

  checkIn: Joi.date()
    .iso()
    .required()
    .messages({
      "date.base": "checkIn must be a valid date",
      "date.format": "checkIn must be in ISO date format",
      "any.required": "checkIn is required"
    }),

  checkOut: Joi.date()
    .iso()
    .greater(Joi.ref("checkIn"))
    .required()
    .messages({
      "date.base": "checkOut must be a valid date",
      "date.format": "checkOut must be in ISO date format",
      "date.greater": "checkOut must be after checkIn",
      "any.required": "checkOut is required"
    }),

  qty: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "qty must be a number",
      "number.integer": "qty must be an integer",
      "number.min": "qty must be at least 1"
    })
});
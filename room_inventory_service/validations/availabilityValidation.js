import Joi from "joi";

// Validation schema for checking room availability
export const availabilityQuerySchema = Joi.object({
  roomTypeId: Joi.string().trim().required(),
  checkIn: Joi.date().required(),
  checkOut: Joi.date().greater(Joi.ref("checkIn")).required(),
  qty: Joi.number().integer().min(1).default(1)
});
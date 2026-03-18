import Joi from "joi";

export const createRoomTypeSchema = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().allow("").optional(),
  maxGuests: Joi.number().integer().min(1).required(),
  bedType: Joi.string().allow("").optional(),
  amenities: Joi.array().items(Joi.string()).default([]),
  images: Joi.array().items(Joi.string()).default([]),
  basePrice: Joi.number().min(0).required(),

  discountActive: Joi.boolean().default(false),
  discountType: Joi.string().valid("PERCENT", "FIXED").default("PERCENT"),
  discountValue: Joi.number().min(0).default(0),
  discountValidFrom: Joi.date().allow(null).optional(),
  discountValidTo: Joi.date().allow(null).optional(),

  isActive: Joi.boolean().default(true)
});

export const updateRoomTypeSchema = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().allow("").optional(),
  maxGuests: Joi.number().integer().min(1).optional(),
  bedType: Joi.string().allow("").optional(),
  amenities: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.string()).optional(),

  // add this
  existingImages: Joi.array().items(Joi.string()).optional(),

  basePrice: Joi.number().min(0).optional(),

  discountActive: Joi.boolean().optional(),
  discountType: Joi.string().valid("PERCENT", "FIXED").optional(),
  discountValue: Joi.number().min(0).optional(),
  discountValidFrom: Joi.date().allow(null).optional(),
  discountValidTo: Joi.date().allow(null).optional(),

  isActive: Joi.boolean().optional()
}).min(1);
import RoomType from "../models/RoomType.js";

const normalizeAmenities = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (Array.isArray(item)) return item;

        if (typeof item === "string") {
          const trimmed = item.trim();

          if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            try {
              const parsed = JSON.parse(trimmed);
              return Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              return trimmed
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean);
            }
          }

          return trimmed
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);
        }

        return [String(item)];
      })
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return [];

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeAmenities(parsed);
      } catch {
        return trimmed
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean);
      }
    }

    return trimmed
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeExistingImages = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((img) => String(img).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return [];

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed)
          ? parsed.map((img) => String(img).trim()).filter(Boolean)
          : [];
      } catch {
        return [];
      }
    }

    return [trimmed];
  }

  return [];
};

// Create a new room type
export const createRoomType = async (req, res, next) => {
  try {
    const imageUrls = req.files ? req.files.map((file) => file.path) : [];

    const roomType = await RoomType.create({
      ...req.body,
      amenities: normalizeAmenities(req.body.amenities),
      images: imageUrls
    });

    res.status(201).json({
      message: "Room type created successfully",
      roomType
    });
  } catch (error) {
    next(error);
  }
};

// Get all room types
export const getRoomTypes = async (req, res, next) => {
  try {
    const roomTypes = await RoomType.find().sort({ createdAt: -1 });
    res.json(roomTypes);
  } catch (error) {
    next(error);
  }
};

// Get a single room type by ID
export const getRoomTypeById = async (req, res, next) => {
  try {
    const roomType = await RoomType.findById(req.params.id);

    if (!roomType) {
      return res.status(404).json({ message: "Room type not found" });
    }

    res.json(roomType);
  } catch (error) {
    next(error);
  }
};

// Update room type details
export const updateRoomType = async (req, res, next) => {
  try {
    const roomType = await RoomType.findById(req.params.id);

    if (!roomType) {
      return res.status(404).json({ message: "Room type not found" });
    }

    const uploadedImageUrls = req.files ? req.files.map((file) => file.path) : [];
    const existingImages = normalizeExistingImages(req.body.existingImages);
    const mergedImages = [...existingImages, ...uploadedImageUrls];

    roomType.name = req.body.name ?? roomType.name;
    roomType.description = req.body.description ?? roomType.description;
    roomType.maxGuests =
      req.body.maxGuests !== undefined
        ? Number(req.body.maxGuests)
        : roomType.maxGuests;
    roomType.bedType = req.body.bedType ?? roomType.bedType;
    roomType.amenities =
      req.body.amenities !== undefined
        ? normalizeAmenities(req.body.amenities)
        : roomType.amenities;
    roomType.basePrice =
      req.body.basePrice !== undefined
        ? Number(req.body.basePrice)
        : roomType.basePrice;

    if (req.body.discountActive !== undefined) {
      roomType.discountActive =
        req.body.discountActive === true || req.body.discountActive === "true";
    }

    roomType.discountType = req.body.discountType ?? roomType.discountType;
    roomType.discountValue =
      req.body.discountValue !== undefined
        ? Number(req.body.discountValue)
        : roomType.discountValue;

    roomType.images = mergedImages;

    const updatedRoomType = await roomType.save();

    res.json({
      message: "Room type updated successfully",
      roomType: updatedRoomType
    });
  } catch (error) {
    next(error);
  }
};

// Delete room type
export const deleteRoomType = async (req, res, next) => {
  try {
    const roomType = await RoomType.findById(req.params.id);

    if (!roomType) {
      return res.status(404).json({ message: "Room type not found" });
    }

    await roomType.deleteOne();

    res.json({
      message: "Room type deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
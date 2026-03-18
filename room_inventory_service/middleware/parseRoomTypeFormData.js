const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return value;
};

const parseNumber = (value) => {
  if (value === "" || value === null || value === undefined) return value;
  const num = Number(value);
  return Number.isNaN(num) ? value : num;
};

const parseJsonArrayOrCsv = (value) => {
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
        return Array.isArray(parsed)
          ? parsed.map((item) => String(item).trim()).filter(Boolean)
          : [];
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

const parseRoomTypeFormData = (req, res, next) => {
  try {
    if (req.body.maxGuests !== undefined) {
      req.body.maxGuests = parseNumber(req.body.maxGuests);
    }

    if (req.body.basePrice !== undefined) {
      req.body.basePrice = parseNumber(req.body.basePrice);
    }

    if (req.body.discountValue !== undefined) {
      req.body.discountValue = parseNumber(req.body.discountValue);
    }

    if (req.body.discountActive !== undefined) {
      req.body.discountActive = parseBoolean(req.body.discountActive);
    }

    if (req.body.isActive !== undefined) {
      req.body.isActive = parseBoolean(req.body.isActive);
    }

    if (req.body.amenities !== undefined) {
      req.body.amenities = parseJsonArrayOrCsv(req.body.amenities);
    }

    if (req.body.existingImages !== undefined) {
      req.body.existingImages = parseJsonArrayOrCsv(req.body.existingImages);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default parseRoomTypeFormData;
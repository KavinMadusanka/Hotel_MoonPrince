import ApiError from "./ApiError.js";

const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL;

export const createHold = async ({ reservationCode, roomTypeId, checkIn, checkOut }) => {
  if (!INVENTORY_URL) {
    throw new ApiError(503, "Inventory service URL not configured");
  }

  const url = `${INVENTORY_URL}/holds`;

  const payload = {
    reservationId: String(reservationCode),
    roomType: String(roomTypeId),
    checkIn: String(checkIn),
    checkOut: String(checkOut),
    qty: 1
  };

  console.log(`[inventoryClient] POST ${url}`);
  console.log(`[inventoryClient] Payload:`, JSON.stringify(payload));

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  console.log(`[inventoryClient] Response (${response.status}):`, text);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new ApiError(
      502,
      `Inventory service returned invalid response (${response.status}): ${text.slice(0, 200)}`
    );
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message || "Failed to create hold in inventory service"
    );
  }

  return data.hold;
};

export const confirmHold = async (holdId) => {
  if (!INVENTORY_URL) return;

  const url = `${INVENTORY_URL}/holds/${holdId}/confirm`;
  console.log(`[inventoryClient] POST ${url}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });

  const text = await response.text();
  console.log(`[inventoryClient] Confirm response (${response.status}):`, text);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new ApiError(
      502,
      `Inventory service returned invalid response: ${text.slice(0, 200)}`
    );
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message || "Failed to confirm hold in inventory service"
    );
  }

  return data.hold;
};

export const releaseHold = async (holdId) => {
  if (!INVENTORY_URL) return;

  const url = `${INVENTORY_URL}/holds/${holdId}/release`;
  console.log(`[inventoryClient] POST ${url}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`[inventoryClient] Failed to release hold ${holdId}:`, text);
  }
};
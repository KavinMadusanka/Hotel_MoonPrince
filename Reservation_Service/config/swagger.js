import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Reservation Service API",
      version: "1.0.0",
      description:
        "API documentation for Reservation Service (Booking Orchestrator) of Hotel MoonPrince"
    },
    servers: [
      {
        url: "http://localhost:8060",
        description: "Local development server"
      }
    ],
    components: {
      schemas: {
        Reservation: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65f4a1b1d8f1e8a123456789" },
            reservationCode: { type: "string", example: "RES-1710823456789-123456" },
            userId: { type: "string", example: "USER001" },
            roomId: { type: "string", example: "ROOM101" },
            roomTypeId: { type: "string", example: "RT001" },
            holdId: { type: "string", example: "HOLD001" },
            guestName: { type: "string", example: "P.T.P. Prabhasari" },
            guestEmail: { type: "string", example: "user@example.com" },
            guestPhone: { type: "string", example: "0771234567" },
            checkInDate: { type: "string", format: "date", example: "2026-04-10" },
            checkOutDate: { type: "string", format: "date", example: "2026-04-12" },
            guestsCount: { type: "integer", example: 2 },
            nights: { type: "integer", example: 2 },
            baseAmount: { type: "number", example: 18000 },
            currency: { type: "string", example: "LKR" },
            status: {
              type: "string",
              enum: ["pending", "confirmed", "cancelled", "checked_in", "completed"]
            },
            paymentStatus: {
              type: "string",
              enum: ["not_applicable", "pending", "paid", "failed", "refunded"]
            },
            bookingSource: {
              type: "string",
              enum: ["guest", "receptionist", "admin"]
            },
            specialRequests: { type: "string", example: "Need extra pillow" },
            cancellationReason: { type: "string", example: "Personal reason" },
            notes: { type: "string", example: "VIP guest" },
            confirmedAt: { type: "string", format: "date-time", nullable: true },
            cancelledAt: { type: "string", format: "date-time", nullable: true },
            checkedInAt: { type: "string", format: "date-time", nullable: true },
            checkedOutAt: { type: "string", format: "date-time", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        CreateReservationBody: {
          type: "object",
          required: [
            "userId",
            "roomId",
            "roomTypeId",
            "guestName",
            "guestEmail",
            "guestPhone",
            "checkInDate",
            "checkOutDate",
            "guestsCount",
            "baseAmount"
          ],
          properties: {
            userId: { type: "string", example: "USER001" },
            roomId: { type: "string", example: "ROOM101" },
            roomTypeId: { type: "string", example: "RT001" },
            guestName: { type: "string", example: "P.T.P. Prabhasari" },
            guestEmail: { type: "string", example: "user@example.com" },
            guestPhone: { type: "string", example: "0771234567" },
            checkInDate: { type: "string", format: "date", example: "2026-04-10" },
            checkOutDate: { type: "string", format: "date", example: "2026-04-12" },
            guestsCount: { type: "integer", example: 2 },
            baseAmount: { type: "number", example: 18000 },
            specialRequests: { type: "string", example: "Need early check-in if possible" },
            bookingSource: {
              type: "string",
              enum: ["guest", "receptionist", "admin"],
              example: "guest"
            }
          }
        },
        CancelReservationBody: {
          type: "object",
          properties: {
            cancellationReason: {
              type: "string",
              example: "Guest changed travel plans"
            }
          }
        },
        UpdateReservationBody: {
          type: "object",
          properties: {
            guestName: { type: "string", example: "Updated Guest Name" },
            guestEmail: { type: "string", example: "updated@example.com" },
            guestPhone: { type: "string", example: "0712345678" },
            specialRequests: { type: "string", example: "High floor room preferred" },
            notes: { type: "string", example: "Updated internal note" }
          }
        }
      }
    }
  },
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
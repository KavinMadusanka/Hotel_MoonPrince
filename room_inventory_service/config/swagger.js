import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Room & Inventory Service API",
      version: "1.0.0",
      description:
        "API documentation for the Room & Inventory microservice of the Hotel Reservation System"
    },
    servers: [
      {
        url: "http://localhost:8090",
        description: "Local development server"
      }
    ],
    components: {
      schemas: {
        RoomType: {
          type: "object",
          properties: {
            _id: { type: "string", example: "69b399d0c171ed66bee50e15" },
            name: { type: "string", example: "Double Room" },
            description: { type: "string", example: "Comfortable room for two guests" },
            maxGuests: { type: "integer", example: 2 },
            bedType: { type: "string", example: "Queen" },
            amenities: {
              type: "array",
              items: { type: "string" },
              example: ["WiFi", "AC", "TV"]
            },
            images: {
              type: "array",
              items: { type: "string" },
              example: []
            },
            basePrice: { type: "number", example: 16000 },
            discountActive: { type: "boolean", example: true },
            discountType: { type: "string", example: "PERCENT" },
            discountValue: { type: "number", example: 15 },
            discountValidFrom: { type: "string", format: "date-time", nullable: true },
            discountValidTo: { type: "string", format: "date-time", nullable: true },
            isActive: { type: "boolean", example: true }
          }
        },
        Room: {
          type: "object",
          properties: {
            _id: { type: "string", example: "69b3a12345abcde678901234" },
            roomNumber: { type: "string", example: "201" },
            floor: { type: "integer", example: 2 },
            roomType: { type: "string", example: "69b399d0c171ed66bee50e15" },
            status: {
              type: "string",
              enum: ["ready", "dirty", "maintenance", "out_of_service"],
              example: "ready"
            },
            notes: { type: "string", example: "AC repair in progress" }
          }
        },
        Hold: {
          type: "object",
          properties: {
            _id: { type: "string", example: "69b3b8ed3119457608091ba8" },
            reservationId: { type: "string", example: "RES-1002" },
            roomType: { type: "string", example: "69b399d0c171ed66bee50e15" },
            checkIn: { type: "string", format: "date-time", example: "2026-03-20T00:00:00.000Z" },
            checkOut: { type: "string", format: "date-time", example: "2026-03-22T00:00:00.000Z" },
            qty: { type: "integer", example: 1 },
            status: {
              type: "string",
              enum: ["held", "confirmed", "released", "expired"],
              example: "held"
            },
            expiresAt: {
              type: "string",
              format: "date-time",
              example: "2026-03-13T07:27:01.066Z"
            },
            createdBy: { type: "string", example: "reservation-service" }
          }
        },
        AvailabilityResponse: {
          type: "object",
          properties: {
            roomTypeId: { type: "string", example: "69b399d0c171ed66bee50e15" },
            roomTypeName: { type: "string", example: "Double Room" },
            totalRooms: { type: "integer", example: 4 },
            heldQty: { type: "integer", example: 1 },
            confirmedQty: { type: "integer", example: 0 },
            availableCount: { type: "integer", example: 3 },
            requestedQty: { type: "integer", example: 1 },
            canFulfill: { type: "boolean", example: true },
            nights: { type: "integer", example: 2 },
            basePricePerNight: { type: "number", example: 16000 },
            discountApplied: { type: "boolean", example: true },
            discount: {
              type: "object",
              nullable: true,
              properties: {
                type: { type: "string", example: "PERCENT" },
                value: { type: "number", example: 15 }
              }
            },
            finalPricePerNight: { type: "number", example: 13600 },
            estimatedTotal: { type: "number", example: 27200 }
          }
        }
      }
    }
  },
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Room & Inventory Service API",
      version: "1.0.0",
      description:
        "API documentation for the Room & Inventory microservice of the Hotel MoonPrince application"
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
            description: {
              type: "string",
              example: "Comfortable room for two guests"
            },
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
              example: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"]
            },
            basePrice: { type: "number", example: 16000 },
            discountActive: { type: "boolean", example: true },
            discountType: {
              type: "string",
              enum: ["PERCENT", "FIXED"],
              example: "PERCENT"
            },
            discountValue: { type: "number", example: 15 },
            discountValidFrom: {
              type: "string",
              format: "date-time",
              nullable: true
            },
            discountValidTo: {
              type: "string",
              format: "date-time",
              nullable: true
            },
            isActive: { type: "boolean", example: true }
          }
        },

        Room: {
          type: "object",
          properties: {
            _id: { type: "string", example: "69b3a12345abcde678901234" },
            roomNumber: { type: "string", example: "201" },
            floor: { type: "integer", example: 2 },
            roomType: {
              oneOf: [
                { type: "string", example: "69b399d0c171ed66bee50e15" },
                { $ref: "#/components/schemas/RoomType" }
              ]
            },
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
            roomType: {
              type: "string",
              example: "69b399d0c171ed66bee50e15"
            },
            checkIn: {
              type: "string",
              format: "date-time",
              example: "2026-03-20T00:00:00.000Z"
            },
            checkOut: {
              type: "string",
              format: "date-time",
              example: "2026-03-22T00:00:00.000Z"
            },
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
            createdBy: {
              type: "string",
              example: "reservation-service"
            }
          }
        },

        AvailabilityResponse: {
          type: "object",
          properties: {
            roomTypeId: {
              type: "string",
              example: "69b399d0c171ed66bee50e15"
            },
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
        },

        CreateRoomInput: {
          type: "object",
          required: ["roomNumber", "floor", "roomType", "status"],
          properties: {
            roomNumber: { type: "string", example: "201" },
            floor: { type: "integer", example: 2 },
            roomType: {
              type: "string",
              example: "69b399d0c171ed66bee50e15"
            },
            status: {
              type: "string",
              enum: ["ready", "dirty", "maintenance", "out_of_service"],
              example: "ready"
            },
            notes: { type: "string", example: "Near window" }
          }
        },

        UpdateRoomInput: {
          type: "object",
          required: ["roomNumber", "floor", "roomType", "status"],
          properties: {
            roomNumber: { type: "string", example: "202" },
            floor: { type: "integer", example: 2 },
            roomType: {
              type: "string",
              example: "69b399d0c171ed66bee50e15"
            },
            status: {
              type: "string",
              enum: ["ready", "dirty", "maintenance", "out_of_service"],
              example: "maintenance"
            },
            notes: { type: "string", example: "AC repair in progress" }
          }
        },

        UpdateRoomStatusInput: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["ready", "dirty", "maintenance", "out_of_service"],
              example: "dirty"
            },
            notes: { type: "string", example: "Cleaning pending" }
          }
        },

        CreateRoomTypeInput: {
          type: "object",
          required: ["name", "maxGuests", "basePrice"],
          properties: {
            name: { type: "string", example: "Double Room" },
            description: {
              type: "string",
              example: "Comfortable room for two guests"
            },
            maxGuests: { type: "integer", example: 2 },
            bedType: { type: "string", example: "Queen" },
            amenities: {
              oneOf: [
                {
                  type: "string",
                  example: "WiFi, AC, TV"
                },
                {
                  type: "array",
                  items: { type: "string" },
                  example: ["WiFi", "AC", "TV"]
                }
              ]
            },
            basePrice: { type: "number", example: 16000 },
            discountActive: { type: "boolean", example: true },
            discountType: {
              type: "string",
              enum: ["PERCENT", "FIXED"],
              example: "PERCENT"
            },
            discountValue: { type: "number", example: 15 },
            images: {
              type: "array",
              items: {
                type: "string",
                format: "binary"
              }
            }
          }
        },

        UpdateRoomTypeInput: {
          type: "object",
          properties: {
            name: { type: "string", example: "Deluxe Double Room" },
            description: {
              type: "string",
              example: "Updated description"
            },
            maxGuests: { type: "integer", example: 3 },
            bedType: { type: "string", example: "King" },
            amenities: {
              oneOf: [
                {
                  type: "string",
                  example: "WiFi, AC, TV, Mini Bar"
                },
                {
                  type: "array",
                  items: { type: "string" },
                  example: ["WiFi", "AC", "TV", "Mini Bar"]
                }
              ]
            },
            basePrice: { type: "number", example: 18500 },
            discountActive: { type: "boolean", example: true },
            discountType: {
              type: "string",
              enum: ["PERCENT", "FIXED"],
              example: "FIXED"
            },
            discountValue: { type: "number", example: 2000 },
            existingImages: {
              oneOf: [
                {
                  type: "string",
                  example:
                    '["https://res.cloudinary.com/demo/image/upload/sample1.jpg"]'
                },
                {
                  type: "array",
                  items: { type: "string" },
                  example: [
                    "https://res.cloudinary.com/demo/image/upload/sample1.jpg"
                  ]
                }
              ]
            },
            images: {
              type: "array",
              items: {
                type: "string",
                format: "binary"
              }
            }
          }
        },

        RoomResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Room created successfully" },
            room: { $ref: "#/components/schemas/Room" }
          }
        },

        RoomTypeResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Room type created successfully"
            },
            roomType: { $ref: "#/components/schemas/RoomType" }
          }
        },

        DeleteResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Deleted successfully" }
          }
        }
      }
    }
  },
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
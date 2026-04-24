import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Payment / Billing Service API",
      version: "1.0.0",
      description:
        "API documentation for the Hotel MoonPrince Payment & Billing microservice. Handles billing creation, billing item management, and user bill retrieval.",
    },
    servers: [
      {
        url: "http://localhost:8050",
        description: "Local Development Server",
      },
      {
        url: "https://payment-service-<your-cloud-run-url>.run.app",
        description: "Production (Google Cloud Run)",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token",
        },
      },
      schemas: {
        BillingItem: {
          type: "object",
          properties: {
            _id: { type: "string", example: "661f1c2e8f1b2c0012a3b456" },
            ItemType: { type: "string", example: "Room" },
            Description: { type: "string", example: "Deluxe Room - 1 Night" },
            QTY: { type: "number", example: 1 },
            UnitPrice: { type: "number", example: 150.0 },
          },
        },
        Billing: {
          type: "object",
          properties: {
            _id: { type: "string", example: "661f1c2e8f1b2c0012a3b789" },
            userId: { type: "string", example: "user_abc123" },
            roomId: { type: "string", example: "room_xyz456" },
            billingItems: {
              type: "array",
              items: { $ref: "#/components/schemas/BillingItem" },
            },
            status: {
              type: "string",
              enum: ["pending", "paid"],
              example: "pending",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        BillingItemCatalog: {
          type: "object",
          properties: {
            _id: { type: "string", example: "661f1c2e8f1b2c0012a3b111" },
            ItemType: { type: "string", example: "Food" },
            Description: { type: "string", example: "Breakfast Buffet" },
            UnitPrice: { type: "number", example: 25.0 },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Server Side Error" },
          },
        },
      },
    },
    security: [{ BearerAuth: [] }],
    tags: [
      { name: "Billing", description: "Billing management endpoints" },
      { name: "Items", description: "Billing item catalog endpoints" },
    ],
    paths: {
      // ─── BILLING ROUTES ────────────────────────────────────────────
      "/billing/create": {
        post: {
          tags: ["Billing"],
          summary: "Create a new billing record",
          description:
            "Creates a new billing record for a user and room. Requires authentication.",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["userId", "roomId"],
                  properties: {
                    userId: { type: "string", example: "user_abc123" },
                    roomId: { type: "string", example: "room_xyz456" },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Billing created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: {
                        type: "string",
                        example: "Billing created successfully",
                      },
                      data: { $ref: "#/components/schemas/Billing" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized - JWT token missing or invalid" },
            500: {
              description: "Server error",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },

      "/billing/remove-item/{billingId}/{itemId}": {
        delete: {
          tags: ["Billing"],
          summary: "Remove an item from a billing record",
          description: "Receptionist only. Removes a specific item by ID from a billing record.",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "billingId",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "661f1c2e8f1b2c0012a3b789",
            },
            {
              name: "itemId",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "661f1c2e8f1b2c0012a3b456",
            },
          ],
          responses: {
            200: {
              description: "Item removed successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: { type: "string", example: "Item removed successfully" },
                      data: { $ref: "#/components/schemas/Billing" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - Receptionist role required" },
            500: { description: "Server error" },
          },
        },
      },

      "/billing/addNewItem/{billingId}": {
        patch: {
          tags: ["Billing"],
          summary: "Add a new item to a billing record",
          description: "Receptionist only. Adds a new billing item to an existing billing record.",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "billingId",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "661f1c2e8f1b2c0012a3b789",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["ItemType", "Description", "QTY", "UnitPrice"],
                  properties: {
                    ItemType: { type: "string", example: "Food" },
                    Description: { type: "string", example: "Room Service - Dinner" },
                    QTY: { type: "number", example: 2 },
                    UnitPrice: { type: "number", example: 35.0 },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Item added successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Billing" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - Receptionist role required" },
            500: { description: "Server error" },
          },
        },
      },

      "/billing/get-billing/{userId}/{roomId}": {
        get: {
          tags: ["Billing"],
          summary: "Get billing details for a user and room",
          description: "Receptionist only. Retrieves the pending billing record for a specific user and room.",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "userId",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "user_abc123",
            },
            {
              name: "roomId",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "room_xyz456",
            },
          ],
          responses: {
            200: {
              description: "Billing details retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Billing" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - Receptionist role required" },
            404: { description: "Billing details not found" },
            500: { description: "Server error" },
          },
        },
      },

      "/billing/get-bill": {
        get: {
          tags: ["Billing"],
          summary: "Get current user's pending bill",
          description: "User only. Retrieves all pending billing records for the currently authenticated user.",
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: "User bills retrieved",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Billing" },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - User role required" },
            500: { description: "Server error" },
          },
        },
      },

      // ─── ITEMS ROUTES ──────────────────────────────────────────────
      "/items/create-billing": {
        post: {
          tags: ["Items"],
          summary: "Create a billing item in the catalog",
          description: "Receptionist only. Adds a new item type to the billing item catalog.",
          security: [{ BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["ItemType", "Description", "UnitPrice"],
                  properties: {
                    ItemType: { type: "string", example: "Spa" },
                    Description: { type: "string", example: "Full Body Massage - 60 min" },
                    UnitPrice: { type: "number", example: 80.0 },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Billing item created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: { type: "string", example: "Billing item created successfully" },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - Receptionist role required" },
            500: { description: "Server error" },
          },
        },
      },

      "/items/remove-billing/{itemId}": {
        delete: {
          tags: ["Items"],
          summary: "Remove a billing item from the catalog",
          description: "Receptionist only. Deletes an item from the billing catalog by ID.",
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: "itemId",
              in: "path",
              required: true,
              schema: { type: "string" },
              example: "661f1c2e8f1b2c0012a3b111",
            },
          ],
          responses: {
            200: {
              description: "Billing item removed successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: { type: "string", example: "Billing item removed successfully." },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - Receptionist role required" },
            404: { description: "Billing item not found" },
            500: { description: "Server error" },
          },
        },
      },

      "/items/billing-items": {
        get: {
          tags: ["Items"],
          summary: "Get all billing items in the catalog",
          description: "Receptionist only. Returns all available billing item types.",
          security: [{ BearerAuth: [] }],
          responses: {
            200: {
              description: "Items retrieved successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/BillingItemCatalog" },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized" },
            403: { description: "Forbidden - Receptionist role required" },
            500: { description: "Server error" },
          },
        },
      },
    },
  },
  apis: [], // paths defined inline above
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger docs available at /api-docs");
};

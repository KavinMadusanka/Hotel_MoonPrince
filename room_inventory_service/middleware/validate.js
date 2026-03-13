const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const data = req[source];

    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details.map(d => d.message)
      });
    }

    // Important fix
    if (source === "body") {
      req.body = value;
    }

    if (source === "params") {
      req.params = value;
    }

    // DO NOT overwrite req.query
    // just leave it as validated

    next();
  };
};

export default validate;
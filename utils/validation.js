const validationFields = (requiredFields, data) => {
  const missingFields = requiredFields.filter(
    (field) =>
      !data.hasOwnProperty(field) ||
      data[field] === undefined ||
      data[field] === null ||
      data[field] === ""
  );
  if (missingFields.length > 0) {
    return {
      success: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
    };
  }
  return {
    success: true,
  };
};

module.exports = {
  validationFields,
}
const paginateResult = (data, page, limit) => {
  const total = data.length;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedResult = data.slice(startIndex, endIndex);
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    data: paginatedResult,
  };
};

module.exports = { paginateResult };

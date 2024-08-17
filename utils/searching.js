const searchResult = (data, searchTerm, keys) => {
  if (!searchTerm || searchTerm.trim() === "") {
    return data;
  }
  const lowercasedTerm = searchTerm.toLowerCase();
  const filteredData = data.filter((item) =>
    keys.some((key) => String(item[key]).toLowerCase().includes(lowercasedTerm))
  );
  return filteredData;
};

module.exports = { searchResult };

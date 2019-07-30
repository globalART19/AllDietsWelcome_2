const parseNeo4j = data => {
  const parsedList = data[0]._fields.map(field => {
    const { labels, properties } = field;
    return { labels, ...properties || null }
  });
  data.forEach((item, index) => {
    if (index) {
      const { labels, properties } = item._fields[item._fields.length - 1];
      parsedList.push({ labels, ...properties || null });
    }
  })
  return parsedList;
}

module.exports = { parseNeo4j };

const generateUUID = (() => {
  let counter = 0;

  return (prefix) => {
    counter += 1;

    return `${prefix}-${counter}-${Date.now()}`;
  };
})();

export default generateUUID;

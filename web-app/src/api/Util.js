
export const isArrayEmpty = (array) => {
  return !Array.isArray(array) || !array.length;
};

export const jsonToArray = (json) => {
  let array;
  try {
    array = JSON.parse(json);
  } catch(e) {
    array = [];
  }
  return array;
}

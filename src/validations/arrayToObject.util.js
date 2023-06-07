export const arrayToObject = async (errorsArray) => {
  console.log(errorsArray)
  let errorObject = {};
  errorsArray.forEach((i) => (errorObject[i] = true));
  return errorObject;
};

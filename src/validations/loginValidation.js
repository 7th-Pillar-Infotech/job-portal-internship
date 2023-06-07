import * as Yup from "yup";
import { arrayToObject } from "./arrayToObject.util";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("emailInvalid").required("emailIsBlank"),
  password: Yup.string().min(6, "passwordIsShort").required("passwordIsBlank"),
});

export const loginValidation = async (loginFormData) => {
  try {
    await loginSchema.validate(loginFormData, {
      abortEarly: false,
    });
    return "validationsPassed";
  } catch (error) {
    const errorObject = await arrayToObject(error.errors);
    return errorObject;
  }
};

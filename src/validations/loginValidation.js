import * as Yup from "yup";

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
    let errorObject = {};
    error.errors.forEach((i) => (errorObject[i] = true));
    console.log(errorObject);
    return errorObject;
  }
};

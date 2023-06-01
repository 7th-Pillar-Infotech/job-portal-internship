import * as Yup from "yup";

const signupSchema = Yup.object().shape({
  email: Yup.string().email("emailInvalid").required("emailIsBlank"),
  password: Yup.string().min(6, "passwordIsShort").required("passwordIsBlank"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "passwordsNotSame"
  ),
});

export const signupValidation = async (loginFormData) => {
  try {
    await signupSchema.validate(loginFormData, {
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

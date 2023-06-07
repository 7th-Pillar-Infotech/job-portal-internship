import * as Yup from "yup";
import { arrayToObject } from "./arrayToObject.util";

const jobApplicationSchema = Yup.object().shape({
  fullName: Yup.string().required("fullNameIsBlank"),
  age: Yup.number("ageIsInvalid")
    .typeError("ageIsInvalid")
    .moreThan(17, "ageIsInvalid")
    .required("ageIsBlank"),
  qualification: Yup.string().required("qualificationIsBlank"),
  experience: Yup.number("experienceIsInvalid")
    .typeError("experienceIsInvalid")
    .required("experienceIsBlank")
    .moreThan(-1, "experienceIsInvalid"),
});

export const jobApplicationValidation = async (jobApplicationFormData) => {
  console.log(jobApplicationFormData);
  try {
    await jobApplicationSchema.validate(jobApplicationFormData, {
      abortEarly: false,
    });
    return "validationsPassed";
  } catch (error) {
    const errorObject = await arrayToObject(error.errors);
    return errorObject;
  }
};

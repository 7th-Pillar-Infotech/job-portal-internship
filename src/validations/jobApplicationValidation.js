import * as Yup from "yup";

const jobApplicationSchema = Yup.object().shape({
  fullName: Yup.string().required("fullNameIsBlank"),
  age: Yup.string().moreThan(17, "ageIsInvalid").required("ageIsBlank"),
  qualification: Yup.string().required("qualificationIsBlank"),
  experience: Yup.string()
    .required("experienceIsBlank")
    .moreThan(0, "experienceIsInvalid"),
  resumeFile: Yup.string().required("resumeIsBlank"),
});

export const jobApplicationValidation = async (jobApplicationFormData) => {
  try {
    await jobApplicationSchema.validate(jobApplicationFormData, {
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

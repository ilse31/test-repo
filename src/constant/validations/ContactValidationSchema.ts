import * as Yup from "yup";
// first_name: "",
//                   last_name: "",
//                   phones: [{ number: "" }],
export const ContactValidationSchema = Yup.object({
  first_name: Yup.string()
    .required("First Name is required")
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
  last_name: Yup.string()
    .required("Last Name is required")
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed"),
});

import React from "react";
import { Formik, FieldArray } from "formik";
import { ContactValidationSchema } from "src/constant/validations/ContactValidationSchema";
import Input from "./Form/InputForm";
import Button from "./Button/Button";
import { contactValues } from "src/constant/FormikValues/ContactValues";

type Props = {
  handleSubmit: (values: any, { setErrors }: any) => void;
  isDetail: boolean;
  contact: any;
  handleClose: () => void;
};

const ContactForm = ({
  handleSubmit,
  isDetail,
  contact,
  handleClose,
}: Props) => {
  console.log(contact);
  return (
    <Formik
      validationSchema={ContactValidationSchema}
      initialValues={isDetail ? contact : contactValues}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleSubmit, errors }) => (
        <form className='gap-3 flex-col flex w-full' onSubmit={handleSubmit}>
          <Input
            color='sky'
            id='first_name'
            disabled={isDetail}
            label='First Name'
            variant='solid'
            onChange={handleChange}
            value={values.first_name}
            errorMessage={errors.first_name}
            placeholder='First Name'
            about='This is the first_name field'
            name='first_name'
            type='text'
          />
          <Input
            color='sky'
            id='last_name'
            label='Last Name'
            variant='solid'
            onChange={handleChange}
            disabled={isDetail}
            value={values.last_name}
            errorMessage={errors.last_name}
            placeholder='Last Name'
            about='This is the last_name field'
            name='last_name'
            type='text'
          />
          <FieldArray name='phones'>
            {({ push, remove }: any) => (
              <div className='flex flex-col w-full gap-5'>
                {values.phones.map((field: any, index: any) => (
                  <div key={index} className='w-full flex flex-col gap-4'>
                    <Input
                      id={`dynamic_field_${index}`}
                      variant='solid'
                      color='sky'
                      disabled={isDetail}
                      label={`PhoneNumber ${index + 1}`}
                      onChange={(e) =>
                        handleChange(`phones[${index}].number`)(e)
                      }
                      onKeyPress={(e: React.KeyboardEvent) => {
                        const charCode = e.charCode;
                        if (charCode < 48 || charCode > 57) {
                          e.preventDefault();
                        }
                      }}
                      placeholder={`PhoneNumber ${index + 1}`}
                      value={field.number}
                      name={`phones[${index}].number`}
                      type='text'
                    />
                    {!isDetail && (
                      <div className='w-1/3'>
                        <Button
                          disabled={isDetail}
                          size='sm'
                          variant='rose'
                          type='button'
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {!isDetail && (
                  <Button
                    size='sm'
                    disabled={isDetail}
                    type='button'
                    onClick={() => push({ number: "" })}
                  >
                    Add new Number
                  </Button>
                )}
              </div>
            )}
          </FieldArray>

          <div className='flex-col flex gap-3'>
            <Button variant='danger' onClick={handleClose} type='submit'>
              Back
            </Button>
            <Button variant='sky' type='submit'>
              Send
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default ContactForm;

const GetContactList = (
  name: string,
  limit: number,
  offset: number,
  order: string
) => {
  return {
    //   distinct_on: ["column1", "column2"],
    limit: limit,
    offset: offset,
    order_by: {
      created_at: order,
    },
    where: {
      _or: [{ first_name: { _ilike: `%${name}%` } }],
    },
  };
};

const getContactDetail = (id: number) => {
  return {
    id: id,
  };
};

const AddContactWithPhones = (
  first_name: string,
  last_name: string,
  phones: { number: string }[]
) => {
  return {
    first_name: first_name,
    last_name: last_name,
    phones: phones,
  };
};

const AddNumberToContact = (id: number, phoneNumber: string) => {
  return {
    contact_id: id,
    phone_number: phoneNumber,
  };
};

export {
  getContactDetail,
  GetContactList,
  AddContactWithPhones,
  AddNumberToContact,
};

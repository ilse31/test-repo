export const GetContactList = (
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
      _or: [
        { first_name: { _ilike: `%${name}%` } },
        // { last_name: { _ilike: `%${name}%` } },
      ],
    },
  };
};

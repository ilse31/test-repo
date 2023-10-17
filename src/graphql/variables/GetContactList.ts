export const GetContactList = (name: string, limit: number, offset: number) => {
  return {
    //   distinct_on: ["column1", "column2"],
    limit: limit,
    offset: offset,
    //   order_by: [{ column: "created_at", order: "asc" }],
    where: {
      first_name: { _like: `%${name}%` },
    },
  };
};

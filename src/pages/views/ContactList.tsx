import { useQuery } from "@apollo/client";
import React from "react";
import { getData } from "src/graphql/Query/getData";

type Props = {};

const ContactList = (props: Props) => {
  const {
    data: allData,
    loading: loadingAllData,
    error: errorAllData,
  } = useQuery(getData);

  console.log("alldata", allData);
  return <div className='dark:text-white'>ContactList</div>;
};

export default ContactList;

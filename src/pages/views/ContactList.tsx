import { useQuery } from "@apollo/client";
import React from "react";
import { GET_CONTACT_LIST } from "src/graphql/Query/getData";
import { GetContactList } from "src/graphql/variables/GetContactList";

type Props = {};

//pages for render all contacts
const ContactList = (props: Props) => {
  const {
    data: allData,
    loading: loadingAllData,
    error: errorAllData,
  } = useQuery(GET_CONTACT_LIST, {
    variables: GetContactList,
  });

  return <div className='dark:text-white'>ContactList</div>;
};

export default ContactList;

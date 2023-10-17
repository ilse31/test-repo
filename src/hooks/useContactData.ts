import { useState, useEffect } from "react";
import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
  useQuery,
} from "@apollo/client";
import { GET_CONTACT_LIST, DELETE_DATA, GetContactList } from "src/graphql";
import { useContact } from "src/context/contactdata";

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  phones: any[];
}

interface ContactListHook {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  setContactData: React.Dispatch<React.SetStateAction<Contact[]>>;
  handleChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  isShowSearch: boolean;
  handleSearchButtonClick: () => void;
  loadingAllData: boolean;
  errorAllData: any;
  limit: number;
  contactData: Contact[];
  loadingMore: boolean;
  handleDelete: (id: string) => void;
  refetchAllData: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<any>>;
}

function useContactList(): ContactListHook {
  const [searchValue, setSearchValue] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [contactData, setContactData] = useState<Contact[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  // const [previousSearchValue, setPreviousSearchValue] = useState("");
  const { state, addContactData, removeContactData } = useContact();
  const { contact } = state;
  const {
    data: allData,
    loading: loadingAllData,
    error: errorAllData,
    refetch: refetchAllData,
  } = useQuery(GET_CONTACT_LIST, {
    variables: GetContactList("", limit, offset, "asc"),
  });

  const [deletedata, { loading: loadingDelete }] = useMutation(DELETE_DATA, {
    refetchQueries: [
      {
        query: GET_CONTACT_LIST,
        variables: GetContactList(searchValue, limit, offset, "asc"),
      },
    ],
  });

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    console.log(searchValue);
    // if (searchValue !== previousSearchValue) {
    //   console.log("search", searchValue);
    //   setPreviousSearchValue(searchValue);
    //   setOffset(0);
    //   setContactData([]);
    //   setHasMore(true);
    //   refetchAllData({
    //     variables: GetContactList(searchValue, limit, 0, "asc"),
    //   });
    // }
  };

  const handleSearchButtonClick = () => {
    setIsShowSearch(!isShowSearch);
  };

  const handleDelete = (id: string) => {
    deletedata({
      variables: { id: parseInt(id) },
    })
      .then((resp) => removeContactData(parseInt(id)))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!loadingAllData) {
      addContactData(allData?.contact || []);
    }
  }, [loadingAllData]);

  return {
    limit,
    setSearchValue,
    searchValue,
    handleChangeSearch,
    handleSearch,
    isShowSearch,
    handleSearchButtonClick,
    loadingAllData,
    errorAllData,
    contactData,
    loadingMore,
    handleDelete,
    setContactData,
    refetchAllData,
  };
}

export default useContactList;

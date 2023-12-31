import React, { useState, useEffect } from "react";
import {
  ApolloQueryResult,
  OperationVariables,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  GET_CONTACT_LIST,
  DELETE_DATA,
  GetContactList,
  ADD_DATA_WITH_PHONE,
  AddContactWithPhones,
  AddNumberToContact,
  ADD_NUMBER_TO_CONTACT,
} from "src/graphql";
import { useContact } from "src/context/contactdata";

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  phones: any[];
}
type ContactAction = {
  id: string;
  first_name: string;
  last_name: string;
  phones: any[];
  action: string;
};
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
  handleSubmit: (values: any, { setErrors }: any) => void;
  showAlert: boolean;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertMessage: React.Dispatch<React.SetStateAction<string>>;
  alertMessage: string;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  dataDetail: ContactAction;
  setDataDetail: React.Dispatch<React.SetStateAction<ContactAction>>;
}

function useContactList(): ContactListHook {
  const [searchValue, setSearchValue] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [contactData, setContactData] = useState<Contact[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [dataDetail, setDataDetail] = useState<ContactAction>(
    {} as ContactAction
  );

  //global state untuk crud data
  const { state, addContactData, removeContactData, addSingleContact } =
    useContact();
  const { contact } = state;

  //buat load all data
  const {
    data: allData,
    loading: loadingAllData,
    error: errorAllData,
    refetch: refetchAllData,
  } = useQuery(GET_CONTACT_LIST, {
    variables: GetContactList("", limit, offset, "asc"),
  });

  //buat delete data
  const [deletedata, { loading: loadingDelete }] = useMutation(DELETE_DATA, {
    refetchQueries: [
      {
        query: GET_CONTACT_LIST,
        variables: GetContactList(searchValue, limit, offset, "asc"),
      },
    ],
  });

  //buat insertdata
  const [InsertData] = useMutation(ADD_DATA_WITH_PHONE, {
    refetchQueries: [
      {
        query: GET_CONTACT_LIST,
        variables: GetContactList(searchValue, limit, offset, "asc"),
      },
    ],
  });

  const [insertPhone] = useMutation(ADD_NUMBER_TO_CONTACT, {
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

  //handlesubmit dan validasi uniq di firstname dan lastname
  const handleSubmit = async (values: any, { setErrors }: any) => {
    if (dataDetail.action === "Add") {
      const { first_name, last_name } = values;
      const isDuplicate = contact.some((item) => {
        return (
          item.first_name.toLowerCase() === first_name.toLowerCase() &&
          item.last_name.toLowerCase() === last_name.toLowerCase()
        );
      });
      if (isDuplicate) {
        setErrors({
          first_name: "Nama sudah ada dalam daftar kontak.",
          last_name: "Nama sudah ada dalam daftar kontak.",
        });
      } else {
        InsertData({
          variables: AddContactWithPhones(
            values.first_name,
            values.last_name,
            values.phones
          ),
        })
          .then((resp) => {
            console.log(resp);
            setShowModal(false);
            console.log("contact", resp.data.insert_contact.returning[0]);
            setShowAlert(true);
            addSingleContact(resp.data.insert_contact.returning[0]);
            setAlertMessage("Data berhasil ditambahkan.");
          })
          .catch((err) => {
            setAlertMessage(err.message);
            setShowAlert(true);
            setShowModal(false);
          });
      }
    } else {
      try {
        let result = await insertPhone({
          variables: AddNumberToContact(values.id, values.number),
        });
        addSingleContact(result.data.insert_phone.returning[0].contact);
        setShowAlert(true);
        console.log("alawkjdawndjkn");
        setShowModal(false);
        setAlertMessage("Data berhasil ditambahkan.");
      } catch (error) {
        console.log("err", error);
      }
    }
  };

  //pagination infinite scrolling
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loadingAllData ||
      allData?.contact.length === 0
    ) {
      return;
    }
    setOffset(offset + limit);
    refetchAllData({
      variables: GetContactList(searchValue, limit, offset, "asc"),
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingAllData, allData]);

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
      setAlertMessage("");
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
    handleSubmit,
    setShowAlert,
    showAlert,
    setAlertMessage,
    alertMessage,
    showModal,
    setShowModal,
    setDataDetail,
    dataDetail,
  };
}

export default useContactList;

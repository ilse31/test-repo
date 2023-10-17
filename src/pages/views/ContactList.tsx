import { useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import Input from "src/components/Form/InputForm";
import { GET_CONTACT_LIST } from "src/graphql/Query/getData";
import { GetContactList } from "src/graphql/variables/GetContactList";
import { AiOutlineSearch, AiFillAppstore } from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { BsFillPersonFill } from "react-icons/bs";
import Typography from "src/components/Typografy/Text";
import LoadingSpiner from "src/components/Loading/LoadingSpiner";

type Props = {};

//pages for render all contacts

const ContactList = (props: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [contactData, setContactData] = useState<Array<any>>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [previousSearchValue, setPreviousSearchValue] = useState("");

  const {
    data: allData,
    loading: loadingAllData,
    error: errorAllData,
    refetch: refetchAllData,
  } = useQuery(GET_CONTACT_LIST, {
    variables: GetContactList("", limit, offset, "asc"),
  });

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    if (searchValue !== previousSearchValue) {
      console.log("search", searchValue);
      setPreviousSearchValue(searchValue);
      setOffset(0);
      setContactData([]);
      setHasMore(true);
      refetchAllData(GetContactList(searchValue, limit, 0, "asc"));
    }
  };

  const handleSearchButtonClick = () => {
    setIsShowSearch(!isShowSearch);
  };

  const loadMoreData = () => {
    if (loadingAllData) {
      return;
    }
    if (allData?.contact.length === 0) {
      return;
    }
    if (
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 100
    ) {
      setLoadingMore(true);
      setTimeout(() => {
        if (hasMore) {
          setOffset(offset + limit);
        }
        setLoadingMore(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (allData) {
      const newContactList = allData.contact || [];
      if (newContactList.length < limit) {
        setHasMore(false);
      }
      setContactData((prevData) => [...prevData, ...newContactList]);
    }
  }, [allData, limit]);

  useEffect(() => {
    window.addEventListener("scroll", loadMoreData);
    return () => {
      window.removeEventListener("scroll", loadMoreData);
    };
  }, [loadMoreData]);

  return (
    <div className='dark:text-white'>
      <div className='flex justify-between items-center'>
        <BiMenuAltLeft className='dark:text-white text-black text-2xl ' />
        {!isShowSearch ? <Typography>Goto Technical Test</Typography> : null}
        {!isShowSearch ? (
          <AiOutlineSearch
            onClick={handleSearchButtonClick}
            className='dark:text-white text-black text-2xl'
          />
        ) : null}
        {isShowSearch && (
          <Input
            id='search'
            variant='solid'
            name='search'
            value={searchValue}
            label={null}
            onChange={handleChangeSearch}
            color='sky'
            type='text'
            onKeyUp={(e: React.KeyboardEvent) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder='Search'
            rightNode={
              searchValue ? (
                <div className='flex items-center gap-5'>
                  <div
                    className='text-black cursor-pointer'
                    onClick={(e: any) => {
                      setSearchValue("");
                      refetchAllData(GetContactList("", limit, 0, "asc"));
                      setContactData([]);
                    }}
                  >
                    X
                  </div>
                  <AiOutlineSearch
                    onClick={(e: React.MouseEvent) => handleSearch()}
                    className='text-black cursor-pointer text-lg items-center'
                  />
                </div>
              ) : (
                <AiOutlineSearch
                  onClick={(e: React.MouseEvent) => handleSearch()}
                  className='text-black cursor-pointer text-lg items-center'
                />
              )
            }
            className={` ${isShowSearch ? "visible" : ""}`}
          />
        )}
      </div>
      <div className='max-w-3xl mx-auto gap-10'>
        {loadingAllData ? <LoadingSpiner /> : null}

        {errorAllData ? <Typography>Error</Typography> : null}
        {loadingMore && <div className='text-center py-4'>Loading. . .</div>}
        {!errorAllData &&
          contactData.map((contact: any, index: number) => (
            <div
              key={index}
              className='flex gap-10 outline my-5 p-5 rounded-md'
            >
              <BsFillPersonFill className='text-2xl' />
              <Typography key={index}>
                {contact.first_name} {contact.last_name}
              </Typography>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ContactList;

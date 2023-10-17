import { useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import Input from "src/components/Form/InputForm";
import { GET_CONTACT_LIST } from "src/graphql/Query/getData";
import { GetContactList } from "src/graphql/variables/GetContactList";
import { AiOutlineSearch, AiFillAppstore } from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import Button from "src/components/Button/Button";
import { BsFillPersonFill } from "react-icons/bs";
import Typography from "src/components/Typografy/Text";
import LoadingSpiner from "src/components/Loading/LoadingSpiner";

type Props = {};

//pages for render all contacts
const ContactList = (props: Props) => {
  const [searchValue, setSearchValue] = useState("");
  const [isShowSearch, setIsShowSearch] = useState(false);
  const [offset, setOffset] = useState(0);
  const [contactData, setContactData] = useState([]);
  const [reachedEnd, setReachedEnd] = useState(false);

  const {
    data: allData,
    loading: loadingAllData,
    error: errorAllData,
    refetch: refetchAllData,
  } = useQuery(GET_CONTACT_LIST, {
    variables: GetContactList(searchValue, 10, offset),
  });

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };
  const handleSearch = () => {
    setContactData([]);
    refetchAllData(GetContactList(searchValue, 10, 0));
  };

  const handleSearchButtonClick = () => {
    setIsShowSearch(!isShowSearch);
  };

  const loadMoreData = () => {
    if (!reachedEnd) {
      const newOffset = offset + 10;
      refetchAllData(GetContactList(searchValue, 10, newOffset));
      setOffset(newOffset);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [offset]);

  useEffect(() => {
    if (allData && allData.contact) {
      if (allData.contact.length === 0) {
        setReachedEnd(true);
      } else {
        setReachedEnd(false);
        if (offset === 0) {
          setContactData(allData.contact);
        } else {
          setContactData((prevData) => prevData.concat(allData.contact));
        }
      }
    }
  }, [allData]);

  //infinte scroll pagination
  const handleScroll = () => {
    if (
      bottomRef.current &&
      window.innerHeight + window.scrollY >= bottomRef.current.offsetTop
    ) {
      loadMoreData();
    }
  };

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
              <AiOutlineSearch
                onClick={(e: React.MouseEvent) => handleSearch()}
                className='text-black cursor-pointer text-lg items-center'
              />
            }
            className={` ${isShowSearch ? "visible" : ""}`}
          />
        )}
      </div>
      <div className='max-w-3xl mx-auto gap-10'>
        {loadingAllData ? <LoadingSpiner /> : null}

        {errorAllData ? <Typography>Error</Typography> : null}

        {!errorAllData &&
          contactData.map((contact: any) => (
            <div
              key={contact.id}
              className='flex gap-10 outline my-5 p-5 rounded-md'
            >
              <BsFillPersonFill className='text-2xl' />
              <Typography key={contact.id}>
                {contact.first_name} {contact.last_name}
              </Typography>
            </div>
          ))}
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
};

export default ContactList;

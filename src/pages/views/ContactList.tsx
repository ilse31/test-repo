import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import Input from "src/components/Form/InputForm";
import { AiOutlineSearch } from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { BsFillPersonFill, BsFillTrashFill } from "react-icons/bs";
import Typography from "src/components/Typografy/Text";
import LoadingSpiner from "src/components/Loading/LoadingSpiner";
import { DELETE_DATA, GET_CONTACT_LIST, GetContactList } from "src/graphql";
import useContactList from "src/hooks/useContactData";
import { useContact } from "src/context/contactdata";
import Button from "src/components/Button/Button";

type Props = {};

//pages for render all contacts

const ContactList = (props: Props) => {
  const {
    searchValue,
    setSearchValue,
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
    limit,
  } = useContactList();
  const { state, addContactData, toggleFavorite } = useContact();
  const { contact } = state;

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
        {/* {!errorAllData &&
          contactData.map((contact: any, index: number) => (
            <div
              key={index}
              className='flex gap-10 justify-between outline my-5 p-5 rounded-md items-center'
            >
              <div className='flex gap-10 items-center'>
                <BsFillPersonFill className='text-4xl' />
                <div>
                  <Typography key={index}>
                    {contact.first_name} {contact.last_name}
                  </Typography>
                  {contact.phones[0]?.number}
                </div>
              </div>
              <BsFillTrashFill
                onClick={(e: React.MouseEvent) => handleDelete(contact.id)}
                className='cursor-pointer'
              />
            </div>
          ))} */}
        {contact &&
          contact
            .filter((item: any) => {
              return (
                (item.first_name
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()) ||
                  item.last_name
                    .toLowerCase()
                    .includes(searchValue.toLowerCase())) &&
                !item.isFavorites
              );
            })
            .map((contact: any, index: number) => (
              <div
                key={index}
                className='flex gap-10 justify-between outline my-5 p-5 rounded-md items-center'
              >
                <div className='flex gap-10 items-center'>
                  <BsFillPersonFill className='text-4xl' />
                  <div>
                    <Typography key={index}>
                      {contact.first_name} {contact.last_name}
                    </Typography>
                    {contact.phones[0]?.number}
                  </div>
                </div>
                <Button
                  onClick={(e: React.MouseEvent) => toggleFavorite(contact.id)}
                >
                  {contact.isFavorites ? "UnFav" : "Fav"}
                </Button>
                {/* <BsFillTrashFill
                  onClick={(e: React.MouseEvent) => handleDelete(contact.id)}
                  className='cursor-pointer'
                /> */}
              </div>
            ))}
        <div className='items-center justify-center flex min-h-screen'>
          {contact.length === 0 && !loadingAllData && !errorAllData && (
            <Typography variant='h2'>No Data Found</Typography>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactList;

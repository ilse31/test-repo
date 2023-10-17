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
import Modal from "src/components/Modal/Modal";

type Props = {};

type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  phones: any[];
};

const ContactList = (props: Props) => {
  const {
    searchValue,
    setSearchValue,
    handleSearch,
    handleChangeSearch,
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
  const { state, toggleFavorite } = useContact();
  const { contact } = state;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [dataDeleted, setDataDeleted] = useState<Contact>({} as Contact);
  const [isFavorites, setIsFavorites] = useState<boolean>(false); // Tambahkan state dan fungsi untuk mengubahnya

  return (
    <div className='dark:text-white'>
      <div className='flex justify-between items-center'>
        <div className='p-5'>
          <Typography>Goto Technical Test</Typography>
        </div>
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
        <div className='flex flex-row gap-5'>
          <div
            onClick={(e: React.MouseEvent) => setIsFavorites(false)}
            className={`${
              isFavorites
                ? " p-3 hover:outline rounded-md cursor-pointer"
                : "bg-sky-500 p-3 hover:outline rounded-md cursor-pointer"
            }`}
          >
            Contact
          </div>
          <div
            onClick={(e: React.MouseEvent) => setIsFavorites(true)}
            className={`${
              isFavorites
                ? "bg-sky-500 p-3 hover:outline rounded-md cursor-pointer"
                : "p-3 hover:outline rounded-md cursor-pointer"
            }`}
          >
            Contact Favorites
          </div>
        </div>

        {loadingAllData ? <LoadingSpiner /> : null}

        {errorAllData ? <Typography>Error</Typography> : null}
        {loadingMore && <div className='text-center py-4'>Loading. . .</div>}

        {contact &&
          contact
            .filter((item: any) => {
              const isContactFavorite = item.isFavorites;
              if (isFavorites) {
                return isContactFavorite;
              } else {
                return !isContactFavorite;
              }
            })
            .filter((item: any) => {
              return (
                item.first_name
                  .toLowerCase()
                  .includes(searchValue.toLowerCase()) ||
                item.last_name.toLowerCase().includes(searchValue.toLowerCase())
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
                <div className='flex items-center gap-5'>
                  <Button
                    onClick={(e: React.MouseEvent) =>
                      toggleFavorite(contact.id)
                    }
                  >
                    {contact.isFavorites ? "UnFav" : "Favorites"}
                  </Button>
                  <BsFillTrashFill
                    onClick={(e: React.MouseEvent) => {
                      setShowModal(true);
                      setDataDeleted(contact);
                    }}
                    className='cursor-pointer'
                  />
                </div>
              </div>
            ))}
        <div className='items-center justify-center flex '>
          {contact.length === 0 && !loadingAllData && !errorAllData && (
            <Typography variant='h2'>No Data Found</Typography>
          )}
        </div>
        <div className='absolute top-10'>
          {showModal && (
            <Modal
              title={"Are you sure to delete this data?"}
              size={"md"}
              content={""}
              showModal={showModal}
              setShowModal={setShowModal}
            >
              <div className='flex flex-col items-center gap-5'>
                <div className='flex justify-start'>
                  <h5 className='text-black'>
                    {`${dataDeleted.first_name} ${dataDeleted.last_name}`}
                  </h5>
                </div>
                <div className='flex gap-5 justify-end w-full'>
                  <Button
                    onClick={(e: React.MouseEvent) => {
                      setShowModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='rose'
                    onClick={(e: React.MouseEvent) => {
                      handleDelete(dataDeleted.id);
                      setShowModal(false);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactList;

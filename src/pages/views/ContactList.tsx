import React, { useEffect, useState } from "react";
import Input from "src/components/Form/InputForm";
import { AiOutlineSearch } from "react-icons/ai";
import { BsFillPersonFill, BsFillTrashFill } from "react-icons/bs";
import Typography from "src/components/Typografy/Text";
import LoadingSpiner from "src/components/Loading/LoadingSpiner";
import useContactList from "src/hooks/useContactData";
import { useContact } from "src/context/contactdata";
import Button from "src/components/Button/Button";
import Modal from "src/components/Modal/Modal";
import Alert from "src/components/Alert/Alert";
import ContactForm from "src/components/ContactForm";
import DeleteConfirmationBox from "src/components/DeleteConfirmationBox";

type Props = {};

type ContactAction = {
  id: string;
  first_name: string;
  last_name: string;
  phones: any[];
  action: string;
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
    handleSubmit,
    dataDetail,
    setDataDetail,
    showAlert,
    setShowAlert,
    alertMessage,
    setAlertMessage,
    showModal,
    setShowModal,
  } = useContactList();
  const { state, toggleFavorite } = useContact();
  const { contact } = state;

  const [isFavorites, setIsFavorites] = useState<boolean>(false);

  React.useEffect(() => {
    setTimeout(() => {
      if (showAlert) {
        setShowAlert(false);
        // setAlertFields({});
      }
    }, 3000);
  }, [showAlert]);

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
        <div className='flex justify-between'>
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
          <Button
            size='sm'
            variant='purple'
            onClick={(e: React.MouseEvent) => {
              setDataDetail({ ...dataDetail, action: "Add" });
              setShowModal(true);
            }}
          >
            Tambah Contact
          </Button>
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
                  <Button
                    onClick={(e: React.MouseEvent) => {
                      setShowModal(true);
                      setDataDetail({ ...contact, action: "Detail" });
                    }}
                  >
                    see detail
                  </Button>
                  <BsFillTrashFill
                    onClick={(e: React.MouseEvent) => {
                      setShowModal(true);
                      setDataDetail({ ...contact, action: "Delete" });
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
              title={
                dataDetail.action === "Delete"
                  ? "Are you sure to delete this data?"
                  : dataDetail.action === "Add"
                  ? "Add Data Contact"
                  : "Detail Contact"
              }
              size={"md"}
              content={""}
              showModal={showModal}
              setShowModal={setShowModal}
              handleClose={(e: React.MouseEvent) => {
                setShowModal(false);
                setDataDetail({} as ContactAction);
              }}
            >
              <div className='flex flex-col items-center gap-5 w-full'>
                {dataDetail.action === "Delete" ? (
                  <DeleteConfirmationBox
                    dataDeleted={dataDetail}
                    handleDelete={() => handleDelete(dataDetail.id)}
                    setShowAlert={setShowAlert}
                    setShowModal={setShowModal}
                  />
                ) : dataDetail.action === "Add" ? (
                  <ContactForm
                    contact={null}
                    handleSubmit={handleSubmit}
                    isDetail={false}
                    handleClose={() => {
                      setShowModal(false);
                      setDataDetail({} as ContactAction);
                    }}
                  />
                ) : (
                  <ContactForm
                    contact={dataDetail}
                    handleSubmit={handleSubmit}
                    isDetail={true}
                    handleClose={() => {
                      setShowModal(false);
                      setDataDetail({} as ContactAction);
                    }}
                  />
                )}
              </div>
            </Modal>
          )}

          {showAlert && (
            <Alert
              text={alertMessage ? alertMessage : "Success"}
              variant={"success"}
              direction={"top-right"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactList;

import React, { useContext, useReducer } from "react";
interface Contact {
  id: number;
  isFavorites: boolean;
  created_at: string;
  first_name: string;
  last_name: string;
  phones: any[];
  // other properties
}
const initialState = {
  contact: [] as Contact[],
};

// Define the type for your context data
type ContactContextType = {
  state: typeof initialState;
  addContactData: (data: any) => void;
  toggleFavorite: (id: number) => void;
  removeContactData: (id: number) => void;
  addSingleContact: (contact: any) => void;
};
const ContactContext = React.createContext<ContactContextType | null>(null);
const ADD_CONTACT_DATA = "ADD_CONTACT_DATA";
const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";
const REMOVE_CONTACT_DATA = "REMOVE_CONTACT_DATA";
const ADD_SINGLE_CONTACT = "ADD_SINGLE_CONTACT";

const contactReducer = (
  state: { contact: any },
  action: { type: any; payload: any }
) => {
  switch (action.type) {
    case ADD_CONTACT_DATA:
      return {
        ...state,
        contact: [...state.contact, ...action.payload],
      };
    case TOGGLE_FAVORITE:
      const updatedContact = state.contact.map((contact: any) => {
        if (contact.id === action.payload) {
          return {
            ...contact,
            isFavorites: !contact.isFavorites,
          };
        }
        return contact;
      });
      return {
        ...state,
        contact: updatedContact,
      };
    case ADD_SINGLE_CONTACT:
      const updatedContacts = state.contact.map((existingContact: any) => {
        if (existingContact.id === action.payload.id) {
          // Jika ID cocok, gantikan dengan kontak yang baru
          return action.payload;
        }
        return existingContact;
      });
      return {
        ...state,
        contact: updatedContacts,
      };
    case REMOVE_CONTACT_DATA:
      const filteredContact = state.contact.filter(
        (contact: any) => contact.id !== action.payload
      );
      return {
        ...state,
        contact: filteredContact,
      };
    default:
      return state;
  }
};

type ContactProviderProps = {
  children: React.ReactNode;
};

const ContactProvider = (props: ContactProviderProps) => {
  const [state, dispatch] = useReducer(contactReducer, initialState);

  const addContactData = (data: any) => {
    const contactsWithFavorites = data.map((contact: any) => ({
      ...contact,
      isFavorites: false,
    }));

    dispatch({ type: ADD_CONTACT_DATA, payload: contactsWithFavorites });
  };

  const toggleFavorite = (id: number) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: id });
  };

  const removeContactData = (id: number) => {
    dispatch({ type: REMOVE_CONTACT_DATA, payload: id });
  };

  const addSingleContact = (contact: any) => {
    dispatch({ type: ADD_SINGLE_CONTACT, payload: contact });
  };

  return (
    <ContactContext.Provider
      value={{
        state,
        addContactData,
        toggleFavorite,
        removeContactData,
        addSingleContact,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContact must be used within a ContactProvider");
  }
  return context;
};

export { ContactProvider, useContact };

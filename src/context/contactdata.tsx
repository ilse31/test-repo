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
};
const ContactContext = React.createContext<ContactContextType | null>(null);
const ADD_CONTACT_DATA = "ADD_CONTACT_DATA";
const TOGGLE_FAVORITE = "TOGGLE_FAVORITE";

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

  return (
    <ContactContext.Provider value={{ state, addContactData, toggleFavorite }}>
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

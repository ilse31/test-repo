import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import useContactData from "src/hooks/useContactData";
import ContactList from "./ContactList";
import { ContactProvider } from "src/context/contactdata";
import { MockedProvider } from "@apollo/client/testing";
import { GET_CONTACT_LIST } from "src/graphql";

describe("useContactList Hook", () => {
  const mocks = [
    {
      request: {
        query: GET_CONTACT_LIST,
        variables: {
          limit: 2,
          offset: 10,
          where: {
            _or: [{ first_name: { _ilike: "John" } }],
          },
        },
      },
      result: {
        data: {
          contact: [
            {
              created_at: "2023-10-18T13:29:31.152041+00:00",
              first_name: "XXXX",
              last_name: "XXX",
              phones: [
                {
                  number: "081234567890",
                  __typename: "contact",
                },
              ],
            },
          ],
        },
      },
    },
  ];

  it("renders without error", () => {
    const { getByTestId, getByText } = render(
      <ContactProvider>
        <MockedProvider mocks={mocks} addTypename={false}>
          <ContactList />
        </MockedProvider>
      </ContactProvider>
    );
    const listContact = getByTestId("contact-data");
    expect(listContact).toBeInTheDocument();
    expect(getByText("Goto Technical Test")).toBeInTheDocument();
  });
});

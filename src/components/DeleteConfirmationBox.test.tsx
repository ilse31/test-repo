import React from "react";
import { render, fireEvent } from "@testing-library/react";
import DeleteConfirmationBox from "./DeleteConfirmationBox";

// Mock the functions and data you need for testing
const mockProps = {
  setShowModal: jest.fn(),
  dataDeleted: {
    id: 1,
    first_name: "John",
    last_name: "Doe",
  },
  setShowAlert: jest.fn(),
  handleDelete: jest.fn(),
};

test("DeleteConfirmationBox component renders correctly", () => {
  const { getByText } = render(<DeleteConfirmationBox {...mockProps} />);

  // Ensure that the component renders with the correct data
  expect(getByText("John Doe")).toBeInTheDocument();

  // Find the "Cancel" and "Delete" buttons and ensure they are present
  const cancelButton = getByText("Cancel");
  const deleteButton = getByText("Delete");

  expect(cancelButton).toBeInTheDocument();
  expect(deleteButton).toBeInTheDocument();

  // Simulate a click on the "Cancel" button and check if setShowModal is called
  fireEvent.click(cancelButton);
  expect(mockProps.setShowModal).toHaveBeenCalledWith(false);

  // Simulate a click on the "Delete" button, check if handleDelete and setShowModal are called
  // and setShowAlert is called with true
  fireEvent.click(deleteButton);
  expect(mockProps.handleDelete).toHaveBeenCalledWith(1); // Ensure the correct ID is passed
  expect(mockProps.setShowModal).toHaveBeenCalledWith(false);
  expect(mockProps.setShowAlert).toHaveBeenCalledWith(true);
});

// You can add more test cases as needed

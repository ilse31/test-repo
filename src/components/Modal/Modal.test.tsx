import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Modal from "./Modal"; // Adjust the import path as needed

describe("Modal", () => {
  it("renders the modal content when showModal is true", () => {
    const handleClose = jest.fn();
    const { getByText, getByTestId } = render(
      <Modal
        title='Test Modal'
        size='sm'
        content='Test content'
        showModal={true}
        setShowModal={() => {}}
        handleClose={handleClose}
      />
    );

    // Ensure that the modal title and content are visible
    getByText("Test Modal");
    getByText("Test content");

    // Simulate a click on the close button
    const closeButton = getByTestId("close-button");
    fireEvent.click(closeButton);

    // Ensure that the handleClose function was called when the close button is clicked
    expect(handleClose).toHaveBeenCalled();
  });

  it("does not render the modal content when showModal is false", () => {
    const { queryByText } = render(
      <Modal
        title='Test Modal'
        size='sm'
        content='Test content'
        showModal={false}
        setShowModal={() => {}}
        handleClose={() => {}}
      />
    );

    // Ensure that the modal content is not in the DOM
    expect(queryByText("Test Modal")).toBeNull();
    expect(queryByText("Test content")).toBeNull();
  });
});

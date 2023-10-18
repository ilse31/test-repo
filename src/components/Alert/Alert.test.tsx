import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Alert from "./Alert";

describe("Alert Component", () => {
  it("renders an alert with the given text", () => {
    render(
      <Alert
        variant='success'
        direction='top-right'
        show={true}
        text='This is a test alert'
      />
    );
    const alertText = screen.getByText((content, element) => {
      // You can use a custom function to match the text more flexibly
      return content.includes("This is a test alert");
    });

    expect(alertText).toBeInTheDocument();
  });
});

it("displays the alert when 'show' prop is true", () => {
  render(
    <Alert
      variant='success'
      direction='top-right'
      show={true}
      text='This is a test alert'
    />
  );
  const alertText = screen.getByText((content, element) => {
    // You can use a custom function to match the text more flexibly
    return content.includes("This is a test alert");
  });

  expect(alertText).toBeInTheDocument();
});

it("hides the alert when 'show' prop is false", async () => {
  render(
    <Alert
      direction='top-right'
      text='This alert should be hidden'
      show={false}
    />
  );
  const alert = screen.queryByText("This alert should be hidden");
  expect(alert).toBeNull();
});

it("displays a success alert with the correct icon and color", () => {
  render(
    <Alert text='Success alert' direction='top-right' variant='success' />
  );
  const successIcon = screen.getByTestId("Success alert");
  expect(successIcon).toBeInTheDocument();
});

it("displays a warning alert with the correct icon and color", () => {
  render(
    <Alert direction='top-right' text='Warning alert' variant='warning' />
  );
  const warningIcon = screen.getByTestId("warning-icon");
  expect(warningIcon).toBeInTheDocument();
});

it("displays an error alert with the correct icon and color", () => {
  render(<Alert direction='top-right' text='Error alert' variant='error' />);
  const errorIcon = screen.getByTestId("error-icon");
  expect(errorIcon).toBeInTheDocument();
});

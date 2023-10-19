import React from "react";
import { render, screen } from "@testing-library/react";
import Input from "./InputForm";

describe("Input component", () => {
  it("renders with label", () => {
    const label = "Username";
    const { container } = render(<Input label={label} id='username' />);

    // Ensure the label is rendered
    const labelElement = screen.getByText(label);
    expect(labelElement).toBeInTheDocument();

    // Ensure the input field is present
    const inputElement = container.querySelector("input");
    expect(inputElement).toBeInTheDocument();
  });

  it("renders with helper text and error message", () => {
    const helperText = "Enter your username";
    const errorMessage = "Invalid username";
    const { container } = render(
      <Input
        label='Username'
        id='username'
        helperText={helperText}
        errorMessage={errorMessage}
      />
    );

    // Ensure the helper text is rendered
    const helperTextElement = screen.getByText(helperText);
    expect(helperTextElement).toBeInTheDocument();

    // Ensure the error message is rendered
    const errorMessageElement = screen.getByText(errorMessage);
    expect(errorMessageElement).toBeInTheDocument();
  });

  it("renders with left icon", () => {
    const leftIcon = "🔒"; // You can use any icon or string here
    const { container } = render(
      <Input label='Password' id='password' leftIcon={leftIcon} />
    );

    // Ensure the left icon is rendered
    const leftIconElement = screen.getByText(leftIcon);
    expect(leftIconElement).toBeInTheDocument();

    // Ensure the input field is present
    const inputElement = container.querySelector("input");
    expect(inputElement).toBeInTheDocument();
  });
});

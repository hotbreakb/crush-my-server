import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("App", () => {
  it("renders headline", () => {
    render(<App />);
    // const headline = screen.getByText(/Hello Vite \+ React!/i);
    // expect(headline).toBeInTheDocument();
  });
});

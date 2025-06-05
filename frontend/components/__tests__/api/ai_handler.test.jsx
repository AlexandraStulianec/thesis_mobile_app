import axios from "axios";
import { explainMistake } from "@/app/api/ai_handler";

jest.mock("axios");

describe("ai_handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should explain a mistake successfully", async () => {
    axios.post.mockResolvedValueOnce({
      data: { explanation: "You made a calculation mistake" },
    });

    const result = await explainMistake(
      "What is the limit of?",
      "x^2",
      "5",
      "4",
      2
    );

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("http://192.168.82.99:5000/explain_mistake"),
      {
        question: "What is the limit of?",
        expression: "x^2",
        user_answer: "5",
        correct_answer: "4",
        x_value: 2,
      }
    );
    expect(result).toBe("You made a calculation mistake");
  });
});

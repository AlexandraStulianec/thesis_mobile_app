import axios from "axios";
import { fetchData, fetchExercises } from "@/app/api/fetch_handler";

jest.mock("axios");

describe("fetchData", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return unit theory data correctly", async () => {
    const mockData = {
      data: {
        data: [
          {
            title:
              "We use limits to describe how a function behaves as its input approaches a certain value.",
            equation: "\\[\\lim_{{x \\to a}} f(x) = L\\]",
            example: "\\[ \\lim_{{x \\to 2}} (3x + 1) = 6 + 1 = 7\\]",
          },
          {
            title: "Sum Rule",
            equation:
              "\\[ \\lim_{{x \\to a}} [f(x) + g(x)] = \\lim_{{x \\to a}} f(x) + \\lim_{{x \\to a}} g(x) \\]",
            example:
              "\\[ \\lim_{{x \\to 3}} [(x + 1) + (2x - 1)] = 4 + 5 = 9 \\]",
          },
        ],
      },
    };

    axios.post.mockResolvedValue(mockData);

    const result = await fetchData(1);

    expect(axios.post).toHaveBeenCalledWith(
      "http://192.168.82.99:5000/get_units",
      { unit_id: 1 }
    );
    expect(result).toEqual(mockData.data.data);
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty("title");
    expect(result[0]).toHaveProperty("equation");
    expect(result[0]).toHaveProperty("example");
  });

  it("should return null when API fails", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    axios.post.mockRejectedValue(new Error("API Error"));

    const result = await fetchData(1);

    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe("fetchExercises", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch exercises with lessonId and add originalIndex", async () => {
    const mockData = {
      data: {
        exercises: [
          {
            id: 1,
            type: "find_limit",
            function_type: "polynomial",
            degree: 3,
            x_value: 3,
          },
          {
            id: 2,
            type: "find_limit",
            function_type: "fraction",
            degree_num: 3,
            degree_den: 2,
            x_value: 1,
          },
        ],
      },
    };

    axios.post.mockResolvedValue(mockData);

    const result = await fetchExercises(1, 1);

    expect(axios.post).toHaveBeenCalledWith(
      "http://192.168.82.99:5000/exercises",
      { unit_id: 1, lesson_id: 1 }
    );
    expect(result).toEqual([
      {
        id: 1,
        type: "find_limit",
        function_type: "polynomial",
        degree: 3,
        x_value: 3,
        originalIndex: 0,
      },
      {
        id: 2,
        type: "find_limit",
        function_type: "fraction",
        degree_num: 3,
        degree_den: 2,
        x_value: 1,
        originalIndex: 1,
      },
    ]);
    expect(result[0]).toHaveProperty("originalIndex", 0);
    expect(result[1]).toHaveProperty("originalIndex", 1);
  });

  it("should fetch lessons if no lessonId is provided", async () => {
    const mockData = {
      data: {
        lessons: [
          { title: "Basics of Limits I" },
          { title: "Basics of Limits II" },
        ],
      },
    };

    axios.post.mockResolvedValue(mockData);

    const result = await fetchExercises(1);

    expect(axios.post).toHaveBeenCalledWith(
      "http://192.168.82.99:5000/exercises",
      { unit_id: 1 }
    );
    expect(result[0]).toHaveProperty("originalIndex", 0);
    expect(result[1]).toHaveProperty("originalIndex", 1);
  });
});

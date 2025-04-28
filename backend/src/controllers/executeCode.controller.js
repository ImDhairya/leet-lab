import {pollBatchResults, submitBatch} from "../libs/judge0.lib.js";

export const executeCode = async (req, res) => {
  try {
    const {source_code, language_id, stdin, expected_outputs, problemId} =
      req.body;

    const userId = req.user.id;

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({
        error: "Invalid or missing test cases",
      });
    }

    // prepare each test cases for judge0

    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // submit to judge0 and get the results
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);

    // poll judge0 to check if the submission is done or not

    const results = await pollBatchResults(tokens);

    console.log(results, "Results");

    res.status(200).json({
      success: true,
      message: "Code executed successfully",
    });
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({
      error: "Error executing code",
    });
  }
};

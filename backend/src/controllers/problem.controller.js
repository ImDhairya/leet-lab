import {db} from "../libs/db.js";
import {getJudge0LanguageId, pollBatchResults, submitBatch} from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  // get all data from request body
  // check if the user role once again is it admin or not
  // loop through reference solution for each language
  if (req.user.role !== "ADMIN")
    return res
      .status(403)
      .json({error: "Unauthorized - Only admin can create a problem"});

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  try {
    // extracting the language and the solution code from referenceSolutions.
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({error: "Invalid language"});
      }
      // here we are mapping the testcases for example there are 3 test cases, each test case will have an input and an output and we are creating a submission for each test case.
      const submissions = testcases.map(({input, output}) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      // after extracting the
      // source code,
      //  expected output,
      // the input we got and the solution code (refrred to as source_code )
      //  from testcases, we are submitting the submission to judge0 (extracting everything from req.body)
      // the submit batch will give us the results as a batch of tokens.
      const submissionResults = await submitBatch(submissions); // a lot of tokens

      const tokens = submissionResults.map((res) => res.token);

      // we will wait and keep polling until the submission is done, either solved or failed.
      // once we are given the result and check if the result is of statusid other than 3, if that is the case we will return an error. indicating that the test case failed.

      const results = await pollBatchResults.map(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result-----", result);

        if (result.status.id !== 3) {
          return res
            .status(400)
            .json({error: `Testcase ${i + 1} failed for language ${language}`});
        }
      }
      // after all this we allow only the adimn to be able to add a problem to the db called as creating the problem
      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippets,
          referenceSolutions,
          languageId,
          userId: req.user.id,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Problem created successfully",
        problem: newProblem,
      });
    }
  } catch (error) {
    console.error("Error creating problem", error);
    res.status(500).json({error: "Error creating problem"});
  }
};

export const getAllProblems = (req, res) => {};

export const getProblemById = (req, res) => {};

export const updateProblem = (req, res) => {};

export const deleteProblem = (req, res) => {};

export const getAllProblemsSolvedByUser = (req, res) => {};

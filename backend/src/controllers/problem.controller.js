import {db} from "../libs/db.js";
import {getJudge0LanguageId} from "../libs/judge0.lib.js";

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
    userId,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res.status(400).json({error: "Invalid language"});
      }

      const submissions = testcases.map(({input, output}) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions); // a lot of tokens

      const tokens = submissionResults.map((res) => res.token);

      const results = await pollBatchResults.map(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res
            .status(400)
            .json({error: `Testcase ${i + 1} failed for language ${language}`});
        }
      }

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

      return res.status(201).json(newProblem);
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

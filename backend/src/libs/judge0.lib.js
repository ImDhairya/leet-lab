import axios from "axios";
export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVASCRIPT: 63,
    JAVA: 62,
  };

  return languageMap[language.toUppercase()];
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResults = async (tokens) => {
  // asking an endpoint to check if the submission is done or not again and again

  while (true) {
    const {data} = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        tokens: tokens.join(","),
        base64_encoded: false,
      }
    );

    const results = data.submissions;

    // every method returns true value when every element in the array is true

    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );

    if (isAllDone) return results;

    await sleep(1000);
  }
};

export const submitBatch = async (submissions) => {
  // we hit this end point 2 times, once for the token of each language it gives an array of objects
  // o
  const {data} = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    {
      submissions,
    }
  );

  console.log(data, "Submissions");
  return data; // [{token}, {token}]
};

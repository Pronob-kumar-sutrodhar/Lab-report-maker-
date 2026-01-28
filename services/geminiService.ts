import { GoogleGenAI } from "@google/genai";
import { LabData } from "../types";

const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  const getSuffix = (n: number) => {
    if (n > 3 && n < 21) return 'th';
    switch (n % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  };

  return `${day} ${getSuffix(day)} ${month} ${year}`;
};

const processLabReport = async (data: LabData): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Serialize inputs for the prompt
  const problemsInput = data.problems.map((p, i) => `
[PROBLEM ${i + 1}]
RAW_DESCRIPTION:
${p.description || "No description provided."}

RAW_CODE:
${p.code}
`).join('\n\n');

  const formattedDate = formatDate(new Date());
  const idPlaceholder = data.studentId.trim() || "ID";

  const prompt = `
Role:
You are an academic programming assistant. Generate a C++ lab report.

INPUT DATA:
Lab Number: ${data.labNumber}
Lab Title: ${data.labTitle}
Codeforces Link: ${data.codeforcesLink || "(Codeforces submission link will be added later)"}
Submission Date: ${formattedDate}

${problemsInput}

INSTRUCTIONS:
1. **Description**: Format the "RAW_DESCRIPTION" into a clear, academic problem statement. Preserve newlines, bullet points, and input/output specifications. Use bold text for labels like **Input:** or **Output:** if applicable.
2. **Code**: Insert "RAW_CODE" exactly as provided. Do not modify.
3. **Output Section**: Write a 1-sentence summary of the program's result inside the '* *'.
4. **Discussion**: Write a concise (2-3 lines) academic discussion on the concepts used.
5. **Structure**: Follow the REQUIRED FORMAT below exactly.

REQUIRED FORMAT:

## *Lab No : ${data.labNumber}*

## *Lab Title : ${data.labTitle}*

## *Code forces*
<p align="center">
<img alt="Codeforces Submission" src="">
</p>

## Link to submission :
${data.codeforcesLink || "(Codeforces submission link will be added later)"}

## *Submission Date : ${formattedDate}*

(Repeat the block below for each problem 1 to ${data.problems.length})

---
## *Problem [N] :*
<div align="justify">
[FORMATTED PROBLEM DESCRIPTION]
</div>

## *Code :*
\`\`\`C
[CODE]
\`\`\`

## *Output :* 
* [SHORT OUTPUT SUMMARY] *
<p align="center">
<img alt="${idPlaceholder}_lab${data.labNumber}_prob_[N]" src="">
</p>

## *Discussion :*
<div align="justify">
[ACADEMIC DISCUSSION]
</div>
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    if (response.text) {
      return response.text;
    } else {
      throw new Error("Empty response from Gemini.");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export { processLabReport };
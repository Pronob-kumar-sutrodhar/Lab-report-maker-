import { GoogleGenAI } from "@google/genai";
import { LabData } from "../types";

const processLabReport = async (data: LabData): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Construct the dynamic part of the prompt for problems
  const problemsPrompt = data.problems.map((prob, index) => `
---
## *Problem ${index + 1} :*
<div align="justify">
${prob.description || "N/A"}
</div>

## *Code :*
\`\`\`C
${prob.code}
\`\`\`

## *Output :* 
* [GENERATE A SHORT 1-SENTENCE DESCRIPTION OF WHAT THE OUTPUT SHOWS HERE] *
<p align="center">
<img alt="ID_lab${data.labNumber}_prob_${index + 1}" src="">
</p>

## *Discussion :*
<div align="justify">
[Write a very short academic discussion (2-3 lines only) explaining the core concept used in this specific code (e.g., dynamic memory, polymorphism, pointers).]
</div>
`).join('\n');

  const prompt = `
Role:
You are a C++ lab report assistant. Your task is to format the provided C++ lab problems exactly according to the strict template below.

RULES:
1. ❌ Do NOT rename variables, functions, or classes.
2. ❌ Do NOT refactor or simplify the code.
3. ✅ Keep the provided code EXACTLY as is.
4. ✅ STRICTLY follow the Markdown/HTML format provided below.
5. ✅ The Discussion section must be SHORT (2-3 lines max).
6. ✅ In the "Output" section, inside the '* *', write a brief description of the program's output.

Required Output Structure (Must Match Exactly):

## *Lab No : ${data.labNumber}*

## *Lab Title : ${data.labTitle}*

## *Code forces*
<p align="center">
<img alt="Codeforces Submission" src="">
</p>

## Link to submission :
${data.codeforcesLink || "(Codeforces submission link will be added later)"}

## *Submission Date : ${new Date().toLocaleDateString()}*

${problemsPrompt}

---

Instructions for placeholders:
- ID placeholder in image alt text: Use "ID_lab${data.labNumber}_prob_[ProblemNumber]".
- The Output section description inside '* *' should be concise (e.g., "* The program displays the factorial of the input number. *").

📥 Input Data Processing
- Use the code blocks provided above exactly.
- Ensure all HTML tags (div, p, img) are preserved exactly as written in the template.
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
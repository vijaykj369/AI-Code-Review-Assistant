const Groq = require('groq-sdk');
const env = require('../config/env');

const groq = new Groq({
  apiKey: env.groqApiKey,
});

// Helper function to normalize arrays
const normalizeArray = (arr = []) =>
  arr.map((item) =>
    typeof item === 'string'
      ? item
      : item.description ||
        item.message ||
        item.issue ||
        JSON.stringify(item)
  );

// =========================
// SINGLE CODE REVIEW
// =========================
const reviewCode = async ({ language, code }) => {
  try {
    console.log('🔥 Calling GROQ...');
    console.log('Key exists:', !!env.groqApiKey);

    const prompt = `
You are an expert software engineer.

IMPORTANT:
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT add explanations outside JSON.
- ALL arrays must contain STRINGS ONLY.

Return exactly this structure:

{
  "score": 0,
  "bugs": ["bug"],
  "securityIssues": ["issue"],
  "performanceIssues": ["issue"],
  "suggestions": ["suggestion"],
  "improvedCode": "complete improved code",
  "summary": "overall summary"
}

Review this ${language} code:

${code}
`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: {
        type: 'json_object',
      },
      temperature: 0,
    });

    console.log('========== RAW RESPONSE ==========');
    console.log(completion.choices[0].message.content);
    console.log('==================================');

    const result = JSON.parse(
      completion.choices[0].message.content
    );

    return {
      score: Number(result.score) || 0,
      bugs: normalizeArray(result.bugs),
      securityIssues: normalizeArray(result.securityIssues),
      performanceIssues: normalizeArray(result.performanceIssues),
      suggestions: normalizeArray(result.suggestions),
      improvedCode: result.improvedCode || code,
      summary: result.summary || '',
    };
  } catch (error) {
    console.error('GROQ CODE REVIEW ERROR:');
    console.error(error);

    return {
      score: 0,
      bugs: ['Failed to analyze code'],
      securityIssues: [],
      performanceIssues: [],
      suggestions: ['Please try again'],
      improvedCode: code,
      summary: 'AI review unavailable.',
    };
  }
};

// =========================
// REPOSITORY REVIEW
// =========================
const reviewRepository = async (files) => {
  try {
    const repositoryCode = files
      .map(
        (file) =>
          `FILE: ${file.path}\n${file.content}`
      )
      .join('\n\n');

    const prompt = `
You are a senior software architect.

IMPORTANT:
- Return ONLY valid JSON.
- Do NOT use markdown.
- Do NOT add explanations outside JSON.
- ALL arrays must contain STRINGS ONLY.

Return exactly this structure:

{
  "score": 0,
  "architectureFeedback": ["feedback"],
  "securityIssues": ["issue"],
  "performanceIssues": ["issue"],
  "suggestions": ["suggestion"],
  "summary": "overall repository summary"
}

Review this repository:

${repositoryCode}
`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: {
        type: 'json_object',
      },
      temperature: 0,
    });

    console.log('========== REPO RESPONSE ==========');
    console.log(completion.choices[0].message.content);
    console.log('===================================');

    const result = JSON.parse(
      completion.choices[0].message.content
    );

    return {
      score: Number(result.score) || 0,
      architectureFeedback: normalizeArray(
        result.architectureFeedback
      ),
      securityIssues: normalizeArray(
        result.securityIssues
      ),
      performanceIssues: normalizeArray(
        result.performanceIssues
      ),
      suggestions: normalizeArray(
        result.suggestions
      ),
      summary: result.summary || '',
    };
  } catch (error) {
    console.error('REPOSITORY REVIEW ERROR:');
    console.error(error);

    return {
      score: 0,
      architectureFeedback: ['Repository analysis failed'],
      securityIssues: [],
      performanceIssues: [],
      suggestions: ['Please try again'],
      summary: 'Repository review unavailable.',
    };
  }
};

module.exports = {
  reviewCode,
  reviewRepository,
};
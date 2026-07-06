const Groq = require('groq-sdk');
const env = require('../config/env');

const groq = new Groq({
  apiKey: env.groqApiKey,
});

// =========================
// HELPERS
// =========================

const normalizeArray = (arr = []) =>
  (Array.isArray(arr) ? arr : []).map((item) =>
    typeof item === 'string'
      ? item
      : item?.description ||
        item?.message ||
        item?.issue ||
        JSON.stringify(item)
  );

// Clamp score strictly between 0–100
const clampScore100 = (score) => {
  const num = Number(score);
  if (isNaN(num)) return 0;
  return Math.max(0, Math.min(100, Math.round(num)));
};

// =========================
// SINGLE CODE REVIEW
// =========================

const reviewCode = async ({ language, code }) => {
  try {
    console.log('🔥 Calling GROQ...');
    console.log('Key exists:', !!env.groqApiKey);

    const prompt = `
You are an expert software engineer.

IMPORTANT RULES:
- Return ONLY valid JSON.
- No markdown.
- No explanations outside JSON.
- Score MUST be an INTEGER between 0 and 100.

STRICT OUTPUT FORMAT:

{
  "score": 0,
  "bugs": ["string"],
  "securityIssues": ["string"],
  "performanceIssues": ["string"],
  "suggestions": ["string"],
  "improvedCode": "string",
  "summary": "string"
}

Analyze this ${language} code:

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

    console.log('========== RAW CODE RESPONSE ==========');
    console.log(completion.choices[0].message.content);
    console.log('=======================================');

    const result = JSON.parse(completion.choices[0].message.content);

    return {
      score: clampScore100(result.score),

      bugs: normalizeArray(result.bugs),
      securityIssues: normalizeArray(result.securityIssues),
      performanceIssues: normalizeArray(result.performanceIssues),
      suggestions: normalizeArray(result.suggestions),

      improvedCode: result.improvedCode || code,
      summary: result.summary || '',
    };
  } catch (error) {
    console.error('GROQ CODE REVIEW ERROR:', error);

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
    const limitedFiles = files
      .filter((file) => file.content && file.content.length > 0)
      .slice(0, 5);

    if (limitedFiles.length === 0) {
      return {
        score: 0,
        architectureFeedback: ['No supported files found'],
        securityIssues: [],
        performanceIssues: [],
        suggestions: [],
        summary: 'Repository contains no supported source files.',
      };
    }

    console.log(`📁 Reviewing ${limitedFiles.length} files`);

    console.log(
      'Review files:',
      limitedFiles.map((f) => `${f.path} (${f.content.length} chars)`)
    );

    const repositoryCode = limitedFiles
      .map((file) => `FILE: ${file.path}\n${file.content}`)
      .join('\n\n');

    const prompt = `
You are a senior software architect.

Analyze this repository architecture.

IMPORTANT RULES:
- Return ONLY valid JSON.
- No markdown.
- No explanations outside JSON.
- Score MUST be an INTEGER between 0 and 100.

Analyze:
1. Project structure
2. Frontend architecture
3. Backend architecture
4. Authentication
5. Database design
6. Security
7. Performance
8. Scalability
9. Maintainability

STRICT OUTPUT FORMAT:

{
  "score": 0,
  "architectureFeedback": ["string"],
  "securityIssues": ["string"],
  "performanceIssues": ["string"],
  "suggestions": ["string"],
  "summary": "string"
}

Repository:

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

    console.log('========== RAW REPO RESPONSE ==========');
    console.log(completion.choices[0].message.content);
    console.log('=======================================');

    const result = JSON.parse(completion.choices[0].message.content);

    return {
      score: clampScore100(result.score),

      architectureFeedback: normalizeArray(result.architectureFeedback),
      securityIssues: normalizeArray(result.securityIssues),
      performanceIssues: normalizeArray(result.performanceIssues),
      suggestions: normalizeArray(result.suggestions),

      summary: result.summary || '',
    };
  } catch (error) {
    console.error('REPOSITORY REVIEW ERROR:', error);

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

// =========================
// EXPORTS
// =========================

module.exports = {
  reviewCode,
  reviewRepository,
};
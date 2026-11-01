function summarizeWithGemini(articleText) {

  const apiKey = PropertiesService
    .getScriptProperties()
    .getProperty("GEMINI_API_KEY");

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not found in Script Properties.");
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=" + apiKey;

  const prompt = `
You are an AI news editor.

Summarize the following AI news article in 2-3 concise sentences.

Focus on:
- What happened
- Why it matters
- Important companies, people, or technologies involved

Do not make up information.
Do not use headings.
Keep the tone professional, clear, and easy to understand.

Article:
${articleText}
`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);

  const responseCode = response.getResponseCode();
  const responseText = response.getContentText();

  if (responseCode !== 200) {
    Logger.log("Gemini error: " + responseText);
    return "AI summary could not be generated.";
  }

  const result = JSON.parse(responseText);

  if (
    result.candidates &&
    result.candidates[0] &&
    result.candidates[0].content &&
    result.candidates[0].content.parts
  ) {
    return result.candidates[0].content.parts[0].text;
  }

  return "AI summary could not be generated.";
}


function testGemini() {

  const result = summarizeWithGemini(
    "Artificial Intelligence is transforming healthcare by helping doctors detect diseases earlier."
  );

  Logger.log("Gemini Test Result:");
  Logger.log(result);
}
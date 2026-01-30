const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async function(event) {

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body || "{}");

    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ erro: "Prompt não enviado." })
      };
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um professor experiente do ensino fundamental."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resposta: completion.choices[0].message.content
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: err.message })
    };
  }
};

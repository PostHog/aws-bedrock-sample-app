import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "<YOUR_AWS_REGION>" });

export async function POST(request) {
  const { ingredients, email } = await request.json();

  const prompt = `Generate a recipe using these ingredients: ${ingredients}.`;
  const modelId = "meta.llama3-1-8b-instruct-v1:0"
  try {
    const input = {
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt,
        max_gen_len: 512,
        temperature: 0.5,
        top_p: 0.9,
      }),
    };
    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    const rawRes = response.body;
    const jsonString = new TextDecoder().decode(rawRes);
    const parsedJSON = JSON.parse(jsonString);

    return new Response(jsonString, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate recipe' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
  }
}
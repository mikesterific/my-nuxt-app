import axios from 'axios';

interface Message {
  role: string;
  content: string;
}

export async function sendOpenAIMessage(
  conversation: Message[],
  apiKey: string
): Promise<string> {
  const temperatureStr = import.meta.env.VITE_TEMPERATURE;
  const temperature = parseFloat(temperatureStr);

  if (isNaN(temperature)) {
    throw new Error(`Invalid temperature value: ${temperatureStr}`);
  }

  console.log('Temperature:', temperature);

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o',
      messages: conversation,
      max_tokens: 3000,
      temperature: temperature,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  return response.data.choices[0].message.content.trim();
}

export function cosineSimilarity(
  vecA: number[],
  vecB: number[] | string
): number {
  if (typeof vecB === 'string') {
    vecB = JSON.parse(vecB);
  }

  if (!Array.isArray(vecB)) {
    throw new Error('vecB must be an array of numbers');
  }

  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));

  return dotProduct / (magA * magB);
}

export function determineComponentType(content: string): 'vue' | 'node' {
  return content.includes('export default') || content.includes('<template>')
    ? 'vue'
    : 'node';
}

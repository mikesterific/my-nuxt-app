import axios from 'axios';

export function extractCodeBlock(responseContent) {
  const codeBlockRegex = /```.*?\n(.*)```/s;

  const match = responseContent.match(codeBlockRegex);
  if (match) {
    let codeBlock = match[1].trim();

    // Modify the component path in import statements
    codeBlock = codeBlock.replace(
      /import\s+(\w+)\s+from\s+['"](.+?)['"]/g,
      (match, component, path) => {
        const modifiedPath = `'../components/${component}.vue'`;
        return `import ${component} from ${modifiedPath}`;
      }
    );

    return codeBlock;
  }

  return null;
}

// export async function fetchOpenAIResponse(conversation, apiKey) {
//   try {
//     const temperature = import.meta.env.VITE_TEMPERATURE;
//     console.log('parseFloat(temperature)', parseFloat(temperature));
//     const response = await axios.post(
//       'https://api.openai.com/v1/chat/completions',
//       {
//         model: 'gpt-4o',
//         messages: conversation,
//         max_tokens: 1000,
//         temperature: parseFloat(temperature),
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${apiKey}`,
//         },
//       }
//     );

//     // Validate response structure
//     if (
//       !response.data ||
//       !response.data.choices ||
//       !Array.isArray(response.data.choices) ||
//       response.data.choices.length === 0 ||
//       !response.data.choices[0].message ||
//       !response.data.choices[0].message.content
//     ) {
//       throw new Error('Invalid response format from OpenAI API');
//     }

//     return response.data.choices[0].message.content.trim();
//   } catch (error) {
//     console.error('Error communicating with OpenAI API:', error);
//     throw error;
//   }
// }

import OpenAI from 'openai';
import { Message } from 'openai/resources/beta/threads/messages';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const truncateJSON = (data: any): any => {
  const stringified = JSON.stringify(data);
  if (stringified.length > 6000) {
    if (Array.isArray(data)) {
      return data.slice(0, 3).map(item => truncateJSON(item));
    } else if (typeof data === 'object' && data !== null) {
      const truncated: any = {};
      const entries = Object.entries(data);
      entries.slice(0, 10).forEach(([key, value]) => {
        truncated[key] = truncateJSON(value);
      });
      if (entries.length > 10) {
        truncated['...'] = `${entries.length - 10} more fields`;
      }
      return truncated;
    }
  }
  return data;
};

const generateStructureAnalysis = (data: any): string => {
  const type = Array.isArray(data) ? 'array' : typeof data;
  if (type === 'object' && data !== null) {
    const fields = Object.keys(data);
    return `Structure type: Object\nFields: ${fields.join(', ')}`;
  } else if (type === 'array' && data.length > 0) {
    return `Structure type: Array\nLength: ${data.length}\nItem type: ${typeof data[0]}`;
  }
  return `Structure type: ${type}`;
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const generateDocumentation = async (artifactData: any, artifactName: string) => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const truncatedData = truncateJSON(artifactData);
      const structureAnalysis = generateStructureAnalysis(artifactData);
      const dataJson = JSON.stringify(truncatedData, null, 2);

      // Create a thread
      const thread = await openai.beta.threads.create();

      // Add a message to the thread
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: `Crie uma documentação concisa para "${artifactName}".

Análise Estrutural:
${structureAnalysis}

Amostra de dados:
\`\`\`json
${dataJson}
\`\`\`

Diretrizes de formato:
- Use # para cabeçalhos principais
- Use ## para subcabeçalhos
- Use ### para subseções
- Use ** ** para texto em negrito
- Use \` \` para código inline
- Use \`\`\` para blocos de código
- Use - para listas
- Mantenha os parágrafos curtos e focados

Mantenha a documentação clara e focada nas informações essenciais.`
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: "asst_k31W6QD9IaqDFDOfUcXPeon0"
      });

      // Poll for completion with timeout
      const startTime = Date.now();
      const TIMEOUT = 30000; // 30 seconds timeout
      let documentation = '';

      while (true) {
        if (Date.now() - startTime > TIMEOUT) {
          throw new Error('Documentation generation timed out');
        }

        const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        
        if (runStatus.status === 'completed') {
          // Get the messages
          const messages = await openai.beta.threads.messages.list(thread.id);
          // Get the last assistant message
          const lastMessage = messages.data
            .filter((message: Message) => message.role === 'assistant')
            .sort((a: Message, b: Message) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

          if (lastMessage?.content?.[0]?.type === 'text') {
            documentation = lastMessage.content[0].text.value;
            break;
          } else {
            throw new Error('Invalid response format from assistant');
          }
        } else if (runStatus.status === 'failed' || runStatus.status === 'cancelled' || runStatus.status === 'expired') {
          throw new Error(`Assistant run failed with status: ${runStatus.status}`);
        }

        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!documentation) {
        throw new Error('No documentation generated');
      }

      // Apenas limpa formatações indesejadas e mantém as necessárias
      documentation = documentation
        .replace(/>/g, '')        // Remove blockquote markers
        .replace(/^\s*[-•]\s*/gm, '- ')     // Padroniza bullets para hífen
        .trim();

      return documentation;
    } catch (error: any) {
      retries++;
      console.error(`Attempt ${retries} failed:`, error);

      if (retries === MAX_RETRIES) {
        throw new Error(`Failed to generate documentation after ${MAX_RETRIES} attempts: ${error.message}`);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }

  throw new Error('Failed to generate documentation');
};

export const updateDocumentation = async (
  artifactData: any,
  artifactName: string,
  currentDocumentation: string,
  updateRequest: string
) => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const truncatedData = truncateJSON(artifactData);
      const dataJson = JSON.stringify(truncatedData, null, 2);

      // Create a thread
      const thread = await openai.beta.threads.create();

      // Add context message
      await openai.beta.threads.messages.create(thread.id, {
        role: "user",
        content: `Documentação atual para "${artifactName}":

${currentDocumentation}

Contexto de dados:
\`\`\`json
${dataJson}
\`\`\`

Requisição de melhoria: ${updateRequest}

Diretrizes de formato:
- Use # para cabeçalhos principais
- Use ## para subcabeçalhos
- Use ### para subseções
- Use ** ** para texto em negrito
- Use \` \` para código inline
- Use \`\`\` para blocos de código
- Use - para listas
- Mantenha os parágrafos curtos e focados

Mantenha a documentação clara e focada nas informações essenciais.

Instruções:
- Manter a estrutura e o formato da documentação existente
- Manter todas as seções existentes (VISÃO GERAL, ESTRUTURA DE DADOS, etc.)
- Atualizar ou adicionar informações com base na solicitação
- Retornar a documentação completa atualizada
- Preservar quaisquer detalhes técnicos não relacionados à atualização`
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: "asst_k31W6QD9IaqDFDOfUcXPeon0",
        instructions: "Você é um especialista em documentação técnica. Atualize a documentação existente com base na solicitação do usuário, mantendo a estrutura e o formato originais. Retorne a documentação completa e atualizada."
      });

      // Poll for completion with timeout
      const startTime = Date.now();
      const TIMEOUT = 30000; // 30 seconds timeout
      let updatedDocumentation = '';

      while (true) {
        if (Date.now() - startTime > TIMEOUT) {
          throw new Error('Documentation update timed out');
        }

        const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        
        if (runStatus.status === 'completed') {
          // Get the messages
          const messages = await openai.beta.threads.messages.list(thread.id);
          // Get the last assistant message
          const lastMessage = messages.data
            .filter((message: Message) => message.role === 'assistant')
            .sort((a: Message, b: Message) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

          if (lastMessage?.content?.[0]?.type === 'text') {
            updatedDocumentation = lastMessage.content[0].text.value;
            break;
          } else {
            throw new Error('Invalid response format from assistant');
          }
        } else if (runStatus.status === 'failed' || runStatus.status === 'cancelled' || runStatus.status === 'expired') {
          throw new Error(`Assistant run failed with status: ${runStatus.status}`);
        }

        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (!updatedDocumentation) {
        throw new Error('No documentation generated');
      }

      // Apenas limpa formatações indesejadas e mantém as necessárias
      updatedDocumentation = updatedDocumentation
        .replace(/>/g, '')        // Remove blockquote markers
        .replace(/^\s*[-•]\s*/gm, '- ')     // Padroniza bullets para hífen
        .trim();

      return updatedDocumentation;
    } catch (error: any) {
      retries++;
      console.error(`Attempt ${retries} failed:`, error);

      if (retries === MAX_RETRIES) {
        throw new Error(`Failed to update documentation after ${MAX_RETRIES} attempts: ${error.message}`);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }

  throw new Error('Failed to update documentation');
};
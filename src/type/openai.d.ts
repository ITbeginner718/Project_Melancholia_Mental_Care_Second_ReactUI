
declare module 'openai' {
  export class Configuration {
      constructor(options: { apiKey: string });
  }

  export class OpenAIApi {
      constructor(configuration: Configuration);

      createCompletion(options: {
          model: string;
          prompt: string;
          max_tokens: number;
      }): Promise<{ data: { choices: { text: string }[] } }>;
  }
}
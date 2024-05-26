import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
const nlp = require('compromise');

// @Injectable()
// export class OpenAIService {
//   private readonly apiKey: string = process.env.OPENAI_API_KEY;
//   private readonly maxTokens: number = parseInt(process.env.MAX_TOKEN);
//   private readonly temperature: number = parseFloat(process.env.TEMPERATURE);
//
//   async generateSummary(
//     text: string,
//   ): Promise<{ summary: string; isVacation: boolean }> {
//     try {
//       const response = await axios.post(
//         'https://api.openai.com/v1/chat/completions',
//         {
//           model: 'gpt-3.5-turbo',
//           messages: [
//             { role: 'system', content: 'This is a summary task.' },
//             { role: 'user', content: `Summarize this text: ${text}` },
//           ],
//           max_tokens: 3000,
//           temperature: 0.9,
//         },
//         { headers: { Authorization: `Bearer ${this.apiKey}` } },
//       );
//
//       const choice = response.data.choices[0];
//       if (!choice || !choice.message) {
//         console.error('No valid message received in the response');
//         return {
//           summary:
//             'Summary generation failed due to an unexpected response structure.',
//           isVacation: false,
//         };
//       }
//
//       const nlpResult = this.processTextWithNLP(choice.message.content);
//       return { summary: nlpResult.text, isVacation: nlpResult.isVacation };
//     } catch (error) {
//       console.error(
//         'Error while generating summary:',
//         error.response?.status,
//         error.response?.data,
//       );
//       if (!error.response) {
//         console.error('Error details:', error.message);
//       }
//       throw new HttpException(
//         'Failed to generate summary',
//         HttpStatus.INTERNAL_SERVER_ERROR,
//       );
//     }
//   }
//
//   processTextWithNLP(text: string): { text: string; isVacation: boolean } {
//     let doc = nlp(text);
//     let isVacation = doc.has('concediu');
//
//     let filteredText = doc
//       .sentences()
//       .filter((sentence) => !sentence.has('?'))
//       .out('text');
//
//     return { text: filteredText.trim(), isVacation };
//   }
// }
import {HttpService} from '@nestjs/axios';

@Injectable()
export class OpenAIService {
  constructor(private httpService: HttpService) {}

  async generateSummary(text: string): Promise<{ summary: string; isVacation: boolean }> {
    try {
      // Actualizează URL-ul cu adresa serverului Flask
      const response = await this.httpService.post('http://127.0.0.1:5000/summarize', { text }).toPromise();
      // Presupunem că API-ul Flask întoarce un obiect JSON cu un câmp `summary`
      return {
        summary: response.data.summary,
        isVacation: false  // Modifică aceasta în funcție de cum vrei să detectezi vacanțele
      };
    } catch (error) {
      console.error('Error while generating summary:', error.response?.status, error.response?.data);
      if (!error.response) {
        console.error('Error details:', error.message);
      }
      throw new HttpException('Failed to generate summary', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Dacă mai ai nevoie să procesezi textul pentru a detecta informații despre concedii
  processTextWithNLP(text: string): { text: string; isVacation: boolean } {
    const doc = nlp(text);
    const isVacation = doc.has('concediu');
    const filteredText = doc.sentences().filter((sentence) => !sentence.has('?')).out('text');

    return { text: filteredText.trim(), isVacation };
  }
}


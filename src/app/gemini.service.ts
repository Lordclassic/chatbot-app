import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private generativeAI: GoogleGenerativeAI;
  private messageHistory: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
    console.log('API Key:', environment.YOUR_API_KEY); // Make sure your key is being logged correctly
    this.generativeAI = new GoogleGenerativeAI(environment.YOUR_API_KEY);
  }

  async generateText(prompt: string) {
    const model = this.generativeAI.getGenerativeModel({ model: 'gemini-pro' });

    // Push user message to history
    const timestamp = new Date().toLocaleTimeString();
    this.messageHistory.next({
      from: 'user',
      message: prompt,
      timestamp: timestamp,
    });

    try {
      // Get the content from the AI model
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text(); // Extract the text response

      console.log(text);

      // Handle possible issues with text (like null or undefined)
      if (text) {
        text = this.formatText(text); // Apply formatting (e.g., replace * with empty string)
      } else {
        text = 'Sorry, I couldn’t get a response.'; // Default message if no text
      }

      // Push bot message to history

      this.messageHistory.next({
        from: 'bot',
        message: text,
      });
    } catch (error) {
      console.error('Error in Gemini API call:', error);
      this.messageHistory.next({
        from: 'bot',
        message:
          'There was an error generating a response. Please try again later.',
      });
    }
  }

  // Utility function to handle formatting issues in the text
  private formatText(text: string): string {
    // Replace * with an empty string if present in the text
    return (text || '').replace(/\*/g, '');
  }

  public getMessageHistory(): Observable<any> {
    return this.messageHistory.asObservable();
  }
}

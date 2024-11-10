import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShowcaseComponent } from './showcase.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GeminiService } from './gemini.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShowcaseComponent, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'chatbot-app';

  prompt: string = '';

  geminiService: GeminiService = inject(GeminiService);

  loading: boolean = false;

  chatHistory: any[] = [];
  constructor() {
    this.geminiService.getMessageHistory().subscribe((res) => {
      if (res) {
        this.chatHistory.push(res);
      }
    });
  }
  async sendData() {
    if (this.prompt && !this.loading) {
      this.loading = true;
      const data = this.prompt;
      this.prompt = '';
      await this.geminiService.generateText(data);
      this.loading = false;
    }
  }
  formatText(text: any) {
    const result = String(text || '').replace(/\*/g, ''); // Convert text to a string
    return result;
  }

  isCodeSnippet(message: string): boolean {
    return message.startsWith('```') && message.endsWith('```');
  }

  formatCode(message: string): string {
    // Remove triple backticks and language if specified, e.g., ```html
    const formattedMessage = message.replace(/^```[a-z]*|```$/g, '');

    // Escape HTML characters to ensure they render as text and not HTML
    return formattedMessage
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\n/g, '<br>') // Add line breaks for newlines
      .replace(/\s/g, '&nbsp;');
  }
}

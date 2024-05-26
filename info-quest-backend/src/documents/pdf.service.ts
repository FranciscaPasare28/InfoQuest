import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
const pdfParse = require('pdf-parse');
@Injectable()
export class PdfService {
  constructor(
    private readonly usersService: UsersService, // Presupunând că ai un serviciu care gestionează utilizatorii
  ) {}
  async extractText(fileBuffer: Buffer): Promise<string> {
    try {
      const data = await pdfParse(fileBuffer);
      return data.text; // 'data.text' conține textul extras din documentul PDF
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  async extractVacationData(text: string): Promise<void> {
    const vacationSectionRegex = /Angajat\s(.*?):\s*([\s\S]*?)(?=Angajat|$)/g;
    let match;

    while ((match = vacationSectionRegex.exec(text))) {
      const name = match[1].trim();
      const vacationDatesText = match[2];
      const vacationDates = vacationDatesText.match(/\d{4}-\d{2}-\d{2}/g);
      const user = await this.usersService.findByName(name);
      if (user) {
        await this.usersService.addVacationDays(user.id, vacationDates);
      }
    }
  }
}

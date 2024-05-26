// src/leave-request/leave-request.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CertificateService } from './certificate.service';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  async submitcertificate(@Body() requestBody: { name: string; startDate: string;  purpose: string}) {
    try {
      const { name, startDate, purpose} = requestBody;
      await this.certificateService.sendCertificateEmail(name, startDate, purpose);
    } catch (error) {
      throw new HttpException('Email sending failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

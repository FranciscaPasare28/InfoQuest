// src/leave-request/leave-request.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class CertificateService {
  async sendCertificateEmail(name: string, startDate: string, purpose: string): Promise<void> {
    // Create transporter with email server settings
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'franci.pasare@gmail.com',
        pass: 'snoc wdiz vqmc bswr'
      },
    });

    // Define email options
    const mailOptions = {
      from: '"Francisca Pasare" <infoquest.testmail@gmail.com>',
      to: 'franci.pasare@gmail.com',
      subject: 'New Certificate Submitted',
      text: `Hello,\n My name is ${name}, and I am writing to request the issuance of a certificate. I would need this certificate to be issued starting from the date: ${startDate}.\nThe purpose of this certificate is as follows:\n${purpose}\nThank you for your assistance in this matter. Please let me know if there is any further information you require.\nBest regards,\n${name}`
    };

    await transporter.sendMail(mailOptions);
  }
}

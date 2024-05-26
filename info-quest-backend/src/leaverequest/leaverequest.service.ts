// src/leave-request/leave-request.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class LeaveRequestService {
  async sendLeaveRequestEmail(name: string, startDate: string, endDate: string): Promise<void> {
    // Create transporter with email server settings
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or your preferred email service
      auth: {
    user: 'franci.pasare@gmail.com',
    pass: 'snoc wdiz vqmc bswr'
      },
    });

    // Define email options
    const mailOptions = {
      from: '"Francisca Pasare" <infoquest.testmail@gmail.com>',
      to: 'franci.pasare@gmail.com', // The email address to receive leave requests
      subject: 'New Leave Request Submitted',
      text: `Hello,\nPlease consider my request for leave as per the details below:\nEmployee Name: ${name}\nLeave period: ${startDate} - ${endDate}\nEmployee ${name} requested leave from ${startDate} to ${endDate}.\nI would like to thank you in advance for considering the request.\nHave a good day!.`,
    };
    // Send the email
    await transporter.sendMail(mailOptions);
  }
}

import { Controller, Get, Post, Body } from '@nestjs/common';

const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'franci.pasare@gmail.com',
    pass: 'snoc wdiz vqmc bswr'
  },
  tls: {
    rejectUnauthorized: false
  }
});

let mailOptions = {
  from: '"Francisca Pasare" <infoquest.testmail@gmail.com>',
  to: 'franci.pasare@gmail.com',
  subject: 'Subject here',
  text: 'Body goes here'
};

@Controller('mail')
export class MailController {

  @Get('findAll')
  findAll(): string {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });

    return 'This is a GET request';
  }

  @Post()
  create(@Body() data: any): string {
    return `This is a POST request with data: ${JSON.stringify(data)}`;
  }
}
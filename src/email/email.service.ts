/* eslint-disable no-console */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

@Injectable()
export class EmailService {
  // Send email
  public async sendEmailOrThrow({
    to,
    subject,
    html,
    text,
  }: {
    to: string[];
    subject: string;
    html: string;
    text?: string;
  }): Promise<void> {
    try {
      await resend.emails.send({
        from: process.env.MAILER_ADDRESS ?? '',
        to: to,
        subject: subject,
        html: html,
        text: text,
      });
    } catch (e) {
      return Promise.reject(
        new InternalServerErrorException(`Not able to send email ${e}`),
      );
    }
  }
}

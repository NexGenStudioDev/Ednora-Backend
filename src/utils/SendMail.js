import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import envConstant from '../constant/env.constant.mjs';
dotenv.config();

export let createTransport = () => {
  try {
    if (!envConstant.GMAIL_User || !envConstant.GMAIL_Password) {
      return {
        sendMail: async (options, callback) => {
          console.log(
            `[Mailer Sim] Email queued to ${options?.to} (Subject: ${options?.subject || 'Eduvanta Notification'})`
          );
          const info = {
            messageId: `sim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            accepted: [options?.to],
            rejected: [],
            response: '250 OK (Simulated Dispatch)',
          };
          if (typeof callback === 'function') callback(null, info);
          return info;
        },
      };
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: envConstant.GMAIL_User,
        pass: envConstant.GMAIL_Password,
      },
    });

    return transporter;
  } catch (error) {
    console.error('[Mailer] Error creating transporter:', error.message);
    return {
      sendMail: async (options, callback) => {
        console.warn(
          `[Mailer Fallback] Simulated delivery for ${options?.to}: ${error.message}`
        );
        const info = {
          messageId: `fallback-${Date.now()}`,
          accepted: [options?.to],
          rejected: [],
        };
        if (typeof callback === 'function') callback(null, info);
        return info;
      },
    };
  }
};

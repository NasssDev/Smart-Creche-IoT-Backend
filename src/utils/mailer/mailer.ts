// import * as nodemailer from "nodemailer";
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
import { logger } from '../logger';

class Mailer {
   constructor(
      public to?: string,
      public subject?: string,
      public message?: string,
      public cc?: string,
      public attachments?: any
   ) {}

   async sendMail(options?) {
      let mailOptions = options || {
         from: 'xfeatapp@gmail.com',
         to: this.to,
         subject: this.subject,
         html: this.message,
         cc: this.cc,
         attachments: this.attachments
      };

      // const transporter = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     type: "OAuth2",
      //     clientId:
      //       "864488994318-c1d32lsq1fs5u8aal31a0h79vo58tvft.apps.googleusercontent.com",
      //     clientSecret: "Ux3yrmkFzOnKE-Tkx2I5199w",
      //     expires: 1484314697598,
      //     user: "noreply@drongo.io",
      //     refreshToken:
      //       "1//0409mTUmW8Q1dCgYIARAAGAQSNwF-L9IrHnhQD9e4CAyM1H_IKFRLpq--Yn6HYMBgShD012vN1UsRyGH0T_gq4KJQ4CPAZR9I9CA",
      //     accessToken:
      //       "ya29.a0ARrdaM_DbXup67Dggc_jJ97gvO8vW6g2SV--vHne37WsIz3xALjEhG-namhfdKpste_MgTEPzksbbJjCgZs6dl7sRu6eH7EiT7UUA6P9L70ely6LW0JHyq6uxS84eWGmvhGE9JjvAdNVFTe-FEz78uSfZWtR",
      //   },
      // });

      // const transporter = nodemailer.createTransport({
      //   service: 'SendGrid',
      //   auth: {
      //     user: "0cl2OsmlRGa9FcbDIHW46A",
      //     pass: "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"
      //   }
      // });

      try {
         // await transporter.sendMail(mailOptions);
         await sgMail.send(mailOptions);
         logger.info(`Mail sent ${this.to}`);
         return;
      } catch (error) {
         logger.error(`Error while sending email ${error}`);
         throw error;
      }
   }
}

export default new Mailer();

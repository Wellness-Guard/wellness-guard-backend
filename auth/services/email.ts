const GOOGLE = 'gmail.com';
const HOTMAIL = 'hotmail.com';
const YAHOO = 'yahoo.com';
const OUTLOOK = 'outlook.com';
const LIVE = 'live.com';

export class Email {
     static checkProvider(email: string) {
          const proivder = email.split('@')[1];
          return [GOOGLE, YAHOO, HOTMAIL, OUTLOOK, LIVE].includes(proivder) ? true : false;
     }
}

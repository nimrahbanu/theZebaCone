# EmailJS setup

The contact form is in demo mode until you add your own EmailJS identifiers. The browser SDK uses the public key only; do not place an EmailJS private key or an email account password in this website.

1. Create an EmailJS account and connect the email service you want to receive enquiries at.
2. Create an email template. Set the recipient to your inbox and include these template variables in the message body: `{{name}}`, `{{email}}`, `{{phone}}`, `{{event_date}}`, `{{service}}`, and `{{message}}`.
3. Copy the Public Key, Service ID, and Template ID into `site-config.js`, replacing the three `YOUR_EMAILJS_...` placeholders.
4. Serve the site from localhost or your deployed HTTPS domain and submit a test enquiry. The form reports success only after EmailJS returns a successful response.

The form uses EmailJS's official browser SDK `sendForm` interface. See the [SDK installation guide](https://www.emailjs.com/docs/sdk/installation/), [sendForm reference](https://www.emailjs.com/docs/sdk/send-form/), and [template variables guide](https://www.emailjs.com/docs/user-guide/dynamic-variables-templates/).

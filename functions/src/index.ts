const functions = require("firebase-functions");
const admin = require("firebase-admin");
// eslint-disable-next-line import/order
const cors = require("cors")({ origin: true });

admin.initializeApp();

const {
  gmail: { email: gmailEmail, password },
} = functions.config();

const send = require("gmail-send")({
  pass: password,
  user: gmailEmail,
});

exports.sendMail = functions
  .region("asia-northeast1")
  .https.onRequest((req: any, res: any) => {
    cors(req, res, () => {
      const {
        body: { email, name, subject, text },
      } = req;

      return send(
        {
          html: `${text.replace(/\n/g, "<br />")} <br /> ${name} ${email}`,
          subject: `[kk-web] ${subject || "no subject"}`,
          to: `piro <${gmailEmail}>`,
        },
        (err: any) => res.status(err ? 550 : 200).send()
      );
    });
  });

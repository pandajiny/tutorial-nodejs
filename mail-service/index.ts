import { createTestAccount, createTransport } from "nodemailer";
main().catch(console.error);
async function main() {
  const testAccount = await createTestAccount();
  const transporter = createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  const info = await transporter.sendMail({
    from: "HI, <pandajiny@example.com>",
    to: "astic1764@gmail.com",
    subject: "Hello",
    text: "world?",
    html: "<b>world?</b>",
  });
  console.log(info);
}

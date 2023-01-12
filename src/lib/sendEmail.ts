import sgMail from "@sendgrid/mail";

type emailData = {
  to: string;
  from: string;
  templateId: string;
  dynamicTemplateData: {};
};

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export default function sendEmail(data: emailData) {
  let email = { ...data };
  if (email.to.includes("@test.com")) {
    email.to = process.env.TEST_EMAIL || "no-reply@openaas.com.au";
  }
  const msg = { ...email };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error("Email Error: ", error);
    });
}

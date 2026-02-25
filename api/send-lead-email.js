import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      loanPurpose,
      propertyState,
      estimatedPrice,
      creditScore,
      employmentStatus,
      annualIncome,
      firstName,
      lastName,
      email,
      phone,
    } = req.body;

    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.TO_EMAIL,
      subject: 'New Mortgage Pre-Approval Lead',
      html: `
        <h2>New Pre-Approval Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <hr/>
        <p><strong>Loan Purpose:</strong> ${loanPurpose}</p>
        <p><strong>State:</strong> ${propertyState}</p>
        <p><strong>Estimated Price:</strong> ${estimatedPrice}</p>
        <p><strong>Credit Score:</strong> ${creditScore}</p>
        <p><strong>Employment Status:</strong> ${employmentStatus}</p>
        <p><strong>Annual Income:</strong> ${annualIncome}</p>
      `,
    });

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error sending email' });
  }
}

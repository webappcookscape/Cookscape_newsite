import { Router } from 'express';
import { sendEmail, sendQuote, getHealth, applyJob } from '../controllers/emailController.js';
import { renameImage } from '../controllers/imageController.js';

const router = Router();

// Lead & Enquiry Form Email Route
router.post('/send-email', sendEmail);

// Dedicated Get Quote Form Email Route (Sends to mail.cookscape.leads@gmail.com)
router.post('/get-quote', sendQuote);

// Job / Career Application Route (Sends to es.cookscape@gmail.com)
router.post('/apply-job', applyJob);

// Gallery Image Renaming Route
router.post('/rename-image', renameImage);

// Health Check Route
router.get('/health', getHealth);

export default router;

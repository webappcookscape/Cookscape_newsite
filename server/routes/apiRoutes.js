import { Router } from 'express';
import { sendEmail, getHealth } from '../controllers/emailController.js';
import { renameImage } from '../controllers/imageController.js';

const router = Router();

// Lead & Enquiry Form Email Route
router.post('/send-email', sendEmail);

// Gallery Image Renaming Route
router.post('/rename-image', renameImage);

// Health Check Route
router.get('/health', getHealth);

export default router;

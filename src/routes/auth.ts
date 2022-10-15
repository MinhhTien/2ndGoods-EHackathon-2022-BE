import { Router } from 'express';
import AuthController from '../controllers/auth';

const routes = Router();

//Login route
routes.post('/login', AuthController.login);

//Send Email Forgot password route
routes.post('/send-email-forgot-password', AuthController.sendGmailForForgotPassword);

//Send Gmail Verify Email route
routes.post('/send-email-verify-email', AuthController.sendGmailForVerifingEmail);

//Reset password route
routes.post('/reset-password', AuthController.resetPassword);

//Verify Email OTP route
routes.post('/verify-email', AuthController.verifyEmail);

export default routes;
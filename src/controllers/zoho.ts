
import express, { Request, Response } from 'express';
import { JWTMiddleware } from '../helpers/jwt.middleware';
import { getZohoContact,  createContact as createZohoContact, generateRefreshToken } from '../helpers/zohoRequest';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Enhanced validation middleware
const validateContact = [
  body('first_name').optional().isNumeric().withMessage('First name is required'),
  body('last_name').optional().isNumeric().withMessage('Last name is required'),
  body('business_name').isString().withMessage('Business name is required'), 
  body('email').isEmail().withMessage('Email is required'),
  body('country').optional().isString().withMessage('Country is required'),
  body('transfer_types').optional().isString().withMessage('Transfer types are required'),
  body('payin_assets').optional().isString().withMessage('Pay in assets are required')
];

// Routes
router.post('/add', validateContact, createContact);
router.get('/', getContacts);

// Handler Functions
async function getContacts(req: Request, res: Response) {
  try {

    const getAccessToken: string  = await generateRefreshToken()
    const result: any = await getZohoContact({}, getAccessToken)
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in createTalent controller:', error);
    res.status(500).json({ status: 500, message: 'Error getting talent' });
  }
}

async function createContact(req: Request, res: Response) {
  try {

    const getAccessToken: string  = await generateRefreshToken()
    console.log("the token", getAccessToken)
    const result: any = await createZohoContact(req.body, getAccessToken)
    console.log("the result", result)

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in createTalent controller:', error);
    res.status(500).json({ status: 500, message: 'Error creating talent' });
  }
}

export default router;

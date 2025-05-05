import dotenv from 'dotenv';
import { get, post, setHeaders } from './httpRequest';

dotenv.config();

const ZOHO_MAIN_URL = process.env.ZOHO_MAIN_URL!;
const ZOHO_REFRESH_URL = process.env.ZOHO_REFRESH_URL!;
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN!;
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID!;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET!;

// Utility to guard against empty tokens
function isTokenValid(token: string): boolean {
  return token?.trim().length > 0;
}

// GET contacts from Zoho
export async function getZohoContact(_: Record<string, unknown>, accessToken: string) {
  if (!isTokenValid(accessToken)) return;

  try {
    const headerSection =  { Authorization: `Zoho-oauthtoken ${accessToken}` };
    const response = await get(ZOHO_MAIN_URL, headerSection);
    console.log("get contacts", response);
    return response;
  } catch (error) {
    console.error("Zoho GET error:", error);
  }
}

// POST to create a Zoho contact
export async function createContact(data: any, accessToken: string) {
  if (!isTokenValid(accessToken)) return;

  try {
    const contactPayload = {
      data: [
        {
          First_Name: data.first_name,
          Last_Name: data.last_name,
          Email: data.email,
          Account_Name: data.business_name,
          Country: data.country,
          Title: "Muda Liqudity rail provider",
          Department: "Sales",
          Description: `Payin Assets: ${data.payin_assets.join(", ")}. Transfer: ${data.transfer_types.join(", ")}`,
        }
      ],
      trigger: ["approval", "workflow", "blueprint"]
    };

    const headerSection =  { Authorization: `Zoho-oauthtoken ${accessToken}` };
    const response = await post(ZOHO_MAIN_URL, contactPayload, headerSection);
    return response;

  } catch (error: any) {
    console.error("Zoho POST error:", error.message);
  }
}

// Refresh Zoho OAuth token
export async function generateRefreshToken() {
  try {
    const params = new URLSearchParams({
      refresh_token: ZOHO_REFRESH_TOKEN,
      client_id: ZOHO_CLIENT_ID,
      client_secret: ZOHO_CLIENT_SECRET,
      grant_type: 'refresh_token',
    });

    const url = `${ZOHO_REFRESH_URL}?${params.toString()}`;
    const response = await post(url, {});
    return response?.access_token;

  } catch (error) {
    console.error("Zoho Token Refresh Error:", error);
  }
}

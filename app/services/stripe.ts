import Stripe from "stripe";
import { version } from "../../package.json";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-06-30.basil",
  appInfo: {
    name: "Quem Indicar?",
    version: version,
    url: "https://www.quemindicar.com.br",
  },
});

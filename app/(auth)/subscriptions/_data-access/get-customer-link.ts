"use server";

import { stripe } from "@/lib/stripe";

const getCustomerLink = async (customerId: string) => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
  });
  console.log("Customer Portal Session URL:", session.url);
  return session.url;
};

export default getCustomerLink;

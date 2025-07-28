import { stripe } from "../services/stripe";

export const getServerSideProps = async () => {
  // Get Prices from Stripe
  // https://docs.stripe.com/api/prices

  const monthlyPrice = await stripe.prices.retrieve(
    "price_1RpUtXKFQsLHTwLv7fhuiiRT",
    {
      expand: ["product"],
    }
  );
  const semestralPrice = await stripe.prices.retrieve(
    "price_1RpUwWKFQsLHTwLvz24Tq3aJ",
    {
      expand: ["product"],
    }
  );
  const anualPrice = await stripe.prices.retrieve(
    "price_1RpUyZKFQsLHTwLvdpNERd3r",
    {
      expand: ["product"],
    }
  );

  const product = {
    priceId: monthlyPrice.id,
    amount: (monthlyPrice?.unit_amount ?? 0) / 100,
  };

  return {
    props: {
      product,
    },
  };
};

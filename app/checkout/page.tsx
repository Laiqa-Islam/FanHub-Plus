import type { Metadata } from "next";

import { CheckoutPageContent } from "@/components/cart/checkout-page-content";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Fan Hub Plus demo merch order.",
};

export default function CheckoutPage() {
  return <CheckoutPageContent />;
}

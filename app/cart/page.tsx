import type { Metadata } from "next";

import { CartPageContent } from "@/components/cart/cart-page-content";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review your Fan Hub Plus merch before checkout.",
};

export default function CartPage() {
  return <CartPageContent />;
}

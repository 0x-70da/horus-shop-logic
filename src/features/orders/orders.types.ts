// orders.types.ts

export interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CreateOrderBody {
  addressId: string;
  shippingMethodId: string;
  promoCode?: string;
  paymentMethod: "credit_card" | "cash_on_delivery" | "vodafone_cash";
  notes?: string;
}

export interface GetOrdersQuery {
  page: number;
  limit: number;
  status?: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
}

export interface OrderFilters {
  userId: string;
  status?: string;
}
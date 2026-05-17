import type { Request, Response } from "express";
import { supabase } from "../../config/supabase.js";
import { createOrderSchema, getOrdersQuerySchema, type CreateOrderBody, type GetOrdersQuery } from "./orders.schema.js";
import { createPaymentIntent } from "../payments/stripe.service.js";
import logger from "../../utils/logger.js";

export const getAllOrders = async (req: Request<{}, {}, {}, GetOrdersQuery>, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const parsedQuery = getOrdersQuerySchema.safeParse(req.query);
    if (!parsedQuery.success) {
      logger("Invalid query parameters:", parsedQuery.error.issues);
      return res.status(400).json({ success: false, message: "Invalid query parameters", errors: parsedQuery.error.issues });
    }

    const { page, limit, status } = parsedQuery.data;

    const offset = (page - 1) * limit;

    let query = supabase.from("orders").select("*, address:addresses(full_name, address_line, city, country), shipping_method:shipping_methods(name, carrier, estimated_days), items:order_items(*)", { count: "exact" }).eq("user_id", userId).order("created_at", { ascending: false }).range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data: orders, error, count } = await query;

    if (error) {
      logger("Error fetching orders:", error);
      return res.status(400).json({ success: false, message: "Cannot Get Orders" });
    }

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: { 
        orders,
        pagination: { 
          page, 
          limit, 
          total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) 
        } 
      }});
  } catch (error) {
    logger("Error in getAllOrders controller:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const getOrderById = async (req: Request<{ orderId: string }>, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orderId = req.params.orderId;

    const { data: order, error } = await supabase.from("orders").select("*, address:addresses(full_name, address_line, city, state, country, phone, zip_code), shipping_method:shipping_methods(name, carrier, estimated_days), promo_code:promo_codes(code, type, value), items:order_items(*)").eq("id", orderId).eq("user_id", userId).single();

    if (error) {
      logger("Error fetching order by ID:", error);
      return res.status(400).json({ success: false, message: "Cannot Get Order", error });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, message: "Order retrieved successfully", data: order });

  } catch (error) {
    logger("Error in getOrderById controller:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const createOrder = async (req: Request<{}, {}, CreateOrderBody>, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const safeBody = createOrderSchema.safeParse(req.body);

    if (!safeBody.success) {
      logger("Error creating order:", safeBody.error.issues);
      return res.status(400).json({ success: false, message: "Invalid request body" });
    }

    const { addressId, shippingMethodId, promoCode, paymentMethod, notes } = safeBody.data;

    const rpcArgs = {
      p_user_id: userId,
      p_address_id: addressId,
      p_shipping_method_id: shippingMethodId,
      ...(promoCode !== null && promoCode !== undefined ? { p_promo_code: promoCode } : {}),
    };

    const { data, error } = await supabase.rpc("place_order", rpcArgs);

    if (error) {
      logger("Error placing order:", error);
      return res.status(400).json({ success: false, message: "Cannot Create Order" });
    }

    const order = data as {
      order_id: string;
      order_number: string;
      subtotal: number;
      discount: number;
      shipping: number;
      tax: number;
      total: number;
    }

    if (paymentMethod === "credit_card") {
      const { clientSecret, paymentIntentId } = await createPaymentIntent({
        amount: order.total,
        currency: "egp",
        orderId: order.order_id,
        userId,
      });

      const { error: updateErrorWithStripe } = await supabase.from("orders").update({
        payment_intent_id: paymentIntentId,
        payment_method: paymentMethod,
        notes: notes ?? null,
      }).eq("id", order.order_id);

      if (updateErrorWithStripe) {
        logger("Error updating order with Stripe payment intent ID:", updateErrorWithStripe);
        return res.status(400).json({ success: false, message: "Cannot Update Order with Payment Intent" });
      }

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: { ...order, paymentMethod, clientSecret, requiresPayment: true } });
    }

    const { error: updateErrorWithNonStripe } = await supabase.from("orders").update({
      payment_method: paymentMethod,
      notes: notes ?? null,
    }).eq("id", order.order_id);

    if (updateErrorWithNonStripe) {
      logger("Error updating order with payment method:", updateErrorWithNonStripe);
      return res.status(400).json({ success: false, message: "Cannot Update Order with Payment Method" });
    }

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: { ...order, paymentMethod, clientSecret: null, requiresPayment: false } });
  } catch (error) {
    logger("Error in createOrder controller:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const cancelOrder = async (req: Request<{ orderId: string }>, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orderId = req.params.orderId;

    const { error } = await supabase.rpc("cancel_order", { p_order_id: orderId, p_user_id: userId });

    if (error) {
      logger("Error cancelling order:", error);
      return res.status(400).json({ success: false, message: "Cannot Cancel Order" });
    }

    return res.status(200).json({ success: true, message: "Order cancelled successfully" });
  } catch (error) {
    logger("Error in cancelOrder controller:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

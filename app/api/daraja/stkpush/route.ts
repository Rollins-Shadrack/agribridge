import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/daraja";
import { db } from "@/db.js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { phone, amount, items, deliveryData, totalPrice, userId } = body;

    if (!phone || !amount || !items?.length) {
      return NextResponse.json({ error: "Missing required checkout data" }, { status: 400 });
    }
    const vendorBreakdown = items.reduce((acc: any, item: any) => {
      if (!acc[item.vendorId]) {
        acc[item.vendorId] = {
          vendorId: item.vendorId,
          total: 0,
          items: [],
        };
      }

      acc[item.vendorId].items.push(item);
      acc[item.vendorId].total += item.price * item.quantity;

      return acc;
    }, {});
    const orderResult = await db.query(
      `
      INSERT INTO orders (
        user_id,
        status,
        payment_status,
        fulfillment_status,
        total_amount,
        currency,
        items,
        vendor_breakdown,
        delivery_details,
        payment_attempts,
        status_history
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11
      )
      RETURNING *
      `,
      [
        userId || null,
        "awaiting_payment",
        "pending",
        "unfulfilled",
        totalPrice,
        "KES",
        JSON.stringify(items),
        JSON.stringify(vendorBreakdown),
        JSON.stringify({
          address: deliveryData.address,
          phone: deliveryData.phone,
          delivery_date: deliveryData.date,
          delivery_time_slot: deliveryData.time,
          notes: deliveryData.notes,
        }),
        1,
        JSON.stringify([
          {
            status: "awaiting_payment",
            timestamp: new Date().toISOString(),
          },
        ]),
      ],
    );

    const order = orderResult.rows[0];

    const transactionResult = await db.query(
      `
      INSERT INTO transactions (
        order_id,
        phone,
        amount,
        status,
        raw_request
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5
      )
      RETURNING *
      `,
      [order.id, phone, amount, "initiated", JSON.stringify(body)],
    );

    const transaction = transactionResult.rows[0];

    const token = await getAccessToken();

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    const password = Buffer.from(`${process.env.DARAJA_SHORTCODE}${process.env.DARAJA_PASSKEY}${timestamp}`).toString("base64");

    const stkPayload = {
      BusinessShortCode: process.env.DARAJA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount:  "1",//amount,
      PartyA: phone,
      PartyB: process.env.DARAJA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: process.env.DARAJA_CALLBACK_URL,
      AccountReference: `ORDER-${order.id}`,
      TransactionDesc: "MavunoFresh Payment",
    };

    const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPayload),
    });

    const data = await response.json();

    if (data?.ResponseCode !== "0") {
      await db.query(
        `
        UPDATE transactions
        SET
          status = $1,
          response_code = $2,
          response_description = $3,
          customer_message = $4,
          updated_at = NOW()
        WHERE id = $5
        `,
        ["failed", data?.errorCode || null, data?.errorMessage || "STK push failed", data?.errorMessage || "STK push failed", transaction.id],
      );

      await db.query(
        `
        UPDATE orders
        SET
          payment_status = $1,
          failure_reason = $2,
          updated_at = NOW()
        WHERE id = $3
        `,
        ["failed", data?.errorMessage || "STK push failed", order.id],
      );

      return NextResponse.json(data, { status: 400 });
    }

    await db.query(
      `
      UPDATE transactions
      SET
        merchant_request_id = $1,
        checkout_request_id = $2,
        response_code = $3,
        response_description = $4,
        customer_message = $5,
        status = $6,
        updated_at = NOW()
      WHERE id = $7
      `,
      [data.MerchantRequestID, data.CheckoutRequestID, data.ResponseCode, data.ResponseDescription, data.CustomerMessage, "pending", transaction.id],
    );

    await db.query(
      `
      UPDATE orders
      SET
        mpesa_checkout_request_id = $1,
        mpesa_merchant_request_id = $2,
        payment_status = $3,
        updated_at = NOW()
      WHERE id = $4
      `,
      [data.CheckoutRequestID, data.MerchantRequestID, "pending", order.id],
    );

    return NextResponse.json({
      success: true,
      orderId: order.id,
      transactionId: transaction.id,
      MerchantRequestID: data.MerchantRequestID,
      CheckoutRequestID: data.CheckoutRequestID,
      ResponseCode: data.ResponseCode,
      ResponseDescription: data.ResponseDescription,
      CustomerMessage: data.CustomerMessage,
    });
  } catch (error: any) {
    console.error("STK PUSH ERROR:", error);

    return NextResponse.json(
      {
        error: "STK push failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

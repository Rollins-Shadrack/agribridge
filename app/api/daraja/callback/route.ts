import { NextResponse } from "next/server";
import { db } from "@/db.js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("DARAJA CALLBACK:", JSON.stringify(body, null, 2));
    const callback = body?.Body?.stkCallback;

    if (!callback) {
      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback;

    const transactionResult = await db.query(
      `
      SELECT *
      FROM transactions
      WHERE checkout_request_id = $1
      LIMIT 1
      `,
      [CheckoutRequestID],
    );

    const transaction = transactionResult.rows[0];

    if (!transaction) {
      console.error("Transaction not found:", CheckoutRequestID);

      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    if (transaction.status === "success" || transaction.status === "failed") {
      console.log("Duplicate callback ignored:", CheckoutRequestID);

      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    if (ResultCode !== 0) {
      // update transaction
      await db.query(
        `
        UPDATE transactions
        SET
          status = $1,
          result_code = $2,
          result_desc = $3,
          raw_callback = $4,
          updated_at = NOW()
        WHERE id = $5
        `,
        ["failed", String(ResultCode), ResultDesc, JSON.stringify(body), transaction.id],
      );

      await db.query(
        `
        UPDATE orders
        SET
          payment_status = $1,
          status = $2,
          failure_reason = $3,
          updated_at = NOW()
        WHERE id = $4
        `,
        ["failed", "failed", ResultDesc, transaction.order_id],
      );

      console.log("Payment failed:", ResultDesc);

      return NextResponse.json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    const metadataItems = CallbackMetadata?.Item || [];

    // helper function
    const getValue = (name: string) => {
      const item = metadataItems.find((i: any) => i.Name === name);

      return item?.Value || null;
    };

    const amount = getValue("Amount");
    const mpesaReceipt = getValue("MpesaReceiptNumber");
    const phoneNumber = getValue("PhoneNumber");
    const transactionDate = getValue("TransactionDate");

    await db.query(
      `
      UPDATE transactions
      SET
        status = $1,
        result_code = $2,
        result_desc = $3,
        mpesa_receipt = $4,
        raw_callback = $5,
        updated_at = NOW()
      WHERE id = $6
      `,
      ["success", String(ResultCode), ResultDesc, mpesaReceipt, JSON.stringify(body), transaction.id],
    );

    await db.query(
      `
      UPDATE orders
      SET
        payment_status = $1,
        status = $2,
        paid_at = NOW(),
        updated_at = NOW(),
        status_history = status_history || $3::jsonb
      WHERE id = $4
      `,
      [
        "paid",
        "paid",
        JSON.stringify([
          {
            status: "paid",
            timestamp: new Date().toISOString(),
          },
        ]),
        transaction.order_id,
      ],
    );

    // =========================================
    // OPTIONAL FUTURE EVENTS
    // =========================================

    // send sms
    // send email
    // notify vendor
    // clear cart
    // create invoice
    // trigger fulfillment
    // assign driver

    console.log("PAYMENT SUCCESSFUL");
    console.log({
      MerchantRequestID,
      CheckoutRequestID,
      amount,
      mpesaReceipt,
      phoneNumber,
      transactionDate,
    });

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  } catch (error: any) {
    console.error("DARAJA CALLBACK ERROR:", error);

    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: "Accepted",
    });
  }
}

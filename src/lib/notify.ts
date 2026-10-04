import nodemailer from "nodemailer";

interface OrderNotificationPayload {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string;
  deliveryInfo: string;
  notes?: string;
  flavour: string;
  quantity: number;
  totalAmount: number;
  paymentMethod: string;
  paymentReference: string;
  paidAt?: string;
}

function formatPaymentMethod(method: string): string {
  if (method === "mobile_money") return "Mobile Money";
  if (method === "card") return "Debit / Credit Card";
  return method;
}

function buildEmailHtml(o: OrderNotificationPayload): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:24px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#8b1a1a 0%,#4d0c0c 100%);padding:28px 32px;">
            <p style="margin:0;color:#fce4e4;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;font-weight:700;">Whisk It Fruity Fusion</p>
            <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700;">New Order Received</h1>
          </td>
        </tr>
        <!-- Order number banner -->
        <tr>
          <td style="background:#fdf2f2;padding:14px 32px;border-bottom:1px solid #f9c9c9;">
            <p style="margin:0;font-size:12px;color:#8b4040;">Order Number</p>
            <p style="margin:4px 0 0;font-size:18px;font-weight:700;color:#8b1a1a;">${o.orderNumber}</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">

            <!-- Customer -->
            <h2 style="margin:0 0 12px;font-size:13px;color:#555;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Customer</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr><td style="padding:5px 0;font-size:14px;color:#888;width:120px;">Name</td><td style="padding:5px 0;font-size:14px;color:#1a1a1a;font-weight:600;">${o.customerName}</td></tr>
              <tr><td style="padding:5px 0;font-size:14px;color:#888;">Phone</td><td style="padding:5px 0;font-size:14px;color:#1a1a1a;font-weight:600;">${o.customerPhone}</td></tr>
              <tr><td style="padding:5px 0;font-size:14px;color:#888;">WhatsApp</td><td style="padding:5px 0;font-size:14px;color:#1a1a1a;font-weight:600;">${o.customerWhatsapp}</td></tr>
              <tr><td style="padding:5px 0;font-size:14px;color:#888;vertical-align:top;">Delivery</td><td style="padding:5px 0;font-size:14px;color:#1a1a1a;font-weight:600;">${o.deliveryInfo}</td></tr>
              ${o.notes ? `<tr><td style="padding:5px 0;font-size:14px;color:#888;vertical-align:top;">Notes</td><td style="padding:5px 0;font-size:14px;color:#1a1a1a;">${o.notes}</td></tr>` : ""}
            </table>

            <hr style="border:none;border-top:1px solid #f0f0f0;margin:0 0 24px;" />

            <!-- Order -->
            <h2 style="margin:0 0 12px;font-size:13px;color:#555;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Order</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr><td style="padding:5px 0;font-size:14px;color:#888;width:120px;">Product</td><td style="padding:5px 0;font-size:14px;color:#1a1a1a;font-weight:600;">Whisk It Fruity Fusion</td></tr>
              <tr><td style="padding:5px 0;font-size:14px;color:#888;">Flavour</td><td style="padding:5px 0;font-size:14px;color:#1a1a1a;font-weight:600;">${o.flavour}</td></tr>
              <tr><td style="padding:5px 0;font-size:14px;color:#888;">Quantity</td><td style="padding:5px 0;font-size:14px;color:#1a1a1a;font-weight:600;">${o.quantity} bottle${o.quantity !== 1 ? "s" : ""}</td></tr>
              <tr><td style="padding:5px 0;font-size:14px;color:#888;">Unit Price</td><td style="padding:5px 0;font-size:14px;color:#1a1a1a;font-weight:600;">GH&#8373;15</td></tr>
            </table>

            <!-- Total -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf2f2;border-radius:8px;margin-bottom:24px;">
              <tr>
                <td style="padding:14px 18px;font-size:15px;font-weight:700;color:#1a1a1a;">Total</td>
                <td style="padding:14px 18px;font-size:22px;font-weight:700;color:#8b1a1a;text-align:right;">GH&#8373;${o.totalAmount}</td>
              </tr>
            </table>

            <hr style="border:none;border-top:1px solid #f0f0f0;margin:0 0 24px;" />

            <!-- Payment -->
            <h2 style="margin:0 0 12px;font-size:13px;color:#555;text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Payment</h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
              <tr><td style="padding:5px 0;font-size:14px;color:#888;width:120px;">Method</td><td style="padding:5px 0;font-size:14px;color:#1a1a1a;font-weight:600;">${formatPaymentMethod(o.paymentMethod)}</td></tr>
              <tr><td style="padding:5px 0;font-size:14px;color:#888;">Status</td><td style="padding:5px 0;font-size:14px;color:#2d6a4f;font-weight:700;">PAID ✓</td></tr>
              <tr><td style="padding:5px 0;font-size:14px;color:#888;">Reference</td><td style="padding:5px 0;font-size:13px;color:#555;font-family:monospace;">${o.paymentReference}</td></tr>
              ${o.paidAt ? `<tr><td style="padding:5px 0;font-size:14px;color:#888;">Paid At</td><td style="padding:5px 0;font-size:14px;color:#555;">${new Date(o.paidAt).toLocaleString("en-GH")}</td></tr>` : ""}
            </table>

          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9f9f9;padding:16px 32px;border-top:1px solid #eee;">
            <p style="margin:0;font-size:11px;color:#aaa;text-align:center;">Whisk It Fruity Fusion · Automated order notification</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

function buildEmailText(o: OrderNotificationPayload): string {
  return `
NEW WHISK IT ORDER

Order #: ${o.orderNumber}

CUSTOMER
Name: ${o.customerName}
Phone: ${o.customerPhone}
WhatsApp: ${o.customerWhatsapp}
Delivery: ${o.deliveryInfo}
${o.notes ? `Notes: ${o.notes}` : ""}

ORDER
Product: Whisk It Fruity Fusion
Flavour: ${o.flavour}
Quantity: ${o.quantity} bottle${o.quantity !== 1 ? "s" : ""}
Unit Price: GH₵15
Total: GH₵${o.totalAmount}

PAYMENT
Method: ${formatPaymentMethod(o.paymentMethod)}
Status: PAID
Reference: ${o.paymentReference}
${o.paidAt ? `Paid At: ${new Date(o.paidAt).toLocaleString("en-GH")}` : ""}
  `.trim();
}

export async function sendOwnerNotification(
  payload: OrderNotificationPayload
): Promise<{ sent: boolean; reason?: string }> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const notifyEmail = process.env.NOTIFICATION_EMAIL;

  if (!smtpHost || !smtpUser || !smtpPass || !notifyEmail) {
    console.log(
      "[Notify] SMTP not configured — order notification logged below:"
    );
    console.log(buildEmailText(payload));
    return { sent: false, reason: "SMTP not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"Whisk It Orders" <${smtpUser}>`,
      to: notifyEmail,
      subject: `New Order ${payload.orderNumber} — GH₵${payload.totalAmount} — ${payload.customerName}`,
      text: buildEmailText(payload),
      html: buildEmailHtml(payload),
    });

    return { sent: true };
  } catch (err) {
    console.error("[Notify] Failed to send owner email:", err);
    return { sent: false, reason: String(err) };
  }
}

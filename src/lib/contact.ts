import { createServerFn } from "@tanstack/react-start";

export const sendContactEmail = createServerFn({ method: "POST" })
  .validator((data: { name: string; email: string; message: string }) => data)
  .handler(async ({ data }) => {
    const apiKey = process.env.RESEND_API_KEY;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "contact@austinhynes.com",
        to: "austinmh95@gmail.com",
        subject: `New message from ${data.name}`,
        html: `<p><strong>From:</strong> ${data.name} (${data.email})</p><p><strong>Message:</strong><br/>${data.message}</p>`,
      }),
    });
    if (!res.ok) throw new Error("Failed to send email");
    return { success: true };
  });

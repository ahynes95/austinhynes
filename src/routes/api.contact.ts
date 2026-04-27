import { createAPIFileRoute } from "@tanstack/react-router/server";

export const APIRoute = createAPIFileRoute("/api/contact")({
  POST: async ({ request, context }) => {
    const env = (context as any).env as { RESEND_API_KEY: string };
    const { name, email, message } = await request.json();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "contact@austinhynes.com",
        to: "austinmh95@gmail.com",
        subject: `New message from ${name}`,
        html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Message:</strong><br/>${message}</p>`,
      }),
    });

    if (!res.ok) return new Response("Failed", { status: 500 });
    return new Response("OK", { status: 200 });
  },
});

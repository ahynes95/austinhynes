import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Hero from "@/components/ui/animated-shader-hero";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Technology in Business, simplified. — Dallas IT & Web Design",
      },
      {
        name: "description",
        content:
          "Managed services, Microsoft expertise, and web design in the Dallas, TX area.",
      },
      {
        property: "og:title",
        content: "Technology in Business, simplified.",
      },
      {
        property: "og:description",
        content:
          "Managed services, Microsoft expertise, and web design in the Dallas, TX area.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  const [contactOpen, setContactOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Lock scroll while on this single-page hero.
  useEffect(() => {
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, []);

  const openContact = () => setContactOpen(true);

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setSubmitting(true);
  const form = e.currentTarget;
  const name = (form.elements.namedItem("name") as HTMLInputElement).value;
  const email = (form.elements.namedItem("email") as HTMLInputElement).value;
  const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "contact@austinhynes.com",
        to: "austinmh95@gmail.com",
        subject: `New message from ${name}`,
        html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Message:</strong><br/>${message}</p>`,
      }),
    });

    if (!res.ok) throw new Error();
    setContactOpen(false);
    toast.success("Message sent", {
      description: "Thanks — I'll be in touch shortly.",
    });
  } catch {
    toast.error("Something went wrong", {
      description: "Please try again or email me directly.",
    });
  } finally {
    setSubmitting(false);
  }
};

  return (
    <>
      <Hero
        headline={{
          line1: "Technology in Business",
          line2: "simplified.",
        }}
        subtitle="Managed services, Microsoft expertise, and web design in the Dallas, TX area."
        buttons={{
          primary: { text: "Work with me", onClick: openContact },
          secondary: {
            text: "Let's build something together.",
            onClick: openContact,
          },
        }}
      />

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Let's talk</DialogTitle>
            <DialogDescription>
              Send a quick note and I'll get back to you.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" name="message" rows={4} required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Send message"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  );
}

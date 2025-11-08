import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({ 
  phoneNumber = "923001234567",
  message = "Hi, I want to inquire about your products"
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 animate-pulse hover:animate-none"
      data-testid="button-whatsapp-float"
    >
      <Button
        size="lg"
        className="rounded-full h-14 w-14 shadow-lg bg-[#25D366] hover:bg-[#20BA5A] text-white border-0"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </a>
  );
}

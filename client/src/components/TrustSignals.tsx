import { Truck, CreditCard, MessageCircle, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TrustSignals() {
  const signals = [
    {
      icon: Truck,
      title: "Free Shipping",
      description: "On orders over Rs. 2,000"
    },
    {
      icon: CreditCard,
      title: "Cash on Delivery",
      description: "Pay when you receive"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Support",
      description: "Quick customer service"
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "100% secure payments"
    }
  ];

  return (
    <section className="py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {signals.map((signal, index) => (
          <Card key={index} className="text-center" data-testid={`card-trust-${index}`}>
            <CardContent className="p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <signal.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2" data-testid={`text-trust-title-${index}`}>
                {signal.title}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid={`text-trust-desc-${index}`}>
                {signal.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

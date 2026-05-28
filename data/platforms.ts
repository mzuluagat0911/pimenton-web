export type PlatformRing = "inner" | "middle" | "outer";

export interface Platform {
  id: string;
  name: string;
  logo: string;
  ring: PlatformRing;
}

export const platforms: Platform[] = [
  // Inner ring — food apps (6)
  { id: "rappi", name: "Rappi", logo: "/assets/logos-platforms/foodapp_rappi.svg", ring: "inner" },
  { id: "pedidos-ya", name: "PedidosYa", logo: "/assets/logos-platforms/foodapp_pedidos-ya.svg", ring: "inner" },
  { id: "uber-eats", name: "Uber Eats", logo: "/assets/logos-platforms/foodapp_uber-eats.svg", ring: "inner" },
  { id: "glovo", name: "Glovo", logo: "/assets/logos-platforms/foodapp_glovo.svg", ring: "inner" },
  { id: "deliveroo", name: "Deliveroo", logo: "/assets/logos-platforms/foodapp_deliveroo.svg", ring: "inner" },
  { id: "delivery-hero", name: "Delivery Hero", logo: "/assets/logos-platforms/tool_delivery-hero.svg", ring: "inner" },
  // Middle ring — tooling (2)
  { id: "toast", name: "Toast", logo: "/assets/logos-platforms/tool_toast.svg", ring: "middle" },
  { id: "deliverect", name: "Deliverect", logo: "/assets/logos-platforms/tool_deliverect.svg", ring: "middle" },
  // Outer ring — tech / AI (4)
  { id: "chatgpt", name: "ChatGPT", logo: "/assets/logos-platforms/tech_chat-gpt.svg", ring: "outer" },
  { id: "claude", name: "Claude", logo: "/assets/logos-platforms/tech_claude.svg", ring: "outer" },
  { id: "google", name: "Google", logo: "/assets/logos-platforms/tech_google.svg", ring: "outer" },
  { id: "meta", name: "Meta", logo: "/assets/logos-platforms/tech_meta.svg", ring: "outer" },
];

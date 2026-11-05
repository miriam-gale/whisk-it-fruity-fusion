export interface Drink {
  id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  images: string[];
}

export interface OrderItem {
  drinkId: string;
  drinkName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  whatsapp: string;
  delivery_info: string;
  notes?: string;
  items: OrderItem[];
  total_amount: number;
  payment_method?: "mobile_money" | "card";
  payment_reference?: string;
  payment_status: "pending" | "paid" | "failed";
  order_status: "new" | "processing" | "completed" | "cancelled";
  created_at: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  whatsapp: string;
  delivery_info: string;
  notes: string;
}

export const DRINKS: Drink[] = [
  {
    id: "milk-based",
    slug: "milk-based",
    name: "Milk-Based",
    description:
      "Tropical fruits blended with fresh creamy milk for a smooth, satisfying drink.",
    price: 20,
    images: ["/ingredients/milk.png"],
  },
  {
    id: "yoghurt-based",
    slug: "yoghurt-based",
    name: "Yoghurt-Based",
    description:
      "Tropical fruits blended with rich yoghurt for a tangy, creamy twist.",
    price: 20,
    images: ["/ingredients/yoghurt.png"],
  },
];

export const CONTACT_NUMBERS = [
  {
    display: "0241652034",
    tel: "+233241652034",
    wa: "+233241652034",
  },
  {
    display: "0554021773",
    tel: "+233554021773",
    wa: "+233554021773",
  },
  {
    display: "0244220408",
    tel: "+233244220408",
    wa: "+233244220408",
  },
];

export const WA_MESSAGE = encodeURIComponent(
  "Hello Whisk It Fruity Fusion, I would like to place an order."
);

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
    id: "mango-apple",
    slug: "mango-apple",
    name: "Mango & Apple",
    description: "Sweet mango blended with crisp, refreshing apple.",
    price: 15,
    images: ["/ingredients/mango.png", "/ingredients/apple.png"],
  },
  {
    id: "pawpaw-apple",
    slug: "pawpaw-apple",
    name: "Pawpaw & Apple",
    description: "Creamy pawpaw paired with the refreshing taste of apple.",
    price: 15,
    images: ["/ingredients/pawpaw.png", "/ingredients/apple.png"],
  },
  {
    id: "watermelon-apple",
    slug: "watermelon-apple",
    name: "Watermelon & Apple",
    description: "Juicy watermelon combined with crisp, refreshing apple.",
    price: 15,
    images: ["/ingredients/watermelon.png", "/ingredients/apple.png"],
  },
  {
    id: "pawpaw-mango-watermelon",
    slug: "pawpaw-mango-watermelon",
    name: "Pawpaw, Mango & Watermelon",
    description:
      "A colourful tropical fusion of pawpaw, mango and watermelon.",
    price: 15,
    images: ["/ingredients/pawpaw.png", "/ingredients/mango.png", "/ingredients/watermelon.png"],
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

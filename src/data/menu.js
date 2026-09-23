export const categories = ["Starters", "Mains", "Sides", "Desserts", "Drinks"];

const rawMenu = [
  ["Chicken Samosa","Starters",250],["Beef Samosa","Starters",280],["Vegetable Spring Rolls","Starters",300],["Chicken Wings","Starters",650],["Garlic Bread","Starters",350],["Beef Skewers","Starters",550],["Fish Fingers","Starters",600],["Soup of the Day","Starters",300],["Chicken Tikka","Starters",700],["Bruschetta","Starters",450],
  ["Grilled Chicken","Mains",950],["Chicken Curry","Mains",850],["Beef Steak","Mains",1250],["Beef Pilau","Mains",750],["Chicken Biryani","Mains",850],["Fish and Chips","Mains",900],["Grilled Tilapia","Mains",1100],["Beef Burger","Mains",800],["Chicken Burger","Mains",750],["Chicken Alfredo","Mains",900],["Spaghetti Bolognese","Mains",850],["Vegetable Pasta","Mains",700],["Chicken Fried Rice","Mains",800],["Beef Fried Rice","Mains",850],["Mixed Grill","Mains",1450],
  ["Plain Rice","Sides",250],["Ugali","Sides",200],["Chips","Sides",300],["Mashed Potatoes","Sides",300],["Sauteed Vegetables","Sides",300],["Coleslaw","Sides",180],["Kachumbari","Sides",180],["Beef Sausage","Sides",250],["Chapati","Sides",100],["Ndengu","Sides",250],
  ["Chocolate Cake","Desserts",450],["Cheesecake","Desserts",500],["Ice Cream","Desserts",350],["Fruit Salad","Desserts",400],["Brownie","Desserts",400],["Pancakes","Desserts",450],["Mango Pudding","Desserts",400],["Banana Split","Desserts",500],["Fresh Fruit Platter","Desserts",550],["Vanilla Cake","Desserts",400],
  ["Soda","Drinks",150],["Fresh Juice","Drinks",300],["Passion Juice","Drinks",300],["Mango Juice","Drinks",300],["Mineral Water","Drinks",100],["Tea","Drinks",180],["Coffee","Drinks",220],["Cappuccino","Drinks",350],["Milkshake","Drinks",450],["Iced Tea","Drinks",280],["Lemonade","Drinks",250],["Ginger Tea","Drinks",220],["Hot Chocolate","Drinks",350],["Energy Drink","Drinks",250],["Sparkling Water","Drinks",250]
];

export const menuItems = rawMenu.map(([name, category, price], index) => ({
  id: index + 1, name, category, price, active: true
}));

export const modifiers = [
  { id: "standard", name: "Standard", price: 0 },
  { id: "no-onions", name: "No onions", price: 0 },
  { id: "extra-sauce", name: "Extra sauce", price: 50 },
  { id: "extra-cheese", name: "Extra cheese", price: 100 }
];
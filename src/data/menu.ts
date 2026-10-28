export type Category = { id: string; name: string; number: string };

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  vegetarian: boolean;
  available: boolean;
};

export const menuCategories: Category[] = [
  { id: "hot-drinks", name: "Hot Drinks", number: "01" },
  { id: "cold-drinks", name: "Cold Drinks", number: "02" },
  { id: "main-course", name: "Main Course", number: "03" },
  { id: "snacks", name: "Snacks", number: "04" },
  { id: "momos", name: "Momos", number: "05" },
  { id: "noodles", name: "Noodles", number: "06" },
  { id: "rice-biryani", name: "Rice & Biryani", number: "07" },
  { id: "desserts", name: "Desserts", number: "08" },
];

const i = (cat: string, n: number, name: string, description: string, price: number, veg = true): MenuItem => ({
  id: `${cat}-${n}`,
  categoryId: cat,
  name,
  description,
  price,
  vegetarian: veg,
  available: true,
});

export const menuItems: MenuItem[] = [
  // Hot Drinks
  i("hot-drinks",1,"Masala Chai","Classic Indian tea brewed with warming spices.",40),
  i("hot-drinks",2,"Ginger Tea","Fresh ginger and aromatic tea.",35),
  i("hot-drinks",3,"Filter Coffee","Strong South Indian-style coffee.",60),
  i("hot-drinks",4,"Cappuccino","Espresso with steamed milk and foam.",90),
  i("hot-drinks",5,"Hot Chocolate","Rich, creamy cocoa.",100),
  i("hot-drinks",6,"Lemon Honey Tea","A soothing tea with lemon and honey.",55),
  // Cold Drinks
  i("cold-drinks",1,"Cold Coffee","Chilled coffee blended with milk.",110),
  i("cold-drinks",2,"Iced Latte","Espresso poured over ice and milk.",120),
  i("cold-drinks",3,"Fresh Lime Soda","Sparkling lime with a pinch of salt.",60),
  i("cold-drinks",4,"Mango Lassi","Creamy yogurt drink with mango.",90),
  i("cold-drinks",5,"Chocolate Milkshake","Thick chocolate shake.",130),
  i("cold-drinks",6,"Iced Lemon Tea","Refreshing black tea with lemon.",70),
  // Main Course
  i("main-course",1,"Paneer Butter Masala","Paneer in a rich tomato-butter gravy.",190),
  i("main-course",2,"Dal Tadka","Yellow lentils tempered with spices.",140),
  i("main-course",3,"Shahi Paneer","Paneer in a creamy cashew gravy.",210),
  i("main-course",4,"Chole Masala","Spiced chickpea curry.",150),
  i("main-course",5,"Mix Veg Curry","Seasonal vegetables in curry.",160),
  i("main-course",6,"Kadai Paneer","Paneer with peppers in kadai spices.",200),
  // Snacks
  i("snacks",1,"Veg Sandwich","Fresh vegetables in toasted bread.",80),
  i("snacks",2,"Cheese Grilled Sandwich","Grilled sandwich with melted cheese.",120),
  i("snacks",3,"French Fries","Crispy salted potato fries.",90),
  i("snacks",4,"Paneer Pakora","Paneer fritters in spiced batter.",120),
  i("snacks",5,"Veg Cutlet","Crispy vegetable cutlet.",70),
  i("snacks",6,"Crispy Corn","Crunchy corn tossed in spices.",130),
  // Momos
  i("momos",1,"Veg Steamed Momos","Steamed dumplings with veg filling.",90),
  i("momos",2,"Veg Fried Momos","Crispy fried vegetable dumplings.",110),
  i("momos",3,"Paneer Momos","Momos stuffed with spiced paneer.",120),
  i("momos",4,"Chicken Steamed Momos","Steamed chicken dumplings.",130,false),
  i("momos",5,"Chicken Fried Momos","Fried chicken dumplings.",150,false),
  i("momos",6,"Tandoori Momos","Smoky tandoori-style momos.",160),
  // Noodles
  i("noodles",1,"Veg Hakka Noodles","Stir-fried noodles with vegetables.",120),
  i("noodles",2,"Schezwan Noodles","Spicy Schezwan-style noodles.",140),
  i("noodles",3,"Paneer Noodles","Noodles with paneer and veggies.",150),
  i("noodles",4,"Egg Noodles","Noodles tossed with egg.",130,false),
  i("noodles",5,"Chicken Hakka Noodles","Hakka noodles with chicken.",160,false),
  i("noodles",6,"Mixed Veg Chow Mein","Chow mein with mixed vegetables.",130),
  // Rice & Biryani
  i("rice-biryani",1,"Steamed Rice","Plain steamed basmati rice.",80),
  i("rice-biryani",2,"Jeera Rice","Rice tempered with cumin.",110),
  i("rice-biryani",3,"Veg Fried Rice","Fried rice with vegetables.",130),
  i("rice-biryani",4,"Veg Biryani","Aromatic vegetable biryani.",160),
  i("rice-biryani",5,"Egg Fried Rice","Fried rice with egg.",140,false),
  i("rice-biryani",6,"Chicken Biryani","Fragrant chicken biryani.",200,false),
  // Desserts
  i("desserts",1,"Gulab Jamun","Soft milk-solid dumplings in syrup.",60),
  i("desserts",2,"Brownie","Warm chocolate brownie.",100),
  i("desserts",3,"Chocolate Pastry","Layered chocolate pastry.",90),
  i("desserts",4,"Ice Cream","Vanilla ice cream scoop.",70),
  i("desserts",5,"Rasmalai","Soft paneer dumplings in milk.",80),
  i("desserts",6,"Chocolate Lava Cake","Molten chocolate cake.",130),
];

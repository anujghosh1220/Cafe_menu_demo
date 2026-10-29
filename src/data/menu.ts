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
  i("hot-drinks",1,"Masala Chai","Fragrant Indian tea simmered with warming spices for a comforting, aromatic cup.",40),
  i("hot-drinks",2,"Ginger Tea","Fresh ginger steeped with tea leaves for a warming, lively flavour.",35),
  i("hot-drinks",3,"Filter Coffee","Strong South Indian-style coffee with a rich, bold aroma.",60),
  i("hot-drinks",4,"Cappuccino","Espresso topped with steamed milk and soft foam for a smooth finish.",90),
  i("hot-drinks",5,"Hot Chocolate","Creamy cocoa with a rich chocolate flavour and gentle sweetness.",100),
  i("hot-drinks",6,"Lemon Honey Tea","Light tea brightened with lemon and honey for a soothing cup.",55),
  i("cold-drinks",1,"Cold Coffee","A chilled, smooth coffee drink with a creamy finish.",110),
  i("cold-drinks",2,"Iced Latte","Espresso and cold milk served over ice for a refreshing sip.",120),
  i("cold-drinks",3,"Fresh Lime Soda","Fresh lime with a fizzy, bright finish and a hint of salt.",60),
  i("cold-drinks",4,"Mango Lassi","Creamy yoghurt blended with sweet mango for a cooling drink.",90),
  i("cold-drinks",5,"Chocolate Milkshake","A thick, chocolate-rich milkshake with a smooth, creamy texture.",130),
  i("cold-drinks",6,"Iced Lemon Tea","Chilled tea with a bright citrus flavour and light sweetness.",70),
  i("main-course",1,"Paneer Butter Masala","Tender paneer in a velvety tomato-butter gravy with gentle spice.",190),
  i("main-course",2,"Dal Tadka","Yellow lentils tempered with aromatic spices for a homely, savoury dish.",140),
  i("main-course",3,"Shahi Paneer","Paneer in a creamy, mildly spiced gravy with a rich finish.",210),
  i("main-course",4,"Chole Masala","Chickpeas cooked with traditional Indian spices for a hearty curry.",150),
  i("main-course",5,"Mix Veg Curry","Seasonal vegetables simmered in a flavourful, spiced curry.",160),
  i("main-course",6,"Kadai Paneer","Paneer tossed with peppers in kadai spices for a bold, savoury dish.",200),
  i("snacks",1,"Veg Sandwich","Fresh vegetables layered between toasted bread for a light bite.",80),
  i("snacks",2,"Cheese Grilled Sandwich","Grilled bread filled with melted cheese for a warm, comforting snack.",120),
  i("snacks",3,"French Fries","Crisp golden potato fries with a light, savoury seasoning.",90),
  i("snacks",4,"Paneer Pakora","Paneer pieces coated in seasoned gram flour and fried until crisp.",120),
  i("snacks",5,"Veg Cutlet","Crisp vegetable patties with a spiced filling and golden exterior.",70),
  i("snacks",6,"Crispy Corn","Crunchy corn tossed with savoury seasoning for a snackable bite.",130),
  i("momos",1,"Veg Steamed Momos","Soft dumplings filled with seasoned vegetables and steamed until tender.",90),
  i("momos",2,"Veg Fried Momos","Golden dumplings with a crisp exterior and a savoury vegetable filling.",110),
  i("momos",3,"Paneer Momos","Dumplings filled with seasoned paneer for a soft, flavourful bite.",120),
  i("momos",4,"Chicken Steamed Momos","Steamed dumplings with a savoury chicken filling and soft wrapper.",130,false),
  i("momos",5,"Chicken Fried Momos","Crispy chicken dumplings fried until golden and served hot.",150,false),
  i("momos",6,"Tandoori Momos","Spiced momos with a smoky finish and a lightly charred exterior.",160),
  i("noodles",1,"Veg Hakka Noodles","Stir-fried noodles with vegetables and a savoury, light seasoning.",120),
  i("noodles",2,"Schezwan Noodles","Noodles tossed in a bold, spicy sauce with a lively kick.",140),
  i("noodles",3,"Paneer Noodles","Noodles with paneer and mixed vegetables in a savoury stir-fry.",150),
  i("noodles",4,"Egg Noodles","Stir-fried noodles with egg and seasoning for a simple, savoury dish.",130,false),
  i("noodles",5,"Chicken Hakka Noodles","Hakka noodles tossed with chicken and vegetables in a savoury sauce.",160,false),
  i("noodles",6,"Mixed Veg Chow Mein","Savoury noodles with a colourful vegetable mix and gentle seasoning.",130),
  i("rice-biryani",1,"Steamed Rice","Fluffy rice, simply prepared and lightly seasoned.",80),
  i("rice-biryani",2,"Jeera Rice","Fragrant rice tempered with cumin for a warm, aromatic side.",110),
  i("rice-biryani",3,"Veg Fried Rice","Rice stir-fried with vegetables and seasoning for a savoury plate.",130),
  i("rice-biryani",4,"Veg Biryani","Aromatic rice layered with spiced vegetables for a fragrant dish.",160),
  i("rice-biryani",5,"Egg Fried Rice","Stir-fried rice with egg and vegetables for a hearty, savoury plate.",140,false),
  i("rice-biryani",6,"Chicken Biryani","Fragrant rice with a spiced chicken preparation for a rich, aromatic dish.",200,false),
  i("desserts",1,"Gulab Jamun","Soft milk-solid dumplings in fragrant syrup with a sweet finish.",60),
  i("desserts",2,"Brownie","A rich chocolate brownie with a dense, fudgy texture.",100),
  i("desserts",3,"Chocolate Pastry","Chocolate sponge layered with a creamy filling and smooth finish.",90),
  i("desserts",4,"Ice Cream","A cool, creamy dessert served chilled and smooth.",70),
  i("desserts",5,"Rasmalai","Soft milk dumplings in sweetened, flavoured milk with a delicate finish.",80),
  i("desserts",6,"Chocolate Lava Cake","A warm chocolate cake with a soft centre and indulgent chocolate flavour.",130),
];

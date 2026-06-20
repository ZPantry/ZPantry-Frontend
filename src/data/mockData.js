export const mockAccounts = [
  {
    id: "admin-1",
    name: "Quản trị Z-Pantry",
    email: "admin@zpantry.com",
    password: "123456",
    role: "admin",
    status: "active",
    createdAt: "2026-01-05"
  },
  {
    id: "user-1",
    name: "Người dùng mẫu",
    email: "user@zpantry.com",
    password: "123456",
    role: "user",
    status: "active",
    createdAt: "2026-02-12",
    profile: {
      fullName: "Người dùng mẫu",
      age: 24,
      gender: "Không muốn chia sẻ",
      cookingSkill: "Trung cấp",
      dietaryPreference: "Ăn lành mạnh",
      allergies: "Không có",
      mainGoal: "Giảm lãng phí thực phẩm",
      onboarded: true
    }
  }
];

export const starterIngredients = [
  { id: "ing-1", userId: "user-1", name: "Ức gà", category: "Thịt", quantity: "500", unit: "gram", expirationDate: "2026-06-16", storage: "Tủ lạnh", note: "Không da" },
  { id: "ing-2", userId: "user-1", name: "Gạo", category: "Ngũ cốc", quantity: "2", unit: "kg", expirationDate: "2026-09-20", storage: "Tủ bếp", note: "" },
  { id: "ing-3", userId: "user-1", name: "Trứng", category: "Sữa và trứng", quantity: "8", unit: "cái", expirationDate: "2026-06-14", storage: "Tủ lạnh", note: "" },
  { id: "ing-4", userId: "user-1", name: "Cà chua", category: "Rau củ", quantity: "5", unit: "cái", expirationDate: "2026-06-15", storage: "Tủ lạnh", note: "" },
  { id: "ing-5", userId: "user-1", name: "Chuối", category: "Trái cây", quantity: "4", unit: "cái", expirationDate: "2026-06-15", storage: "Tủ bếp", note: "" }
];

export const recipes = [
  { id: "chicken-rice-bowl", name: "Cơm gà áp chảo", type: "Bữa trưa", time: 28, difficulty: "Dễ", tags: ["Giàu đạm", "Tiết kiệm"], ingredients: ["ức gà", "gạo", "cà chua"], description: "Một phần cơm cân bằng với gà áp chảo, cơm nóng và cà chua tươi.", steps: ["Nấu cơm chín mềm.", "Ướp và áp chảo ức gà.", "Cắt cà chua rồi bày ra đĩa."] },
  { id: "egg-fried-rice", name: "Cơm chiên trứng", type: "Bữa tối", time: 18, difficulty: "Dễ", tags: ["Món nhanh", "Tiết kiệm"], ingredients: ["trứng", "gạo", "gia vị"], description: "Món cơm chiên nhanh, tận dụng cơm và trứng trong tủ.", steps: ["Đánh và xào trứng.", "Cho cơm vào đảo với gia vị.", "Trộn đều và dùng nóng."] },
  { id: "vegetable-soup", name: "Canh rau củ", type: "Bữa tối", time: 35, difficulty: "Dễ", tags: ["Lành mạnh", "Ít tinh bột"], ingredients: ["cà chua", "cà rốt", "hành", "gia vị"], description: "Bát canh nhẹ nhàng giúp dùng hết rau củ sắp hết hạn.", steps: ["Cắt rau củ.", "Nấu với nước và gia vị.", "Nêm lại cho vừa ăn."] },
  { id: "tuna-sandwich", name: "Bánh mì cá ngừ", type: "Bữa trưa", time: 12, difficulty: "Dễ", tags: ["Món nhanh", "Giàu đạm"], ingredients: ["cá ngừ", "bánh mì", "xà lách"], description: "Bữa trưa nhanh gọn, giàu đạm cho ngày bận rộn.", steps: ["Trộn cá ngừ với gia vị.", "Xếp cùng xà lách vào bánh mì.", "Nướng nhẹ hoặc dùng ngay."] },
  { id: "beef-noodle-bowl", name: "Bún bò nhanh", type: "Bữa tối", time: 32, difficulty: "Trung bình", tags: ["Giàu đạm"], ingredients: ["thịt bò", "bún", "gia vị", "rau củ"], description: "Tô bún bò đậm vị với rau ăn kèm.", steps: ["Luộc bún.", "Xào hoặc trụng thịt bò.", "Chan nước dùng và thêm rau."] },
  { id: "tofu-salad", name: "Salad đậu hũ", type: "Bữa trưa", time: 16, difficulty: "Dễ", tags: ["Chay", "Lành mạnh"], ingredients: ["đậu hũ", "xà lách", "cà chua"], description: "Món salad thanh nhẹ với đậu hũ và rau tươi.", steps: ["Cắt đậu hũ.", "Sơ chế rau.", "Trộn cùng sốt."] },
  { id: "oatmeal-banana-bowl", name: "Yến mạch chuối", type: "Bữa sáng", time: 10, difficulty: "Dễ", tags: ["Lành mạnh", "Món nhanh"], ingredients: ["yến mạch", "chuối", "sữa"], description: "Bữa sáng mềm thơm, ngọt tự nhiên từ chuối.", steps: ["Nấu yến mạch với sữa.", "Cắt chuối.", "Thêm topping và dùng."] },
  { id: "stir-fried-vegetables", name: "Rau củ xào", type: "Bữa tối", time: 20, difficulty: "Dễ", tags: ["Lành mạnh", "Tiết kiệm"], ingredients: ["rau củ", "gia vị", "gạo"], description: "Món linh hoạt để xử lý rau còn lại trong tủ lạnh.", steps: ["Cắt rau củ.", "Xào nhanh lửa lớn.", "Ăn cùng cơm."] },
  { id: "pasta-tomato-sauce", name: "Mì sốt cà chua", type: "Bữa tối", time: 25, difficulty: "Dễ", tags: ["Tiết kiệm"], ingredients: ["mì Ý", "cà chua", "gia vị"], description: "Món mì sốt cà chua đơn giản, dễ ăn.", steps: ["Luộc mì.", "Nấu sốt cà chua.", "Trộn mì với sốt."] },
  { id: "chicken-salad", name: "Salad gà", type: "Bữa trưa", time: 22, difficulty: "Dễ", tags: ["Giàu đạm", "Ít tinh bột"], ingredients: ["ức gà", "xà lách", "cà chua"], description: "Salad tươi với ức gà và rau giòn.", steps: ["Nấu chín ức gà.", "Chuẩn bị rau.", "Cắt gà và trộn đều."] },
  { id: "omelette", name: "Trứng ốp la cuộn", type: "Bữa sáng", time: 9, difficulty: "Dễ", tags: ["Món nhanh", "Giàu đạm"], ingredients: ["trứng", "sữa", "gia vị"], description: "Món trứng mềm cho bữa sáng nhanh.", steps: ["Đánh trứng.", "Nấu chậm trên chảo.", "Gấp lại và dùng nóng."] },
  { id: "rice-grilled-pork", name: "Cơm sườn nướng", type: "Bữa tối", time: 40, difficulty: "Trung bình", tags: ["Giàu đạm"], ingredients: ["thịt heo", "gạo", "gia vị", "rau củ"], description: "Đĩa cơm quen thuộc với thịt nướng đậm vị.", steps: ["Ướp thịt.", "Nướng đến khi thơm vàng.", "Dùng cùng cơm và rau."] }
];

export const starterMealPlans = [
  { id: "meal-1", userId: "user-1", date: "2026-06-12", day: "Thứ Sáu", slot: "Bữa sáng", name: "Trứng ốp la cuộn", ingredients: ["Trứng", "Gia vị"], completed: false },
  { id: "meal-2", userId: "user-1", date: "2026-06-12", day: "Thứ Sáu", slot: "Bữa trưa", name: "Cơm gà áp chảo", ingredients: ["Ức gà", "Gạo", "Cà chua"], completed: false }
];

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function required(value) {
  return String(value ?? "").trim().length > 0;
}

export function calculateAge(birthDate, now = new Date()) {
  if (!birthDate) return "";
  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return "";

  let age = now.getFullYear() - birth.getFullYear();
  const monthDelta = now.getMonth() - birth.getMonth();
  const hasNotHadBirthday =
    monthDelta < 0 || (monthDelta === 0 && now.getDate() < birth.getDate());

  if (hasNotHadBirthday) age -= 1;
  return age;
}

export function validateProfileForm(form) {
  const errors = {};
  const fullName = form.fullName?.trim() || "";
  const today = new Date();
  const birthDate = form.birthDate ? new Date(`${form.birthDate}T00:00:00`) : null;
  const acceptedGenderValues = ["female", "male", "non_binary", "prefer_not_to_say"];

  if (!fullName) {
    errors.fullName = "Vui lòng nhập họ và tên.";
  } else if (fullName.length < 2) {
    errors.fullName = "Họ tên cần có ít nhất 2 ký tự.";
  } else if (fullName.length > 80) {
    errors.fullName = "Họ tên không nên dài quá 80 ký tự.";
  }

  if (!form.birthDate) {
    errors.birthDate = "Vui lòng chọn ngày sinh.";
  } else if (!birthDate || Number.isNaN(birthDate.getTime())) {
    errors.birthDate = "Ngày sinh không hợp lệ.";
  } else if (birthDate > today) {
    errors.birthDate = "Ngày sinh không thể ở tương lai.";
  } else {
    const age = calculateAge(form.birthDate, today);
    if (age < 13) errors.birthDate = "Bạn cần từ 13 tuổi trở lên để dùng hồ sơ này.";
    if (age > 100) errors.birthDate = "Vui lòng kiểm tra lại ngày sinh.";
  }

  if (!form.gender) {
    errors.gender = "Vui lòng chọn giới tính.";
  } else if (!acceptedGenderValues.includes(form.gender)) {
    errors.gender = "Vui lòng chọn giới tính trong danh sách.";
  }

  if (!form.cookingSkill) {
    errors.cookingSkill = "Vui lòng chọn kỹ năng nấu ăn.";
  }

  if (!form.dietaryPreference) {
    errors.dietaryPreference = "Vui lòng chọn chế độ ăn.";
  }

  if (!form.mainGoal) {
    errors.mainGoal = "Vui lòng chọn mục tiêu chính.";
  }

  return errors;
}

export function validateIngredientForm(form, optionSets = {}) {
  const errors = {};
  const name = form.name?.trim() || "";
  const quantity = Number(form.quantity);
  const validShelfLifeValues = optionSets.shelfLifeValues || [];

  if (!name) {
    errors.name = "Vui lòng nhập tên nguyên liệu.";
  } else if (name.length < 2) {
    errors.name = "Tên nguyên liệu cần có ít nhất 2 ký tự.";
  } else if (name.length > 80) {
    errors.name = "Tên nguyên liệu không nên dài quá 80 ký tự.";
  }

  if (!form.category) {
    errors.category = "Vui lòng chọn danh mục.";
  } else if (optionSets.categories?.length && !optionSets.categories.includes(form.category)) {
    errors.category = "Danh mục không hợp lệ.";
  }

  if (!form.storage) {
    errors.storage = "Vui lòng chọn nơi lưu trữ.";
  } else if (optionSets.storageLocations?.length && !optionSets.storageLocations.includes(form.storage)) {
    errors.storage = "Nơi lưu trữ không hợp lệ.";
  }

  if (form.quantity === "" || form.quantity === null || form.quantity === undefined) {
    errors.quantity = "Vui lòng nhập số lượng.";
  } else if (!Number.isFinite(quantity) || quantity <= 0) {
    errors.quantity = "Số lượng phải là số lớn hơn 0.";
  } else if (quantity > 99999) {
    errors.quantity = "Số lượng đang quá lớn, vui lòng kiểm tra lại.";
  }

  if (!form.unit) {
    errors.unit = "Vui lòng chọn đơn vị.";
  } else if (optionSets.units?.length && !optionSets.units.includes(form.unit)) {
    errors.unit = "Đơn vị không hợp lệ.";
  }

  if (!form.shelfLife) {
    errors.shelfLife = "Vui lòng chọn hạn dùng.";
  } else if (validShelfLifeValues.length && !validShelfLifeValues.includes(String(form.shelfLife))) {
    errors.shelfLife = "Hạn dùng không hợp lệ.";
  }

  if ((form.note || "").length > 160) {
    errors.note = "Ghi chú không nên dài quá 160 ký tự.";
  }

  return errors;
}

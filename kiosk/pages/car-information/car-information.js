function toggleDropdown() {
  const dropdownList = document.getElementById("dropdown-list");
  dropdownList.classList.toggle("hidden");

  const arrow = document.querySelector(".dropdown-arrow");
  arrow.textContent = dropdownList.classList.contains("hidden") ? "▼" : "▲";
}

function selectItem(displayValue, code) {
  const selected = document.getElementById("dropdown-selected");
  const insuranceInput = document.getElementById("insurance");

  // 선택된 값 설정
  selected.textContent = displayValue;
  insuranceInput.value = code;

  // 드롭다운 닫기
  toggleDropdown();
}

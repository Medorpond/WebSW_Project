function toggleDropdown() {
    const dropdownList = document.getElementById("dropdown-list");
    dropdownList.classList.toggle("hidden");
  
    const arrow = document.querySelector(".dropdown-arrow");
    arrow.textContent = dropdownList.classList.contains("hidden") ? "▼" : "▲";
  }
  
  function selectItem(value) {
    const selected = document.getElementById("dropdown-selected");
    selected.textContent = value;
  
    toggleDropdown();
  }
  
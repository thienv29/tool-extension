document.addEventListener("DOMContentLoaded", function () {
  // Configuration for UI groups and items
  const UI_CONFIG = {
    groups: [
      {
        name: "SGU",
        items: [
          { id: "autoLoginSgu", label: "Auto Login SGU" },
        ],
      },
      {
        name: "ICLC",
        items: [
          { id: "autoLoginICLC", label: "Auto Login I-CLC.NET (DEMO)" },
          { id: "autoLoginEmailPro24", label: "Auto Login Email (pro24.emailserver.vn:2096)" },
          { id: "restyleICLC", label: "Restyle" },
          { id: "restyleDigischool", label: "Restyle Digischool" },
          { id: "autoDigischoolAdmin", label: "Login Digischool Admin" },
          { id: "autoLoginPleskAdmin", label: "Auto login Plesk" },
          { id: "autoLoginMatBao", label: "Auto login Matbao" },
          { id: "eclassOnlyShowError", label: "Auto hide header and sidebar of eClass website" },
          { id: "autoLoginBitrix", label: "Auto login bitrix Thien" },
          { id: "autoLoginBitrixAdmin", label: "Auto login bitrix Admin" },
        ],
      },
      {
        name: "Thanh Long",
        items: [
          { id: "copyTaskTitle", label: "Copy task title" },
          { id: "autoLoginEmailThanhlong", label: "Auto login Thanh Long mail" },
          { id: "autoLoginTekio", label: "Auto login tekio" },
        ],
      },
    ]
  };

  // Get all checkbox IDs for storage operations
  const checkboxIds = UI_CONFIG.groups.flatMap(group =>
    group.items.map(item => item.id)
  );

  /**
   * Create a Bootstrap card for a group
   * @param {Object} group - Group configuration
   * @returns {HTMLElement} - Card element
   */
  function createGroupCard(group) {
    const card = document.createElement("div");
    card.className = "card mt-2";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = group.name;

    cardBody.appendChild(title);

    // Create checkboxes for each item
    group.items.forEach(item => {
      const formCheck = createCheckbox(item);
      cardBody.appendChild(formCheck);
    });

    card.appendChild(cardBody);
    return card;
  }

  /**
   * Create a Bootstrap switch checkbox
   * @param {Object} item - Item configuration
   * @returns {HTMLElement} - Form check element
   */
  function createCheckbox(item) {
    const formCheck = document.createElement("div");
    formCheck.className = "form-check form-switch";

    const input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "checkbox";
    input.id = item.id;

    const label = document.createElement("label");
    label.className = "form-check-label";
    label.htmlFor = item.id;
    label.textContent = item.label;

    formCheck.appendChild(input);
    formCheck.appendChild(label);

    return formCheck;
  }

  /**
   * Initialize the popup interface
   */
  function initializePopup() {
    const container = document.getElementById("dynamicContainer");
    if (!container) {
      console.error("Container element not found");
      return;
    }

    // Clear existing content
    container.innerHTML = "";

    // Create and append group cards
    UI_CONFIG.groups.forEach(group => {
      const groupCard = createGroupCard(group);
      container.appendChild(groupCard);
    });

    // Load saved checkbox states
    loadCheckboxStates();
  }

  /**
   * Load checkbox states from Chrome storage
   */
  function loadCheckboxStates() {
    chrome.storage.sync.get(checkboxIds, function (result) {
      checkboxIds.forEach(function (checkboxId) {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
          checkbox.checked = result[checkboxId] || false;

          // Save state when changed
          checkbox.addEventListener("change", function () {
            chrome.storage.sync.set({ [checkboxId]: this.checked });
          });
        }
      });
    });
  }

  // Initialize the popup
  initializePopup();
});

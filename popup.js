document.addEventListener("DOMContentLoaded", function () {
  // Data
  const data = [
    {
      group: "SGU",
      items: [
        { checkboxId: "autoLoginSgu", label: "Auto Login SGU" },
      ],
    },
    {
      group: "ICLC",
      items: [
        { checkboxId: "autoLoginICLC", label: "Auto Login I-CLC.NET (DEMO)" },
        { checkboxId: "autoLoginEmailPro24", label: "Auto Login Email (pro24.emailserver.vn:2096)" },
        { checkboxId: "restyleICLC", label: "Restyle" },
        { checkboxId: "restyleDigischool", label: "Restyle Digischool" },
        { checkboxId: "autoLoginPleskAdmin", label: "Auto login Plesk" },
        { checkboxId: "autoLoginMatBao", label: "Auto login Matbao" },
        { checkboxId: "eclassOnlyShowError", label: "Auto hide header and sidebar of eClass website" },
        { checkboxId: "autoLoginBitrix", label: "Auto login bitrix Thien" },
        { checkboxId: "autoLoginBitrixAdmin", label: "Auto login bitrix Admin" },
      ],
    },
    {
      group: "Thanh Long",
      items: [
        { checkboxId: "copyTaskTitle", label: "Copy task title" },
        { checkboxId: "autoLoginEmailThanhlong", label: "Auto login Thanh Long mail" },
        { checkboxId: "autoLoginTekio", label: "Auto login tekio" },
      ],
    },
  ];

  const checkboxIds = data.flatMap(group => group.items.map(item => item.checkboxId));

  // Render HTML dynamically
  const dynamicContainer = document.getElementById("dynamicContainer");

  data.forEach(group => {
    const groupCard = document.createElement("div");
    groupCard.className = "card mt-2";

    const groupCardBody = document.createElement("div");
    groupCardBody.className = "card-body";

    const groupTitle = document.createElement("h3");
    groupTitle.className = "card-title";
    groupTitle.textContent = group.group;

    groupCardBody.appendChild(groupTitle);

    group.items.forEach(item => {
      const formCheck = document.createElement("div");
      formCheck.className = "form-check form-switch";

      const inputCheckbox = document.createElement("input");
      inputCheckbox.className = "form-check-input";
      inputCheckbox.type = "checkbox";
      inputCheckbox.id = item.checkboxId;

      const labelCheckbox = document.createElement("label");
      labelCheckbox.className = "form-check-label";
      labelCheckbox.htmlFor = item.checkboxId;
      labelCheckbox.textContent = item.label;

      formCheck.appendChild(inputCheckbox);
      formCheck.appendChild(labelCheckbox);

      groupCardBody.appendChild(formCheck);
    });

    groupCard.appendChild(groupCardBody);
    dynamicContainer.appendChild(groupCard);

  });

  const groupCardSearch = document.createElement("div");
  groupCardSearch.className = "card mt-2";
  const groupCardBody = document.createElement("div");
  groupCardBody.className = "card-body";

  const groupTitle = document.createElement("h3");
  groupTitle.className = "card-title";
  groupTitle.textContent = 'Account iclc';

  groupCardBody.appendChild(groupTitle);
  groupCardSearch.appendChild(groupCardBody);
  dynamicContainer.appendChild(groupCardSearch);

  // Retrieve and update stored checkbox states
  chrome.storage.sync.get(checkboxIds, function (result) {
    checkboxIds.forEach(function (checkboxId) {
      const checkbox = document.getElementById(checkboxId);
      checkbox.checked = result[checkboxId] || false;

      checkbox.addEventListener("change", function () {
        chrome.storage.sync.set({ [checkboxId]: this.checked });
      });
    });
  });
});

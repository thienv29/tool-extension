const HOST_NAMES = {
  tekio: "tekio.vn",
  iclcDotNet: "ib.edu.vn",
  eclass: "eclass.edu.vn",
  eclassLocal: "localhost",
  emailPro24: "mail.i-clc.edu.vn",
  emailThanhlong: "mail.thanhlonggroups.com",
  plesk: "103.15.51.187",
  bitrix: "anhnguiclc.com",
  digischool: "digischool.vn"
};

const CREDENTIALS = {
  autoLoginSgu: {
    username: "3119560069",
    password: "16112001x"
  },
  autoLoginICLC: {
    username: "thienvu",
    password: "helloiclc"
  },
  autoLoginPleskAdmin: {
    username: "administrator",
    password: "iclcit13579@@"
  },
  autoLoginEmailPro24: {
    username: "thienvu@i-clc.edu.vn",
    password: "Hello2023@"
  },
  autoLoginEmailThanhlong: {
    username: "thienvq.tp@thanhlonggroups.com",
    password: "Thepos@123"
  },
  autoLoginTekio: {
    username: "thien.vu",
    password: "12345678"
  },
  autoLoginBitrix: {
    username: "thienvu@i-clc.edu.vn",
    password: "Hello2024@"
  },
  autoLoginBitrixAdmin: {
    username: "admin",
    password: "Admin@@2526"
  },
  restyleDigischool:{

  },
  copyTaskTitle:{

  },
  eclassOnlyShowError:{

  }
};

window.onload = function () {
  chrome.storage.sync.get(Object.keys(CREDENTIALS), function (result) {
    for (const [key, value] of Object.entries(result)) {
      result[key] = value || false;
    }

    autoLogin(result);
    restyleICLC(result);
    restyleDigischool(result);
    copyTaskTitle(result);
    eclassOnlyShowError(result);
  });
};

function autoLogin(credentials) {
  const currentHostName = window.location.hostname;

  if (credentials.autoLoginSgu && currentHostName === HOST_NAMES.iclcDotNet) {
    setInterval(() => {
      const usernameSgu = document.querySelector("#user");
      const passSgu = document.querySelector("#pass");
      const submitLoginSgu = document.querySelector("#btn_logon");
      if (usernameSgu) {
        usernameSgu.value = CREDENTIALS.autoLoginSgu.username;
        passSgu.value = CREDENTIALS.autoLoginSgu.password;
        submitLoginSgu.click();
      }
    }, 1000);
  }

  if (credentials.autoLoginICLC && currentHostName === HOST_NAMES.iclcDotNet) {
    const usernameICLC = document.querySelector("#ctl00_MainContent_LoginUser_UserName");
    const passICLC = document.querySelector("#ctl00_MainContent_LoginUser_Password");
    const rememICLC = document.querySelector("#ctl00_MainContent_LoginUser_RememberMe");
    const submitLoginICLC = document.querySelector("#ctl00_MainContent_LoginUser_LoginButton");
    if (usernameICLC) {
      usernameICLC.value = CREDENTIALS.autoLoginICLC.username;
      passICLC.value = CREDENTIALS.autoLoginICLC.password;
      rememICLC.checked = true;
      submitLoginICLC.click();
    }
  }

  if (credentials.autoLoginPleskAdmin && currentHostName === HOST_NAMES.plesk) {
    const usernamePlesk = document.querySelector("#login_name");
    const passPlesk = document.querySelector("#passwd");
    if (usernamePlesk) {
      usernamePlesk.value = CREDENTIALS.autoLoginPleskAdmin.username;
      passPlesk.value = CREDENTIALS.autoLoginPleskAdmin.password;
      console.log(usernamePlesk.value, passPlesk.value);
    }
  }

  if (credentials.autoLoginEmailPro24 && currentHostName === HOST_NAMES.emailPro24) {
    const usernameICLC = document.querySelector("#username");
    const passICLC = document.querySelector("#password");
    const submitLoginICLC = document.querySelector("#login-button");
    if (usernameICLC) {
      usernameICLC.value = CREDENTIALS.autoLoginEmailPro24.username;
      passICLC.value = CREDENTIALS.autoLoginEmailPro24.password;
      submitLoginICLC.click();
    }
  }

  if (credentials.autoLoginEmailThanhlong && currentHostName === HOST_NAMES.emailThanhlong) {
    const usernameICLC = document.querySelector("#login_form #user");
    const passICLC = document.querySelector("#login_form #pass");
    const submitLoginICLC = document.querySelector("#login_submit");
    if (usernameICLC) {
      usernameICLC.value = CREDENTIALS.autoLoginEmailThanhlong.username;
      passICLC.value = CREDENTIALS.autoLoginEmailThanhlong.password;
      submitLoginICLC.click();
    }
  }

  if (credentials.autoLoginTekio && currentHostName === HOST_NAMES.tekio) {
    const usernameTekio = document.querySelector("#username");
    const passTekio = document.querySelector("#password");
    const submitLoginTekio = document.querySelector("#login-submit");
    if (usernameTekio) {
      usernameTekio.value = CREDENTIALS.autoLoginTekio.username;
      passTekio.value = CREDENTIALS.autoLoginTekio.password;
      submitLoginTekio.click();
    }
  }
  if (credentials.autoLoginBitrix && currentHostName === HOST_NAMES.bitrix) {
    const usernameTekio = document.querySelector('input[name="USER_LOGIN"]');
    const passTekio = document.querySelector('input[name="USER_PASSWORD"]');
    const checkRemember = document.querySelector('#USER_REMEMBER');
    const submitLoginTekio = document.querySelector(".login-btn");
    if (usernameTekio) {
      usernameTekio.value = CREDENTIALS.autoLoginBitrix.username;
      passTekio.value = CREDENTIALS.autoLoginBitrix.password;
      checkRemember.checked = true;
      submitLoginTekio.click();
    }
  }
  if (credentials.autoLoginBitrixAdmin && currentHostName === HOST_NAMES.bitrix) {
    const usernameTekio = document.querySelector('input[name="USER_LOGIN"]');
    const passTekio = document.querySelector('input[name="USER_PASSWORD"]');
    const checkRemember = document.querySelector('#USER_REMEMBER');
    const submitLoginTekio = document.querySelector(".login-btn");
    if (usernameTekio) {
      usernameTekio.value = CREDENTIALS.autoLoginBitrixAdmin.username;
      passTekio.value = CREDENTIALS.autoLoginBitrixAdmin.password;
      checkRemember.checked = true;
      submitLoginTekio.click();
    }
  }
}

function restyleICLC(credentials) {
  if (credentials.restyleICLC && window.location.hostname === HOST_NAMES.iclcDotNet) {
    const style = document.createElement("style");
    style.textContent = `
      .page {
        min-width: 960px;
        width: 100%;
        margin: 0;
        padding: 0;
        min-height: 100%;
      }
      /* Add other CSS rules here */
    `;
    document.head.appendChild(style);
  }
}
function restyleDigischool(credentials) {
  console.log('asdasd asd asd ', credentials.restyleDigischool, window.location.hostname);
  
  if (credentials.restyleDigischool && window.location.hostname === HOST_NAMES.digischool) {
    console.log('vao day chua');
    
    const style = document.createElement("style");
    style.textContent = `
      .condition-group .rules{
  display: flex;
  flex-wrap: wrap;
}

/* tuỳ chỉnh .rule */
.condition-group .rule{
  width: 30%;
}
    `;
    document.head.appendChild(style);
  }
}

function copyTaskTitle(credentials) {
  if (credentials.copyTaskTitle && window.location.hostname === HOST_NAMES.tekio) {
    const taskId = document.querySelector("#content > h2.inline-flex");
    const title = document.querySelector("#content > .issue .subject");
    if (taskId) {
      taskId.style.cursor = "pointer";
      taskId.onclick = () => {
        const textCopy = `[Issue ${taskId.innerText.split('#')[1]}] ${title.innerText}`;
        navigator.clipboard.writeText(textCopy);
      };
    }
  }
}

function eclassOnlyShowError(credentials) {
  if (credentials.eclassOnlyShowError && (window.location.hostname === HOST_NAMES.eclass||window.location.hostname === HOST_NAMES.eclassLocal)) {
    const header = document.querySelector(".navbar.navbar-default.navbar-static-top");
    const sidebar = document.querySelector("#sidebar");
    if (header) header.remove()
    if (sidebar) sidebar.remove()
  }
}

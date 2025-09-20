// Configuration constants
const HOST_NAMES = {
  tekio: "tekio.vn",
  iclcDotNet: "i-clc.net",
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
  }
};

const LOGIN_SELECTORS = {
  sgu: {
    username: "#user",
    password: "#pass",
    submit: "#btn_logon"
  },
  iclc: {
    username: "#ctl00_MainContent_LoginUser_UserName",
    password: "#ctl00_MainContent_LoginUser_Password",
    remember: "#ctl00_MainContent_LoginUser_RememberMe",
    submit: "#ctl00_MainContent_LoginUser_LoginButton"
  },
  plesk: {
    username: "#login_name",
    password: "#passwd"
  },
  emailPro24: {
    username: "#username",
    password: "#password",
    submit: "#login-button"
  },
  emailThanhlong: {
    username: "#login_form #user",
    password: "#login_form #pass",
    submit: "#login_submit"
  },
  tekio: {
    username: "#username",
    password: "#password",
    submit: "#login-submit"
  },
  bitrix: {
    username: 'input[name="USER_LOGIN"]',
    password: 'input[name="USER_PASSWORD"]',
    remember: '#USER_REMEMBER',
    submit: ".login-btn"
  }
};

// Service configurations mapping checkbox IDs to their configurations
const SERVICES = {
  autoLoginSgu: {
    hostname: HOST_NAMES.iclcDotNet,
    selectors: LOGIN_SELECTORS.sgu,
    credentials: CREDENTIALS.autoLoginSgu
  },
  autoLoginICLC: {
    hostname: HOST_NAMES.iclcDotNet,
    selectors: LOGIN_SELECTORS.iclc,
    credentials: CREDENTIALS.autoLoginICLC,
    options: { remember: true }
  },
  autoLoginPleskAdmin: {
    hostname: HOST_NAMES.plesk,
    selectors: LOGIN_SELECTORS.plesk,
    credentials: CREDENTIALS.autoLoginPleskAdmin,
    options: { submit: false }
  },
  autoLoginEmailPro24: {
    hostname: HOST_NAMES.emailPro24,
    selectors: LOGIN_SELECTORS.emailPro24,
    credentials: CREDENTIALS.autoLoginEmailPro24
  },
  autoLoginEmailThanhlong: {
    hostname: HOST_NAMES.emailThanhlong,
    selectors: LOGIN_SELECTORS.emailThanhlong,
    credentials: CREDENTIALS.autoLoginEmailThanhlong
  },
  autoLoginTekio: {
    hostname: HOST_NAMES.tekio,
    selectors: LOGIN_SELECTORS.tekio,
    credentials: CREDENTIALS.autoLoginTekio
  },
  autoLoginBitrix: {
    hostname: HOST_NAMES.bitrix,
    selectors: LOGIN_SELECTORS.bitrix,
    credentials: CREDENTIALS.autoLoginBitrix,
    options: { remember: true }
  },
  autoLoginBitrixAdmin: {
    hostname: HOST_NAMES.bitrix,
    selectors: LOGIN_SELECTORS.bitrix,
    credentials: CREDENTIALS.autoLoginBitrixAdmin,
    options: { remember: true }
  }
};

// Initialize extension when page loads
window.onload = function () {
  chrome.storage.sync.get(Object.keys(CREDENTIALS), function (result) {
    // Set default values for missing settings
    for (const [key, value] of Object.entries(result)) {
      result[key] = value || false;
    }

    // Execute enabled services
    executeServices(result);
  });
};

/**
 * Execute all enabled services
 * @param {Object} settings - User settings from storage
 */
function executeServices(settings) {
  const currentHost = window.location.hostname;

  // Execute auto-login services
  Object.entries(SERVICES).forEach(([serviceId, config]) => {
    if (settings[serviceId] && currentHost === config.hostname) {
      executeLoginService(serviceId, config);
    }
  });

  // Execute styling services
  if (settings.restyleICLC && currentHost === HOST_NAMES.iclcDotNet) {
    applyICLCStyling();
  }

  if (settings.restyleDigischool && currentHost === HOST_NAMES.digischool) {
    applyDigischoolStyling();
  }

  // Execute utility services
  if (settings.copyTaskTitle && currentHost === HOST_NAMES.tekio) {
    enableTaskTitleCopy();
  }

  if (settings.eclassOnlyShowError &&
      (currentHost === HOST_NAMES.eclass || currentHost === HOST_NAMES.eclassLocal)) {
    hideEclassInterface();
  }
}

/**
 * Execute a specific login service
 * @param {string} serviceId - Service identifier
 * @param {Object} config - Service configuration
 */
async function executeLoginService(serviceId, config) {
  console.log(`Executing login service: ${serviceId}`);

  const success = await LoginUtils.performLogin(
    config.selectors,
    config.credentials.username,
    config.credentials.password,
    config.options || {}
  );

  if (success) {
    console.log(`Successfully logged into ${serviceId}`);
  } else {
    console.error(`Failed to login to ${serviceId}`);
  }
}

/**
 * Apply ICLC styling
 */
function applyICLCStyling() {
  const css = `
    .page {
      min-width: 960px;
      width: 100%;
      margin: 0;
      padding: 0;
      min-height: 100%;
    }
  `;
  LoginUtils.applyStyles(css);
}

/**
 * Apply Digischool styling
 */
function applyDigischoolStyling() {
  const css = `
    .condition-group .rules {
      display: flex;
      flex-wrap: wrap;
    }
    .condition-group .rule {
      width: 30%;
    }
  `;
  LoginUtils.applyStyles(css);
}

/**
 * Enable task title copying functionality
 */
async function enableTaskTitleCopy() {
  const taskIdElement = await LoginUtils.waitForElement("#content > h2.inline-flex");
  const titleElement = document.querySelector("#content > .issue .subject");

  if (taskIdElement && titleElement) {
    taskIdElement.style.cursor = "pointer";
    taskIdElement.onclick = () => {
      const taskId = taskIdElement.innerText.split('#')[1];
      const textCopy = `[Issue ${taskId}] ${titleElement.innerText}`;
      navigator.clipboard.writeText(textCopy);
    };
  }
}

/**
 * Hide header and sidebar on eClass
 */
function hideEclassInterface() {
  const header = document.querySelector(".navbar.navbar-default.navbar-static-top");
  const sidebar = document.querySelector("#sidebar");

  if (header) header.remove();
  if (sidebar) sidebar.remove();
}

// Utility class for login operations
class LoginUtils {
  /**
   * Safely query DOM elements with error handling
   * @param {string} selector - CSS selector
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<Element|null>} - Found element or null
   */
  static async waitForElement(selector, timeout = 5000) {
    return new Promise((resolve) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeout);
    });
  }

  /**
   * Fill login form and submit
   * @param {Object} selectors - Object containing CSS selectors
   * @param {string} username - Username to fill
   * @param {string} password - Password to fill
   * @param {Object} options - Additional options
   */
  static async performLogin(selectors, username, password, options = {}) {
    try {
      const { remember = false, submit = true } = options;

      // Wait for and fill username
      const usernameField = await this.waitForElement(selectors.username);
      if (!usernameField) {
        throw new Error(`Username field not found: ${selectors.username}`);
      }
      usernameField.value = username;

      // Wait for and fill password
      const passwordField = await this.waitForElement(selectors.password);
      if (!passwordField) {
        throw new Error(`Password field not found: ${selectors.password}`);
      }
      passwordField.value = password;

      // Handle remember me checkbox if present
      if (remember && selectors.remember) {
        const rememberField = await this.waitForElement(selectors.remember);
        if (rememberField) {
          rememberField.checked = true;
        }
      }

      // Submit form if requested
      if (submit && selectors.submit) {
        const submitButton = await this.waitForElement(selectors.submit);
        if (submitButton) {
          submitButton.click();
          return true;
        } else {
          throw new Error(`Submit button not found: ${selectors.submit}`);
        }
      }

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  /**
   * Apply custom styles to page
   * @param {string} css - CSS rules to apply
   */
  static applyStyles(css) {
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }
}

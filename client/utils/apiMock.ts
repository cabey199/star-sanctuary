// API Mock for development and first-time setup
// This simulates the backend API endpoints until a real backend is implemented

interface MockUser {
  id: string;
  username: string;
  email: string;
  role: "mother_admin" | "subadmin";
  permissions: Record<string, boolean>;
  createdAt: string;
  lastLogin?: string;
}

interface MockResponse {
  success: boolean;
  message?: string;
  data?: any;
  token?: string;
  user?: MockUser;
}

class APIAuth {
  private static STORAGE_KEY = "mock_system_data";

  // Force initialize demo system (for debugging)
  static forceInitializeDemoSystem() {
    console.log("Force initializing demo system");
    const systemData = this.createDemoSystem();
    this.saveSystemData(systemData);
    console.log("Demo system force created:", systemData);
    return systemData;
  }

  // Get system data from localStorage
  private static getSystemData() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // Save system data to localStorage
  private static saveSystemData(data: any) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

    // Check if system is initialized (has mother admin)
  static checkSystemStatus(): { initialized: boolean; adminExists: boolean } {
    let systemData = this.getSystemData();
    console.log("Checking system status, current data:", systemData);

    // Auto-initialize with demo account if no data exists
    if (!systemData) {
      console.log("No system data found, creating demo system");
      systemData = this.createDemoSystem();
      this.saveSystemData(systemData);
      console.log("Demo system created:", systemData);
    }

    const hasMotherAdmin = systemData?.users?.some(
      (user: MockUser) => user.role === "mother_admin",
    );

    const result = {
      initialized: !!systemData && hasMotherAdmin,
      adminExists: hasMotherAdmin,
    };
    console.log("System status result:", result);

    return result;
  }

  // Create demo system for instant testing
  private static createDemoSystem() {
    const motherId = "demo_mother_admin";
    const token = "demo_token_" + Date.now();

    const motherAdmin: MockUser = {
      id: motherId,
      username: "admin",
      email: "admin@bookingwithcal.com",
      role: "mother_admin",
      permissions: {
        manageUsers: true,
        manageClients: true,
        viewAnalytics: true,
        manageSettings: true,
        manageSystem: true,
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    return {
      initialized: true,
      company: {
        name: "BookingWithCal Demo",
        website: "https://bookingwithcal.com",
        phone: "+1 555 123 4567",
      },
      users: [motherAdmin],
      sessions: [],
    };
  }

  // Initialize system with mother admin
  static initializeSystem(setupData: {
    companyName: string;
    adminUsername: string;
    adminEmail: string;
    adminPassword: string;
    companyWebsite?: string;
    companyPhone?: string;
  }): MockResponse {
    try {
      const { initialized } = this.checkSystemStatus();

      if (initialized) {
        return {
          success: false,
          message: "System is already initialized",
        };
      }

      const motherId = "mother_admin_" + Date.now();
      const token = "mock_token_" + Date.now();

      const motherAdmin: MockUser = {
        id: motherId,
        username: setupData.adminUsername,
        email: setupData.adminEmail,
        role: "mother_admin",
        permissions: {
          manageUsers: true,
          manageClients: true,
          viewAnalytics: true,
          manageSettings: true,
          manageSystem: true,
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      const systemData = {
        initialized: true,
        company: {
          name: setupData.companyName,
          website: setupData.companyWebsite,
          phone: setupData.companyPhone,
        },
        users: [motherAdmin],
        sessions: [
          {
            userId: motherId,
            token: token,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000,
            ).toISOString(), // 7 days
          },
        ],
      };

      this.saveSystemData(systemData);

      return {
        success: true,
        message: "System initialized successfully",
        token: token,
        user: motherAdmin,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to initialize system",
      };
    }
  }

    // User login
  static login(username: string, password: string): MockResponse {
    try {
      console.log(`Login attempt for username: "${username}", password: "${password}"`);
      const systemData = this.getSystemData();
      console.log("System data:", systemData);

      if (!systemData || !systemData.users) {
        console.log("System not initialized");
        return {
          success: false,
          message: "System not initialized",
        };
      }

      const user = systemData.users.find(
        (u: MockUser) => u.username === username,
      );

      console.log("Found user:", user);
      console.log("Available users:", systemData.users.map(u => ({ username: u.username, role: u.role })));

      if (!user) {
        console.log("User not found");
        return {
          success: false,
          message: "Invalid username or password",
        };
      }

      // For demo: accept any password for "admin" user or the actual password for others
      if (user.username === "admin") {
        // Demo admin - accept any non-empty password
        if (!password) {
          return {
            success: false,
            message: "Password required",
          };
        }
      } else {
        // For other users, require specific password (in real app, this would be hashed)
        if (!password || password.length < 3) {
          return {
            success: false,
            message: "Invalid username or password",
          };
        }
      }

      const token = "mock_token_" + Date.now();

      // Update last login
      user.lastLogin = new Date().toISOString();

      // Add session
      if (!systemData.sessions) {
        systemData.sessions = [];
      }

      systemData.sessions.push({
        userId: user.id,
        token: token,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

      this.saveSystemData(systemData);

      return {
        success: true,
        message: "Login successful",
        token: token,
        user: user,
      };
    } catch (error) {
      return {
        success: false,
        message: "Login failed",
      };
    }
  }

  // Verify token
  static verifyToken(token: string): MockResponse {
    try {
      const systemData = this.getSystemData();

      if (!systemData || !systemData.sessions) {
        return {
          success: false,
          message: "Invalid session",
        };
      }

      const session = systemData.sessions.find((s: any) => s.token === token);

      if (!session) {
        return {
          success: false,
          message: "Invalid token",
        };
      }

      // Check if token is expired
      if (new Date(session.expiresAt) < new Date()) {
        return {
          success: false,
          message: "Token expired",
        };
      }

      const user = systemData.users.find(
        (u: MockUser) => u.id === session.userId,
      );

      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: true,
        user: user,
      };
    } catch (error) {
      return {
        success: false,
        message: "Token verification failed",
      };
    }
  }

  // Logout
  static logout(token: string): MockResponse {
    try {
      const systemData = this.getSystemData();

      if (systemData && systemData.sessions) {
        systemData.sessions = systemData.sessions.filter(
          (s: any) => s.token !== token,
        );
        this.saveSystemData(systemData);
      }

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Logout failed",
      };
    }
  }
}

// Intercept fetch calls to mock API endpoints
const originalFetch = window.fetch;

// Helper function to safely parse request body
async function parseRequestBody(options?: RequestInit): Promise<any> {
  if (!options?.body) return {};

  try {
    // Handle different body types
    if (typeof options.body === "string") {
      return JSON.parse(options.body);
    } else if (options.body instanceof FormData) {
      // Convert FormData to object
      const obj: any = {};
      for (const [key, value] of options.body.entries()) {
        obj[key] = value;
      }
      return obj;
    } else if (options.body instanceof ReadableStream) {
      // Handle stream by reading it
      const reader = options.body.getReader();
      const chunks: Uint8Array[] = [];
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) chunks.push(value);
      }

      const decoder = new TextDecoder();
      const text = decoder.decode(new Uint8Array(chunks.reduce((acc, chunk) => acc.concat(Array.from(chunk)), [] as number[])));
      return JSON.parse(text);
    } else {
      // Try to stringify and parse
      const text = JSON.stringify(options.body);
      return JSON.parse(text);
    }
  } catch (err) {
    console.error("Failed to parse request body:", err);
    return {};
  }
}

window.fetch = async function (
  url: string | URL | Request,
  options?: RequestInit,
) {
  const urlString = url.toString();

  // Mock API endpoints
  if (urlString.includes("/api/setup/status")) {
    const status = APIAuth.checkSystemStatus();
    return new Response(JSON.stringify(status), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (urlString.includes("/api/setup/initialize")) {
    const body = await parseRequestBody(options);
    const result = APIAuth.initializeSystem(body);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { "Content-Type": "application/json" },
    });
  }

    if (urlString.includes("/api/auth/login")) {
    const body = await parseRequestBody(options);
    console.log("Login attempt:", body); // Debug log

    // Ensure we have both username and password
    if (!body.username || !body.password) {
      return new Response(JSON.stringify({
        success: false,
        message: "Username and password required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = APIAuth.login(body.username, body.password);
    console.log("Login result:", result); // Debug log
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (urlString.includes("/api/auth/verify")) {
    const authorization = options?.headers?.[
      "Authorization" as keyof HeadersInit
    ] as string;
    const token = authorization?.replace("Bearer ", "");
    const result = APIAuth.verifyToken(token || "");
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (urlString.includes("/api/auth/logout")) {
    const authorization = options?.headers?.[
      "Authorization" as keyof HeadersInit
    ] as string;
    const token = authorization?.replace("Bearer ", "");
    const result = APIAuth.logout(token || "");
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // For all other API calls, return a mock response or call original fetch
  if (urlString.includes("/api/")) {
    // Mock other API endpoints as needed
    return new Response(JSON.stringify({ success: true, data: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // For non-API calls, use original fetch
  return originalFetch(url, options);
};

// Force initialize demo system on load for reliable preview access
APIAuth.forceInitializeDemoSystem();

export default APIAuth;

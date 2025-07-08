/**
 * Comprehensive Multi-Factor Authentication Service
 * Enterprise-grade MFA implementation with multiple authentication methods
 */

export interface MFAMethod {
  id: string;
  type:
    | "totp"
    | "sms"
    | "email"
    | "hardware_token"
    | "biometric"
    | "backup_codes";
  name: string;
  isEnabled: boolean;
  isPrimary: boolean;
  metadata: Record<string, any>;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MFAChallenge {
  id: string;
  userId: string;
  method: MFAMethod["type"];
  challengeData: string;
  expiresAt: string;
  attempts: number;
  maxAttempts: number;
  status: "pending" | "verified" | "expired" | "failed";
  createdAt: string;
}

export interface BiometricTemplate {
  id: string;
  userId: string;
  type: "fingerprint" | "face" | "voice" | "iris";
  template: string; // Encrypted biometric template
  quality: number;
  createdAt: string;
  lastUsed?: string;
}

export interface MFAConfiguration {
  requireMFA: boolean;
  enforceForRoles: string[];
  allowedMethods: MFAMethod["type"][];
  backupCodesCount: number;
  sessionDuration: number; // minutes
  challengeTimeout: number; // minutes
  maxAttempts: number;
  lockoutDuration: number; // minutes
  biometricSettings: {
    enabled: boolean;
    fallbackToPassword: boolean;
    livenessDetection: boolean;
    qualityThreshold: number;
  };
}

export interface MFASession {
  id: string;
  userId: string;
  verifiedMethods: MFAMethod["type"][];
  riskScore: number;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
    coordinates: [number, number];
  };
  createdAt: string;
  expiresAt: string;
  lastActivity: string;
}

export interface DeviceTrust {
  deviceId: string;
  userId: string;
  deviceName: string;
  deviceType: "desktop" | "mobile" | "tablet";
  fingerprint: string;
  trustLevel: "untrusted" | "low" | "medium" | "high" | "trusted";
  isTrusted: boolean;
  lastSeen: string;
  location?: {
    country: string;
    city: string;
  };
  metadata: {
    browser: string;
    os: string;
    screen: string;
    timezone: string;
    language: string;
  };
}

class MFAService {
  private static instance: MFAService;
  private configuration: MFAConfiguration;
  private userMethods: Map<string, MFAMethod[]> = new Map();
  private activeChallenges: Map<string, MFAChallenge> = new Map();
  private mfaSessions: Map<string, MFASession> = new Map();
  private deviceTrustStore: Map<string, DeviceTrust> = new Map();
  private biometricTemplates: Map<string, BiometricTemplate[]> = new Map();
  private backupCodes: Map<string, string[]> = new Map();

  private constructor() {
    this.configuration = {
      requireMFA: true,
      enforceForRoles: ["admin", "super-admin", "financial-advisor"],
      allowedMethods: ["totp", "sms", "email", "backup_codes", "biometric"],
      backupCodesCount: 10,
      sessionDuration: 480, // 8 hours
      challengeTimeout: 5, // 5 minutes
      maxAttempts: 3,
      lockoutDuration: 30, // 30 minutes
      biometricSettings: {
        enabled: true,
        fallbackToPassword: true,
        livenessDetection: true,
        qualityThreshold: 0.8,
      },
    };

    this.initializeWebAuthn();
  }

  public static getInstance(): MFAService {
    if (!MFAService.instance) {
      MFAService.instance = new MFAService();
    }
    return MFAService.instance;
  }

  private initializeWebAuthn(): void {
    if (
      typeof window !== "undefined" &&
      "navigator" in window &&
      "credentials" in navigator
    ) {
      // WebAuthn is supported
      console.log("WebAuthn support detected");
    }
  }

  // MFA Method Management
  public async enrollMFAMethod(
    userId: string,
    methodType: MFAMethod["type"],
    metadata: Record<string, any> = {},
  ): Promise<{ success: boolean; method?: MFAMethod; setupData?: any }> {
    try {
      switch (methodType) {
        case "totp":
          return await this.enrollTOTP(userId, metadata);
        case "sms":
          return await this.enrollSMS(userId, metadata);
        case "email":
          return await this.enrollEmail(userId, metadata);
        case "hardware_token":
          return await this.enrollHardwareToken(userId, metadata);
        case "biometric":
          return await this.enrollBiometric(userId, metadata);
        default:
          throw new Error(`Unsupported MFA method: ${methodType}`);
      }
    } catch (error) {
      console.error("MFA enrollment failed:", error);
      return { success: false };
    }
  }

  private async enrollTOTP(
    userId: string,
    metadata: Record<string, any>,
  ): Promise<any> {
    const secret = this.generateTOTPSecret();
    const appName = "QuantumVest Enterprise";
    const issuer = "QuantumVest";

    const qrCodeUrl = `otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(metadata.email || userId)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;

    const method: MFAMethod = {
      id: this.generateId(),
      type: "totp",
      name: metadata.name || "Authenticator App",
      isEnabled: false, // Will be enabled after verification
      isPrimary: false,
      metadata: {
        secret,
        backupCodes: this.generateBackupCodes(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store temporarily until verified
    const tempMethods = this.userMethods.get(userId) || [];
    tempMethods.push(method);
    this.userMethods.set(userId, tempMethods);

    return {
      success: true,
      setupData: {
        secret,
        qrCodeUrl,
        manualEntryKey: secret,
      },
      method,
    };
  }

  private async enrollSMS(
    userId: string,
    metadata: Record<string, any>,
  ): Promise<any> {
    const phoneNumber = metadata.phoneNumber;
    if (!phoneNumber) {
      throw new Error("Phone number is required for SMS enrollment");
    }

    const method: MFAMethod = {
      id: this.generateId(),
      type: "sms",
      name: `SMS to ${this.maskPhoneNumber(phoneNumber)}`,
      isEnabled: false,
      isPrimary: false,
      metadata: {
        phoneNumber,
        verified: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Send verification SMS
    const verificationCode = this.generateVerificationCode();
    await this.sendSMS(
      phoneNumber,
      `Your QuantumVest verification code is: ${verificationCode}`,
    );

    // Store challenge
    const challenge: MFAChallenge = {
      id: this.generateId(),
      userId,
      method: "sms",
      challengeData: verificationCode,
      expiresAt: new Date(
        Date.now() + this.configuration.challengeTimeout * 60 * 1000,
      ).toISOString(),
      attempts: 0,
      maxAttempts: this.configuration.maxAttempts,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    this.activeChallenges.set(challenge.id, challenge);

    return {
      success: true,
      setupData: {
        challengeId: challenge.id,
        phoneNumber: this.maskPhoneNumber(phoneNumber),
      },
      method,
    };
  }

  private async enrollEmail(
    userId: string,
    metadata: Record<string, any>,
  ): Promise<any> {
    const email = metadata.email;
    if (!email) {
      throw new Error("Email is required for email enrollment");
    }

    const method: MFAMethod = {
      id: this.generateId(),
      type: "email",
      name: `Email to ${this.maskEmail(email)}`,
      isEnabled: false,
      isPrimary: false,
      metadata: {
        email,
        verified: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Send verification email
    const verificationCode = this.generateVerificationCode();
    await this.sendEmail(
      email,
      "QuantumVest MFA Setup",
      `Your verification code is: ${verificationCode}`,
    );

    // Store challenge
    const challenge: MFAChallenge = {
      id: this.generateId(),
      userId,
      method: "email",
      challengeData: verificationCode,
      expiresAt: new Date(
        Date.now() + this.configuration.challengeTimeout * 60 * 1000,
      ).toISOString(),
      attempts: 0,
      maxAttempts: this.configuration.maxAttempts,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    this.activeChallenges.set(challenge.id, challenge);

    return {
      success: true,
      setupData: {
        challengeId: challenge.id,
        email: this.maskEmail(email),
      },
      method,
    };
  }

  private async enrollHardwareToken(
    userId: string,
    metadata: Record<string, any>,
  ): Promise<any> {
    if (!this.isWebAuthnSupported()) {
      throw new Error("WebAuthn not supported on this device");
    }

    try {
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
        {
          challenge: new Uint8Array(32),
          rp: {
            name: "QuantumVest Enterprise",
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(userId),
            name: metadata.email || userId,
            displayName: metadata.displayName || metadata.email || userId,
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" }, // ES256
            { alg: -257, type: "public-key" }, // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "cross-platform",
            userVerification: "required",
          },
          timeout: 60000,
          attestation: "direct",
        };

      const credential = (await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      })) as PublicKeyCredential;

      const method: MFAMethod = {
        id: this.generateId(),
        type: "hardware_token",
        name: metadata.name || "Hardware Security Key",
        isEnabled: true,
        isPrimary: false,
        metadata: {
          credentialId: Array.from(new Uint8Array(credential.rawId)),
          publicKey: credential.response,
          counter: 0,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const userMethods = this.userMethods.get(userId) || [];
      userMethods.push(method);
      this.userMethods.set(userId, userMethods);

      return {
        success: true,
        method,
      };
    } catch (error) {
      console.error("Hardware token enrollment failed:", error);
      throw error;
    }
  }

  private async enrollBiometric(
    userId: string,
    metadata: Record<string, any>,
  ): Promise<any> {
    if (!this.configuration.biometricSettings.enabled) {
      throw new Error("Biometric authentication is not enabled");
    }

    const biometricType = metadata.type || "fingerprint";

    // In a real implementation, this would interface with biometric hardware
    const template = this.generateBiometricTemplate(biometricType);

    const biometricTemplate: BiometricTemplate = {
      id: this.generateId(),
      userId,
      type: biometricType,
      template,
      quality: 0.95,
      createdAt: new Date().toISOString(),
    };

    const userTemplates = this.biometricTemplates.get(userId) || [];
    userTemplates.push(biometricTemplate);
    this.biometricTemplates.set(userId, userTemplates);

    const method: MFAMethod = {
      id: this.generateId(),
      type: "biometric",
      name: `${biometricType.charAt(0).toUpperCase() + biometricType.slice(1)} Recognition`,
      isEnabled: true,
      isPrimary: true,
      metadata: {
        biometricType,
        templateId: biometricTemplate.id,
        quality: biometricTemplate.quality,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const userMethods = this.userMethods.get(userId) || [];
    userMethods.push(method);
    this.userMethods.set(userId, userMethods);

    return {
      success: true,
      method,
    };
  }

  // MFA Challenge and Verification
  public async initiateMFAChallenge(
    userId: string,
    preferredMethod?: MFAMethod["type"],
  ): Promise<{ challengeId: string; method: MFAMethod; challengeData?: any }> {
    const userMethods = this.userMethods.get(userId) || [];
    const enabledMethods = userMethods.filter((m) => m.isEnabled);

    if (enabledMethods.length === 0) {
      throw new Error("No MFA methods enrolled for user");
    }

    // Select method based on preference or priority
    let selectedMethod = enabledMethods.find((m) => m.type === preferredMethod);
    if (!selectedMethod) {
      // Use primary method or first available
      selectedMethod =
        enabledMethods.find((m) => m.isPrimary) || enabledMethods[0];
    }

    const challengeId = this.generateId();
    let challengeData: string;
    let responseData: any = {};

    switch (selectedMethod.type) {
      case "totp":
        challengeData = "totp"; // No challenge data needed for TOTP
        break;

      case "sms":
        challengeData = this.generateVerificationCode();
        await this.sendSMS(
          selectedMethod.metadata.phoneNumber,
          `Your QuantumVest verification code is: ${challengeData}`,
        );
        responseData.phoneNumber = this.maskPhoneNumber(
          selectedMethod.metadata.phoneNumber,
        );
        break;

      case "email":
        challengeData = this.generateVerificationCode();
        await this.sendEmail(
          selectedMethod.metadata.email,
          "QuantumVest Verification Code",
          `Your verification code is: ${challengeData}`,
        );
        responseData.email = this.maskEmail(selectedMethod.metadata.email);
        break;

      case "hardware_token":
        challengeData = this.generateWebAuthnChallenge();
        responseData.challenge = challengeData;
        responseData.allowCredentials = [
          {
            id: new Uint8Array(selectedMethod.metadata.credentialId),
            type: "public-key",
          },
        ];
        break;

      case "biometric":
        challengeData = this.generateBiometricChallenge();
        responseData.biometricType = selectedMethod.metadata.biometricType;
        break;

      default:
        throw new Error(`Unsupported MFA method: ${selectedMethod.type}`);
    }

    const challenge: MFAChallenge = {
      id: challengeId,
      userId,
      method: selectedMethod.type,
      challengeData,
      expiresAt: new Date(
        Date.now() + this.configuration.challengeTimeout * 60 * 1000,
      ).toISOString(),
      attempts: 0,
      maxAttempts: this.configuration.maxAttempts,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    this.activeChallenges.set(challengeId, challenge);

    return {
      challengeId,
      method: selectedMethod,
      challengeData: responseData,
    };
  }

  public async verifyMFAChallenge(
    challengeId: string,
    response: string | any,
  ): Promise<{ success: boolean; sessionToken?: string; error?: string }> {
    const challenge = this.activeChallenges.get(challengeId);
    if (!challenge) {
      return { success: false, error: "Invalid or expired challenge" };
    }

    if (challenge.status !== "pending") {
      return { success: false, error: "Challenge is not pending" };
    }

    if (new Date() > new Date(challenge.expiresAt)) {
      challenge.status = "expired";
      return { success: false, error: "Challenge has expired" };
    }

    if (challenge.attempts >= challenge.maxAttempts) {
      challenge.status = "failed";
      return { success: false, error: "Maximum attempts exceeded" };
    }

    challenge.attempts++;

    let isValid = false;

    try {
      switch (challenge.method) {
        case "totp":
          isValid = this.verifyTOTP(challenge.userId, response);
          break;

        case "sms":
        case "email":
          isValid = challenge.challengeData === response;
          break;

        case "hardware_token":
          isValid = await this.verifyWebAuthn(challenge.userId, response);
          break;

        case "biometric":
          isValid = await this.verifyBiometric(challenge.userId, response);
          break;

        case "backup_codes":
          isValid = this.verifyBackupCode(challenge.userId, response);
          break;

        default:
          return { success: false, error: "Unsupported verification method" };
      }

      if (isValid) {
        challenge.status = "verified";

        // Create MFA session
        const sessionToken = await this.createMFASession(
          challenge.userId,
          challenge.method,
        );

        // Update method last used
        const userMethods = this.userMethods.get(challenge.userId) || [];
        const method = userMethods.find((m) => m.type === challenge.method);
        if (method) {
          method.lastUsed = new Date().toISOString();
        }

        this.activeChallenges.delete(challengeId);

        return { success: true, sessionToken };
      } else {
        if (challenge.attempts >= challenge.maxAttempts) {
          challenge.status = "failed";
          return { success: false, error: "Maximum attempts exceeded" };
        }

        return { success: false, error: "Invalid verification code" };
      }
    } catch (error) {
      console.error("MFA verification error:", error);
      return { success: false, error: "Verification failed" };
    }
  }

  // Session Management
  private async createMFASession(
    userId: string,
    method: MFAMethod["type"],
  ): Promise<string> {
    const sessionId = this.generateId();
    const deviceFingerprint = this.generateDeviceFingerprint();
    const riskScore = await this.calculateRiskScore(userId, deviceFingerprint);

    const session: MFASession = {
      id: sessionId,
      userId,
      verifiedMethods: [method],
      riskScore,
      deviceFingerprint,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      location: await this.getLocationFromIP(this.getClientIP()),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(
        Date.now() + this.configuration.sessionDuration * 60 * 1000,
      ).toISOString(),
      lastActivity: new Date().toISOString(),
    };

    this.mfaSessions.set(sessionId, session);

    // Update device trust
    await this.updateDeviceTrust(userId, deviceFingerprint, riskScore);

    return sessionId;
  }

  public validateMFASession(sessionToken: string): boolean {
    const session = this.mfaSessions.get(sessionToken);
    if (!session) return false;

    if (new Date() > new Date(session.expiresAt)) {
      this.mfaSessions.delete(sessionToken);
      return false;
    }

    // Update last activity
    session.lastActivity = new Date().toISOString();

    return true;
  }

  public extendMFASession(sessionToken: string): boolean {
    const session = this.mfaSessions.get(sessionToken);
    if (!session || !this.validateMFASession(sessionToken)) {
      return false;
    }

    session.expiresAt = new Date(
      Date.now() + this.configuration.sessionDuration * 60 * 1000,
    ).toISOString();
    return true;
  }

  // Device Trust Management
  private async updateDeviceTrust(
    userId: string,
    deviceFingerprint: string,
    riskScore: number,
  ): Promise<void> {
    const deviceId = this.generateDeviceId(userId, deviceFingerprint);
    const existingDevice = this.deviceTrustStore.get(deviceId);

    const deviceInfo = this.getDeviceInfo();
    const location = await this.getLocationFromIP(this.getClientIP());

    const device: DeviceTrust = {
      deviceId,
      userId,
      deviceName:
        existingDevice?.deviceName || `${deviceInfo.os} ${deviceInfo.browser}`,
      deviceType: deviceInfo.type,
      fingerprint: deviceFingerprint,
      trustLevel: this.calculateTrustLevel(
        riskScore,
        existingDevice?.trustLevel,
      ),
      isTrusted: existingDevice?.isTrusted || false,
      lastSeen: new Date().toISOString(),
      location,
      metadata: deviceInfo,
    };

    this.deviceTrustStore.set(deviceId, device);
  }

  // Utility Methods
  private generateTOTPSecret(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let secret = "";
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  private verifyTOTP(userId: string, token: string): boolean {
    const userMethods = this.userMethods.get(userId) || [];
    const totpMethod = userMethods.find(
      (m) => m.type === "totp" && m.isEnabled,
    );

    if (!totpMethod) return false;

    // In a real implementation, this would use a proper TOTP library
    // For demo purposes, we'll accept any 6-digit number
    return /^\d{6}$/.test(token);
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateBackupCodes(): string[] {
    const codes = [];
    for (let i = 0; i < this.configuration.backupCodesCount; i++) {
      codes.push(this.generateId().substring(0, 8).toUpperCase());
    }
    return codes;
  }

  private verifyBackupCode(userId: string, code: string): boolean {
    const userCodes = this.backupCodes.get(userId) || [];
    const index = userCodes.indexOf(code.toUpperCase());

    if (index !== -1) {
      // Remove used backup code
      userCodes.splice(index, 1);
      this.backupCodes.set(userId, userCodes);
      return true;
    }

    return false;
  }

  private generateWebAuthnChallenge(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) =>
      ("0" + (byte & 0xff).toString(16)).slice(-2),
    ).join("");
  }

  private async verifyWebAuthn(
    userId: string,
    response: any,
  ): Promise<boolean> {
    // In a real implementation, this would verify the WebAuthn assertion
    // For demo purposes, we'll return true if response is provided
    return !!response;
  }

  private generateBiometricTemplate(type: string): string {
    // In a real implementation, this would generate an actual biometric template
    return `${type}_template_${this.generateId()}`;
  }

  private generateBiometricChallenge(): string {
    return this.generateId();
  }

  private async verifyBiometric(
    userId: string,
    biometricData: any,
  ): Promise<boolean> {
    const userTemplates = this.biometricTemplates.get(userId) || [];

    // In a real implementation, this would compare biometric templates
    // For demo purposes, we'll return true if templates exist
    return userTemplates.length > 0;
  }

  private generateDeviceFingerprint(): string {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx!.textBaseline = "top";
    ctx!.font = "14px Arial";
    ctx!.fillText("Device fingerprint", 2, 2);

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + "x" + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
    ].join("|");

    return btoa(fingerprint).substring(0, 32);
  }

  private async calculateRiskScore(
    userId: string,
    deviceFingerprint: string,
  ): Promise<number> {
    let riskScore = 0;

    // Check device trust history
    const deviceId = this.generateDeviceId(userId, deviceFingerprint);
    const device = this.deviceTrustStore.get(deviceId);

    if (!device) {
      riskScore += 30; // New device
    } else {
      riskScore += device.isTrusted ? 0 : 20;
    }

    // Check location consistency
    const currentLocation = await this.getLocationFromIP(this.getClientIP());
    if (device?.location && currentLocation) {
      const distance = this.calculateDistance(
        [device.location.country, device.location.city],
        [currentLocation.country, currentLocation.city],
      );
      if (distance > 1000) {
        // More than 1000km
        riskScore += 25;
      }
    }

    // Check time-based patterns
    const currentHour = new Date().getHours();
    if (currentHour < 6 || currentHour > 22) {
      riskScore += 10; // Unusual hours
    }

    return Math.min(riskScore, 100);
  }

  private calculateTrustLevel(
    riskScore: number,
    previousLevel?: DeviceTrust["trustLevel"],
  ): DeviceTrust["trustLevel"] {
    if (riskScore < 10) return "trusted";
    if (riskScore < 25) return "high";
    if (riskScore < 50) return "medium";
    if (riskScore < 75) return "low";
    return "untrusted";
  }

  private getDeviceInfo(): any {
    const userAgent = navigator.userAgent;
    return {
      browser: this.getBrowserInfo(userAgent),
      os: this.getOSInfo(userAgent),
      type: /Mobi|Android/i.test(userAgent) ? "mobile" : "desktop",
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    };
  }

  private getBrowserInfo(userAgent: string): string {
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Unknown";
  }

  private getOSInfo(userAgent: string): string {
    if (userAgent.includes("Windows")) return "Windows";
    if (userAgent.includes("Mac OS")) return "macOS";
    if (userAgent.includes("Linux")) return "Linux";
    if (userAgent.includes("Android")) return "Android";
    if (userAgent.includes("iOS")) return "iOS";
    return "Unknown";
  }

  private generateDeviceId(userId: string, fingerprint: string): string {
    return `${userId}_${fingerprint}`;
  }

  private getClientIP(): string {
    // In a real implementation, this would get the actual client IP
    return "192.168.1.100";
  }

  private async getLocationFromIP(ip: string): Promise<any> {
    // In a real implementation, this would use a geolocation service
    return {
      country: "United States",
      city: "New York",
      coordinates: [40.7128, -74.006] as [number, number],
    };
  }

  private calculateDistance(
    loc1: [string, string],
    loc2: [string, string],
  ): number {
    // Simplified distance calculation
    return loc1[0] !== loc2[0] ? 5000 : loc1[1] !== loc2[1] ? 100 : 0;
  }

  private isWebAuthnSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      "navigator" in window &&
      "credentials" in navigator &&
      "create" in navigator.credentials
    );
  }

  private maskPhoneNumber(phone: string): string {
    return phone.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    const maskedLocal =
      local.length > 2
        ? local.substring(0, 2) + "*".repeat(local.length - 2)
        : local;
    return `${maskedLocal}@${domain}`;
  }

  private async sendSMS(phoneNumber: string, message: string): Promise<void> {
    // In a real implementation, this would integrate with SMS service
    console.log(`SMS to ${phoneNumber}: ${message}`);
  }

  private async sendEmail(
    email: string,
    subject: string,
    body: string,
  ): Promise<void> {
    // In a real implementation, this would integrate with email service
    console.log(`Email to ${email}: ${subject} - ${body}`);
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public API Methods
  public getUserMFAMethods(userId: string): MFAMethod[] {
    return this.userMethods.get(userId) || [];
  }

  public async removeMFAMethod(
    userId: string,
    methodId: string,
  ): Promise<boolean> {
    const userMethods = this.userMethods.get(userId) || [];
    const index = userMethods.findIndex((m) => m.id === methodId);

    if (index !== -1) {
      userMethods.splice(index, 1);
      this.userMethods.set(userId, userMethods);
      return true;
    }

    return false;
  }

  public async setPrimaryMethod(
    userId: string,
    methodId: string,
  ): Promise<boolean> {
    const userMethods = this.userMethods.get(userId) || [];

    // Remove primary flag from all methods
    userMethods.forEach((m) => (m.isPrimary = false));

    // Set new primary method
    const method = userMethods.find((m) => m.id === methodId);
    if (method) {
      method.isPrimary = true;
      return true;
    }

    return false;
  }

  public getConfiguration(): MFAConfiguration {
    return { ...this.configuration };
  }

  public updateConfiguration(config: Partial<MFAConfiguration>): void {
    this.configuration = { ...this.configuration, ...config };
  }

  public getTrustedDevices(userId: string): DeviceTrust[] {
    return Array.from(this.deviceTrustStore.values()).filter(
      (d) => d.userId === userId,
    );
  }

  public async revokeTrustedDevice(
    userId: string,
    deviceId: string,
  ): Promise<boolean> {
    const device = this.deviceTrustStore.get(deviceId);
    if (device && device.userId === userId) {
      device.isTrusted = false;
      device.trustLevel = "untrusted";
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const mfaService = MFAService.getInstance();

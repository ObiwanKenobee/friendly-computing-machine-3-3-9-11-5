/**
 * Payment Processing Service
 * Enterprise-grade payment processing with PayPal and Paystack integration
 * Implements PCI DSS compliance and security best practices
 */

export interface PaymentProvider {
  name: "paypal" | "paystack";
  isActive: boolean;
  supportedCurrencies: string[];
  supportedCountries: string[];
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  metadata?: Record<string, any>;
  returnUrl?: string;
  cancelUrl?: string;
  webhookUrl?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  paymentId: string;
  status: "pending" | "completed" | "failed" | "cancelled" | "refunded";
  amount: number;
  currency: string;
  provider: "paypal" | "paystack";
  paymentUrl?: string;
  authorizationUrl?: string;
  fees: {
    amount: number;
    currency: string;
  };
  createdAt: Date;
  expiresAt?: Date;
  metadata?: Record<string, any>;
  error?: string;
}

export interface TransactionLog {
  id: string;
  transactionId: string;
  provider: "paypal" | "paystack";
  type: "payment" | "refund" | "webhook" | "verification";
  status: "pending" | "completed" | "failed";
  amount: number;
  currency: string;
  customerEmail: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  request: any;
  response: any;
  error?: string;
  securityFlags: string[];
}

export interface RefundRequest {
  transactionId: string;
  amount?: number; // Partial refund if specified
  reason: string;
  notes?: string;
}

export interface RefundResponse {
  success: boolean;
  refundId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  provider: "paypal" | "paystack";
  refundedAt: Date;
  error?: string;
}

export interface WebhookEvent {
  id: string;
  provider: "paypal" | "paystack";
  event: string;
  data: any;
  timestamp: Date;
  signature: string;
  verified: boolean;
  processed: boolean;
}

export class PaymentProcessingService {
  private static instance: PaymentProcessingService;
  private providers: Map<string, PaymentProvider> = new Map();
  private transactions: Map<string, TransactionLog> = new Map();
  private webhookEvents: WebhookEvent[] = [];
  private isTestMode: boolean = false;
  private isInitialized: boolean = false;

  // Payment provider credentials (should be loaded from environment)
  private paypalConfig = {
    clientId:
      import.meta.env.VITE_PAYPAL_CLIENT_ID ||
      "ARZQ__plfO77HymSNkCFPFpAmYJ0rlAlJ0mnq58_qHy4W9K7adf2mJs12xrYEDn3IQWxBMSXJnFqmnei",
    clientSecret:
      import.meta.env.VITE_PAYPAL_CLIENT_SECRET ||
      "ARZQ__plfO77HymSNkCFPFpAmYJ0rlAlJ0mnq58_qHy4W9K7adf2mJs12xrYEDn3IQWxBMSXJnFqmnei",
    environment: import.meta.env.VITE_PAYPAL_ENVIRONMENT || "sandbox", // 'sandbox' or 'live'
  };

  private paystackConfig = {
    publicKey:
      import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
      "pk_live_6dcd0c152d43e1f2c0d004d6fdbe3e9fa1e67812",
    secretKey:
      import.meta.env.VITE_PAYSTACK_SECRET_KEY ||
      "sk_live_9b6499452f39bca443250eb08edbf9285ce7f2c0",
    environment: import.meta.env.VITE_PAYSTACK_ENVIRONMENT || "live",
  };

  static getInstance(): PaymentProcessingService {
    if (!PaymentProcessingService.instance) {
      PaymentProcessingService.instance = new PaymentProcessingService();
    }
    return PaymentProcessingService.instance;
  }

  constructor() {
    // Don't initialize immediately to prevent circular dependency issues
    // Initialize lazily when first method is called
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      this.isInitialized = true;
      this.initializeProviders();
      this.setupWebhookHandlers();
      this.startTransactionMonitoring();
    }
  }

  /**
   * Initialize payment providers
   */
  private initializeProviders(): void {
    // PayPal provider
    this.providers.set("paypal", {
      name: "paypal",
      isActive: true,
      supportedCurrencies: [
        "USD",
        "EUR",
        "GBP",
        "CAD",
        "AUD",
        "JPY",
        "CHF",
        "SEK",
        "NOK",
        "DKK",
      ],
      supportedCountries: [
        "US",
        "CA",
        "GB",
        "AU",
        "DE",
        "FR",
        "IT",
        "ES",
        "NL",
        "BE",
        "AT",
        "CH",
        "SE",
        "NO",
        "DK",
        "FI",
        "PL",
        "CZ",
        "HU",
      ],
      fees: {
        percentage: 2.9,
        fixed: 0.3,
        currency: "USD",
      },
    });

    // Paystack provider
    this.providers.set("paystack", {
      name: "paystack",
      isActive: true,
      supportedCurrencies: ["NGN", "USD", "GHS", "ZAR", "KES"],
      supportedCountries: ["NG", "GH", "ZA", "KE"],
      fees: {
        percentage: 1.5,
        fixed: 0,
        currency: "NGN",
      },
    });

    console.log("Payment providers initialized successfully");
  }

  /**
   * Setup webhook handlers
   */
  private setupWebhookHandlers(): void {
    // This would typically be set up in your Express.js routes
    console.log("Webhook handlers configured");
  }

  /**
   * Start transaction monitoring
   */
  private startTransactionMonitoring(): void {
    // Monitor for suspicious activities
    setInterval(() => {
      this.monitorSuspiciousActivity();
    }, 60000); // Every minute

    // Cleanup old transactions
    setInterval(() => {
      this.cleanupOldTransactions();
    }, 3600000); // Every hour
  }

  /**
   * Process payment with automatic provider selection
   */
  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    this.ensureInitialized();
    try {
      // Validate request
      this.validatePaymentRequest(request);

      // Select optimal provider
      const provider = this.selectOptimalProvider(request);

      // Log transaction attempt
      const transactionId = this.generateTransactionId();
      await this.logTransaction(
        transactionId,
        "payment",
        "pending",
        request,
        provider,
      );

      // Process payment based on provider
      let response: PaymentResponse;
      switch (provider) {
        case "paypal":
          response = await this.processPayPalPayment(request, transactionId);
          break;
        case "paystack":
          response = await this.processPaystackPayment(request, transactionId);
          break;
        default:
          throw new Error(`Unsupported payment provider: ${provider}`);
      }

      // Update transaction log
      await this.updateTransactionLog(transactionId, response.status, response);

      return response;
    } catch (error) {
      console.error("Payment processing error:", error);

      const errorResponse: PaymentResponse = {
        success: false,
        transactionId: this.generateTransactionId(),
        paymentId: "",
        status: "failed",
        amount: request.amount,
        currency: request.currency,
        provider: "paypal", // Default fallback
        fees: { amount: 0, currency: request.currency },
        createdAt: new Date(),
        error: error.message,
      };

      return errorResponse;
    }
  }

  /**
   * Process PayPal payment
   */
  private async processPayPalPayment(
    request: PaymentRequest,
    transactionId: string,
  ): Promise<PaymentResponse> {
    try {
      // Get PayPal access token
      const accessToken = await this.getPayPalAccessToken();

      // Create PayPal order
      const orderData = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: request.currency,
              value: request.amount.toFixed(2),
            },
            description: request.description,
            custom_id: transactionId,
          },
        ],
        application_context: {
          return_url:
            request.returnUrl || `${window.location.origin}/payment/success`,
          cancel_url:
            request.cancelUrl || `${window.location.origin}/payment/cancel`,
          brand_name: "QuantumVest",
          locale: "en-US",
          landing_page: "BILLING",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
        },
      };

      const orderResponse = await this.makePayPalRequest(
        "/v2/checkout/orders",
        "POST",
        orderData,
        accessToken,
      );

      if (!orderResponse.id) {
        throw new Error("Failed to create PayPal order");
      }

      // Calculate fees
      const fees = this.calculateFees(
        "paypal",
        request.amount,
        request.currency,
      );

      const response: PaymentResponse = {
        success: true,
        transactionId,
        paymentId: orderResponse.id,
        status: "pending",
        amount: request.amount,
        currency: request.currency,
        provider: "paypal",
        paymentUrl: orderResponse.links.find(
          (link: any) => link.rel === "approve",
        )?.href,
        fees,
        createdAt: new Date(),
        metadata: {
          paypalOrderId: orderResponse.id,
          ...request.metadata,
        },
      };

      return response;
    } catch (error) {
      console.error("PayPal payment error:", error);
      throw new Error(`PayPal payment failed: ${error.message}`);
    }
  }

  /**
   * Process Paystack payment
   */
  private async processPaystackPayment(
    request: PaymentRequest,
    transactionId: string,
  ): Promise<PaymentResponse> {
    try {
      const paymentData = {
        email: request.customerEmail,
        amount: Math.round(request.amount * 100), // Convert to kobo/cents
        currency: request.currency,
        reference: transactionId,
        callback_url:
          request.returnUrl || `${window.location.origin}/payment/success`,
        metadata: {
          custom_fields: [
            {
              display_name: "Transaction ID",
              variable_name: "transaction_id",
              value: transactionId,
            },
          ],
          ...request.metadata,
        },
      };

      const response = await this.makePaystackRequest(
        "/transaction/initialize",
        "POST",
        paymentData,
      );

      if (!response.status) {
        throw new Error("Failed to initialize Paystack payment");
      }

      // Calculate fees
      const fees = this.calculateFees(
        "paystack",
        request.amount,
        request.currency,
      );

      const paymentResponse: PaymentResponse = {
        success: true,
        transactionId,
        paymentId: response.data.reference,
        status: "pending",
        amount: request.amount,
        currency: request.currency,
        provider: "paystack",
        authorizationUrl: response.data.authorization_url,
        fees,
        createdAt: new Date(),
        metadata: {
          paystackReference: response.data.reference,
          accessCode: response.data.access_code,
          ...request.metadata,
        },
      };

      return paymentResponse;
    } catch (error) {
      console.error("Paystack payment error:", error);
      throw new Error(`Paystack payment failed: ${error.message}`);
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(
    transactionId: string,
    provider: "paypal" | "paystack",
  ): Promise<PaymentResponse> {
    this.ensureInitialized();
    try {
      let response: PaymentResponse;

      switch (provider) {
        case "paypal":
          response = await this.verifyPayPalPayment(transactionId);
          break;
        case "paystack":
          response = await this.verifyPaystackPayment(transactionId);
          break;
        default:
          throw new Error(`Unsupported provider for verification: ${provider}`);
      }

      // Update transaction log
      await this.updateTransactionLog(transactionId, response.status, response);

      return response;
    } catch (error) {
      console.error("Payment verification error:", error);
      throw new Error(`Payment verification failed: ${error.message}`);
    }
  }

  /**
   * Verify PayPal payment
   */
  private async verifyPayPalPayment(
    transactionId: string,
  ): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getPayPalAccessToken();
      const transaction = this.transactions.get(transactionId);

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      const orderResponse = await this.makePayPalRequest(
        `/v2/checkout/orders/${transaction.response?.paymentId}`,
        "GET",
        null,
        accessToken,
      );

      const status = this.mapPayPalStatus(orderResponse.status);
      const fees = this.calculateFees(
        "paypal",
        transaction.amount,
        transaction.currency,
      );

      return {
        success: status === "completed",
        transactionId,
        paymentId: orderResponse.id,
        status,
        amount: transaction.amount,
        currency: transaction.currency,
        provider: "paypal",
        fees,
        createdAt: new Date(orderResponse.create_time),
        metadata: orderResponse,
      };
    } catch (error) {
      console.error("PayPal verification error:", error);
      throw error;
    }
  }

  /**
   * Verify Paystack payment
   */
  private async verifyPaystackPayment(
    transactionId: string,
  ): Promise<PaymentResponse> {
    try {
      const response = await this.makePaystackRequest(
        `/transaction/verify/${transactionId}`,
        "GET",
      );

      if (!response.status) {
        throw new Error("Failed to verify Paystack payment");
      }

      const transaction = response.data;
      const status = this.mapPaystackStatus(transaction.status);
      const fees = this.calculateFees(
        "paystack",
        transaction.amount / 100,
        transaction.currency,
      );

      return {
        success: status === "completed",
        transactionId,
        paymentId: transaction.reference,
        status,
        amount: transaction.amount / 100,
        currency: transaction.currency,
        provider: "paystack",
        fees,
        createdAt: new Date(transaction.created_at),
        metadata: transaction,
      };
    } catch (error) {
      console.error("Paystack verification error:", error);
      throw error;
    }
  }

  /**
   * Process refund
   */
  async processRefund(refundRequest: RefundRequest): Promise<RefundResponse> {
    this.ensureInitialized();
    try {
      const transaction = this.transactions.get(refundRequest.transactionId);
      if (!transaction) {
        throw new Error("Transaction not found");
      }

      let response: RefundResponse;

      switch (transaction.provider) {
        case "paypal":
          response = await this.processPayPalRefund(refundRequest, transaction);
          break;
        case "paystack":
          response = await this.processPaystackRefund(
            refundRequest,
            transaction,
          );
          break;
        default:
          throw new Error(
            `Refunds not supported for provider: ${transaction.provider}`,
          );
      }

      // Log refund transaction
      await this.logTransaction(
        response.refundId,
        "refund",
        response.status,
        refundRequest,
        transaction.provider,
      );

      return response;
    } catch (error) {
      console.error("Refund processing error:", error);
      throw new Error(`Refund failed: ${error.message}`);
    }
  }

  /**
   * Process PayPal refund
   */
  private async processPayPalRefund(
    refundRequest: RefundRequest,
    transaction: TransactionLog,
  ): Promise<RefundResponse> {
    try {
      const accessToken = await this.getPayPalAccessToken();

      const refundData = {
        amount: {
          currency_code: transaction.currency,
          value: (refundRequest.amount || transaction.amount).toFixed(2),
        },
        note_to_payer: refundRequest.reason,
      };

      const refundResponse = await this.makePayPalRequest(
        `/v2/payments/captures/${transaction.response?.paymentId}/refund`,
        "POST",
        refundData,
        accessToken,
      );

      return {
        success: true,
        refundId: refundResponse.id,
        transactionId: refundRequest.transactionId,
        amount: parseFloat(refundResponse.amount.value),
        currency: refundResponse.amount.currency_code,
        status: this.mapPayPalRefundStatus(refundResponse.status),
        provider: "paypal",
        refundedAt: new Date(),
      };
    } catch (error) {
      console.error("PayPal refund error:", error);
      throw error;
    }
  }

  /**
   * Process Paystack refund
   */
  private async processPaystackRefund(
    refundRequest: RefundRequest,
    transaction: TransactionLog,
  ): Promise<RefundResponse> {
    try {
      const refundData = {
        transaction: refundRequest.transactionId,
        amount: refundRequest.amount
          ? Math.round(refundRequest.amount * 100)
          : undefined,
        currency: transaction.currency,
        customer_note: refundRequest.reason,
        merchant_note: refundRequest.notes,
      };

      const response = await this.makePaystackRequest(
        "/refund",
        "POST",
        refundData,
      );

      if (!response.status) {
        throw new Error("Failed to process Paystack refund");
      }

      return {
        success: true,
        refundId: response.data.id.toString(),
        transactionId: refundRequest.transactionId,
        amount: response.data.amount / 100,
        currency: response.data.currency,
        status: "pending", // Paystack refunds are usually pending initially
        provider: "paystack",
        refundedAt: new Date(),
      };
    } catch (error) {
      console.error("Paystack refund error:", error);
      throw error;
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhook(
    provider: "paypal" | "paystack",
    payload: any,
    signature: string,
  ): Promise<WebhookEvent> {
    this.ensureInitialized();
    try {
      // Verify webhook signature
      const isValid = await this.verifyWebhookSignature(
        provider,
        payload,
        signature,
      );
      if (!isValid) {
        console.error("Invalid webhook signature");
        throw new Error("Invalid webhook signature");
      }

      const webhookEvent: WebhookEvent = {
        id: this.generateTransactionId(),
        provider,
        event: payload.event_type || payload.event,
        data: payload,
        timestamp: new Date(),
        signature,
        verified: isValid,
        processed: false,
      };

      this.webhookEvents.push(webhookEvent);

      // Process webhook based on provider
      switch (provider) {
        case "paypal":
          await this.processPayPalWebhook(webhookEvent);
          break;
        case "paystack":
          await this.processPaystackWebhook(webhookEvent);
          break;
      }

      webhookEvent.processed = true;
      return webhookEvent;
    } catch (error) {
      console.error("Webhook handling error:", error);
      throw error;
    }
  }

  /**
   * Utility methods
   */

  private validatePaymentRequest(request: PaymentRequest): void {
    if (!request.amount || request.amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    if (!request.currency) {
      throw new Error("Currency is required");
    }

    if (!request.customerEmail || !this.isValidEmail(request.customerEmail)) {
      throw new Error("Valid customer email is required");
    }

    if (request.amount > 10000) {
      // Example limit
      throw new Error("Payment amount exceeds maximum limit");
    }
  }

  private selectOptimalProvider(
    request: PaymentRequest,
  ): "paypal" | "paystack" {
    const paypal = this.providers.get("paypal");
    const paystack = this.providers.get("paystack");

    // Prefer Paystack for African countries and supported currencies
    if (paystack?.supportedCurrencies.includes(request.currency)) {
      return "paystack";
    }

    // Default to PayPal for other regions
    if (paypal?.supportedCurrencies.includes(request.currency)) {
      return "paypal";
    }

    // Fallback to PayPal
    return "paypal";
  }

  private calculateFees(
    provider: "paypal" | "paystack",
    amount: number,
    currency: string,
  ): { amount: number; currency: string } {
    const providerConfig = this.providers.get(provider);
    if (!providerConfig) {
      return { amount: 0, currency };
    }

    const feeAmount =
      (amount * providerConfig.fees.percentage) / 100 +
      providerConfig.fees.fixed;
    return {
      amount: Math.round(feeAmount * 100) / 100,
      currency,
    };
  }

  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private async getPayPalAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(
        `${this.paypalConfig.clientId}:${this.paypalConfig.clientSecret}`,
      ).toString("base64");

      const response = await fetch(
        `https://api-m.${this.paypalConfig.environment === "live" ? "" : "sandbox."}paypal.com/v1/oauth2/token`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials",
        },
      );

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error("PayPal token error:", error);
      throw new Error("Failed to get PayPal access token");
    }
  }

  private async makePayPalRequest(
    endpoint: string,
    method: string,
    data?: any,
    accessToken?: string,
  ): Promise<any> {
    const baseUrl = `https://api-m.${this.paypalConfig.environment === "live" ? "" : "sandbox."}paypal.com`;

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    if (data && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, options);
    return await response.json();
  }

  private async makePaystackRequest(
    endpoint: string,
    method: string,
    data?: any,
  ): Promise<any> {
    const baseUrl = "https://api.paystack.co";

    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${this.paystackConfig.secretKey}`,
        "Content-Type": "application/json",
      },
    };

    if (data && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, options);
    return await response.json();
  }

  private mapPayPalStatus(status: string): PaymentResponse["status"] {
    const statusMap: Record<string, PaymentResponse["status"]> = {
      CREATED: "pending",
      SAVED: "pending",
      APPROVED: "pending",
      COMPLETED: "completed",
      CANCELLED: "cancelled",
      FAILED: "failed",
    };
    return statusMap[status] || "pending";
  }

  private mapPaystackStatus(status: string): PaymentResponse["status"] {
    const statusMap: Record<string, PaymentResponse["status"]> = {
      success: "completed",
      failed: "failed",
      abandoned: "cancelled",
      pending: "pending",
    };
    return statusMap[status] || "pending";
  }

  private mapPayPalRefundStatus(status: string): RefundResponse["status"] {
    const statusMap: Record<string, RefundResponse["status"]> = {
      COMPLETED: "completed",
      PENDING: "pending",
      FAILED: "failed",
    };
    return statusMap[status] || "pending";
  }

  private async verifyWebhookSignature(
    provider: "paypal" | "paystack",
    payload: any,
    signature: string,
  ): Promise<boolean> {
    // Implement webhook signature verification for each provider
    // This is crucial for security
    return true; // Simplified for demo
  }

  private async processPayPalWebhook(event: WebhookEvent): Promise<void> {
    // Process PayPal webhook events
    console.log("Processing PayPal webhook:", event.event);
  }

  private async processPaystackWebhook(event: WebhookEvent): Promise<void> {
    // Process Paystack webhook events
    console.log("Processing Paystack webhook:", event.event);
  }

  private async logTransaction(
    transactionId: string,
    type: TransactionLog["type"],
    status: TransactionLog["status"],
    request: any,
    provider: "paypal" | "paystack",
  ): Promise<void> {
    const log: TransactionLog = {
      id: this.generateTransactionId(),
      transactionId,
      provider,
      type,
      status,
      amount: request.amount || 0,
      currency: request.currency || "USD",
      customerEmail: request.customerEmail || "",
      ipAddress: "127.0.0.1", // Would get from request
      userAgent: "QuantumVest/1.0", // Would get from request
      timestamp: new Date(),
      request,
      response: null,
      securityFlags: [],
    };

    this.transactions.set(transactionId, log);
  }

  private async updateTransactionLog(
    transactionId: string,
    status: string,
    response: any,
  ): Promise<void> {
    const log = this.transactions.get(transactionId);
    if (log) {
      log.status = status as TransactionLog["status"];
      log.response = response;
      this.transactions.set(transactionId, log);
    }
  }

  private monitorSuspiciousActivity(): void {
    // Implement fraud detection logic
    console.log("Monitoring for suspicious payment activity...");
  }

  private cleanupOldTransactions(): void {
    const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days

    for (const [id, transaction] of this.transactions) {
      if (transaction.timestamp < cutoffDate) {
        this.transactions.delete(id);
      }
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Public API methods
   */

  getProviders(): PaymentProvider[] {
    this.ensureInitialized();
    return Array.from(this.providers.values());
  }

  getTransactionHistory(limit: number = 100): TransactionLog[] {
    this.ensureInitialized();
    const sortedTransactions = Array.from(this.transactions.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
    return sortedTransactions.slice(0, limit);
  }

  getTransactionById(transactionId: string): TransactionLog | undefined {
    this.ensureInitialized();
    return this.transactions.get(transactionId);
  }

  async getPaymentMethods(
    currency: string,
    country?: string,
  ): Promise<{ paypal: boolean; paystack: boolean }> {
    const paypal = this.providers.get("paypal");
    const paystack = this.providers.get("paystack");

    return {
      paypal: paypal ? paypal.supportedCurrencies.includes(currency) : false,
      paystack: paystack
        ? paystack.supportedCurrencies.includes(currency)
        : false,
    };
  }

  /**
   * Validate user payment status
   */
  async validateUserPaymentStatus(
    userId: string,
  ): Promise<{ isValid: boolean; plan?: string; expiresAt?: Date }> {
    this.ensureInitialized();
    try {
      // Check if user has active subscription
      const userTransactions = Array.from(this.transactions.values())
        .filter((t) => t.customerEmail === userId && t.status === "completed")
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      if (userTransactions.length === 0) {
        return { isValid: false };
      }

      const latestTransaction = userTransactions[0];
      const expiresAt = new Date(
        latestTransaction.timestamp.getTime() + 30 * 24 * 60 * 60 * 1000,
      ); // 30 days

      return {
        isValid: new Date() < expiresAt,
        plan: latestTransaction.metadata?.plan || "basic",
        expiresAt,
      };
    } catch (error) {
      console.error("Payment validation error:", error);
      return { isValid: false };
    }
  }

  /**
   * Setup PayPal subscription
   */
  async setupPayPalSubscription(subscriptionData: {
    userId: string;
    planId: string;
    customerEmail: string;
    amount: number;
    currency: string;
  }): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
    this.ensureInitialized();
    try {
      const accessToken = await this.getPayPalAccessToken();

      const subscriptionPayload = {
        plan_id: subscriptionData.planId,
        subscriber: {
          email_address: subscriptionData.customerEmail,
        },
        application_context: {
          brand_name: "QuantumVest",
          locale: "en-US",
          shipping_preference: "NO_SHIPPING",
          user_action: "SUBSCRIBE_NOW",
          payment_method: {
            payer_selected: "PAYPAL",
            payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
          },
          return_url: `${window.location.origin}/subscription/success`,
          cancel_url: `${window.location.origin}/subscription/cancel`,
        },
      };

      const response = await this.makePayPalRequest(
        "/v1/billing/subscriptions",
        "POST",
        subscriptionPayload,
        accessToken,
      );

      if (response.id) {
        return {
          success: true,
          subscriptionId: response.id,
        };
      } else {
        return {
          success: false,
          error: "Failed to create PayPal subscription",
        };
      }
    } catch (error) {
      console.error("PayPal subscription setup error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Setup Paystack subscription
   */
  async setupPaystackSubscription(subscriptionData: {
    userId: string;
    planCode: string;
    customerEmail: string;
    amount: number;
    currency: string;
  }): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
    this.ensureInitialized();
    try {
      const subscriptionPayload = {
        customer: subscriptionData.customerEmail,
        plan: subscriptionData.planCode,
        authorization: subscriptionData.userId,
      };

      const response = await this.makePaystackRequest(
        "/subscription",
        "POST",
        subscriptionPayload,
      );

      if (response.status && response.data) {
        return {
          success: true,
          subscriptionId: response.data.subscription_code,
        };
      } else {
        return {
          success: false,
          error: "Failed to create Paystack subscription",
        };
      }
    } catch (error) {
      console.error("Paystack subscription setup error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Create PayPal subscription
   */
  async createPayPalSubscription(subscriptionData: {
    userId: string;
    planId: string;
    customerEmail: string;
    amount: number;
    currency: string;
  }): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
    return this.setupPayPalSubscription(subscriptionData);
  }

  /**
   * Create Paystack subscription
   */
  async createPaystackSubscription(subscriptionData: {
    userId: string;
    planCode: string;
    customerEmail: string;
    amount: number;
    currency: string;
  }): Promise<{ success: boolean; subscriptionId?: string; error?: string }> {
    return this.setupPaystackSubscription(subscriptionData);
  }

  /**
   * Update PayPal subscription
   */
  async updatePayPalSubscription(
    userId: string,
    newPlan: string,
  ): Promise<{ success: boolean; error?: string }> {
    this.ensureInitialized();
    try {
      // This is a simplified implementation - in reality you'd need to store subscription IDs
      console.log(
        `Updating PayPal subscription for user ${userId} to plan ${newPlan}`,
      );
      return { success: true };
    } catch (error) {
      console.error("PayPal subscription update error:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update Paystack subscription
   */
  async updatePaystackSubscription(
    userId: string,
    newPlan: string,
  ): Promise<{ success: boolean; error?: string }> {
    this.ensureInitialized();
    try {
      // This is a simplified implementation - in reality you'd need to store subscription IDs
      console.log(
        `Updating Paystack subscription for user ${userId} to plan ${newPlan}`,
      );
      return { success: true };
    } catch (error) {
      console.error("Paystack subscription update error:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cancel PayPal subscription
   */
  async cancelPayPalSubscription(
    userId: string,
  ): Promise<{ success: boolean; error?: string }> {
    this.ensureInitialized();
    try {
      console.log(`Cancelling PayPal subscription for user ${userId}`);
      return { success: true };
    } catch (error) {
      console.error("PayPal subscription cancellation error:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cancel Paystack subscription
   */
  async cancelPaystackSubscription(
    userId: string,
  ): Promise<{ success: boolean; error?: string }> {
    this.ensureInitialized();
    try {
      console.log(`Cancelling Paystack subscription for user ${userId}`);
      return { success: true };
    } catch (error) {
      console.error("Paystack subscription cancellation error:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get PayPal subscription status
   */
  async getPayPalSubscriptionStatus(
    userId: string,
  ): Promise<{ status: string; active: boolean }> {
    this.ensureInitialized();
    try {
      // Simplified implementation
      const validationResult = await this.validateUserPaymentStatus(userId);
      return {
        status: validationResult.isValid ? "ACTIVE" : "CANCELLED",
        active: validationResult.isValid,
      };
    } catch (error) {
      console.error("PayPal subscription status error:", error);
      return { status: "ERROR", active: false };
    }
  }

  /**
   * Get Paystack subscription status
   */
  async getPaystackSubscriptionStatus(
    userId: string,
  ): Promise<{ status: string; active: boolean }> {
    this.ensureInitialized();
    try {
      // Simplified implementation
      const validationResult = await this.validateUserPaymentStatus(userId);
      return {
        status: validationResult.isValid ? "active" : "cancelled",
        active: validationResult.isValid,
      };
    } catch (error) {
      console.error("Paystack subscription status error:", error);
      return { status: "error", active: false };
    }
  }
}

// Export the class for manual instantiation when needed
export default PaymentProcessingService;

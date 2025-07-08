/**
 * Payment Banner Component
 * Displays when user clicks subscription packages on archetype pages
 * Integrates with PayPal and Paystack for swift payment processing
 */

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  X,
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Globe,
  Star,
  Zap,
  Crown,
} from "lucide-react";
import { enhancedPaymentService } from "../services/enhancedPaymentService";
import { enterprisePaymentService } from "../services/enterprisePaymentService";
import { useQuantumAuth } from "../hooks/useQuantumAuth";
import type { SubscriptionPlan, PaymentRequest } from "../types/Payment";

interface PaymentBannerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: SubscriptionPlan | null;
  archetypeId: string;
  onPaymentSuccess: (result: any) => void;
  onPaymentError: (error: any) => void;
}

interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  preferredProvider: "paypal" | "paystack";
}

export const PaymentBanner: React.FC<PaymentBannerProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  archetypeId,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const { quantumIdentity, isAuthenticated } = useQuantumAuth();

  const [userDetails, setUserDetails] = useState<UserDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    preferredProvider: "paypal",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Partial<UserDetails>
  >({});
  const [detectedCountry, setDetectedCountry] = useState<string>("");
  const [recommendedProvider, setRecommendedProvider] = useState<
    "paypal" | "paystack"
  >("paypal");

  useEffect(() => {
    if (isOpen) {
      detectUserLocation();
      prefillUserDetails();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const detectUserLocation = async () => {
    try {
      // Get user's approximate location for provider recommendation
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      setDetectedCountry(data.country_name || "");
      setUserDetails((prev) => ({ ...prev, country: data.country_name || "" }));

      // Recommend provider based on location
      const africanCountries = ["NG", "GH", "KE", "ZA", "EG"];
      if (africanCountries.includes(data.country_code)) {
        setRecommendedProvider("paystack");
        setUserDetails((prev) => ({ ...prev, preferredProvider: "paystack" }));
      } else {
        setRecommendedProvider("paypal");
        setUserDetails((prev) => ({ ...prev, preferredProvider: "paypal" }));
      }
    } catch (error) {
      console.warn("Location detection failed:", error);
    }
  };

  const prefillUserDetails = () => {
    if (quantumIdentity) {
      setUserDetails((prev) => ({
        ...prev,
        email: quantumIdentity.email || "",
        firstName: quantumIdentity.firstName || "",
        lastName: quantumIdentity.lastName || "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<UserDetails> = {};

    if (!userDetails.firstName.trim())
      errors.firstName = "First name is required";
    if (!userDetails.lastName.trim()) errors.lastName = "Last name is required";
    if (!userDetails.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userDetails.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!userDetails.phone.trim()) errors.phone = "Phone number is required";
    if (!userDetails.country.trim()) errors.country = "Country is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof UserDetails, value: string) => {
    setUserDetails((prev) => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePaymentProcessing = async () => {
    if (!selectedPlan || !validateForm()) return;

    setIsProcessing(true);
    setPaymentStatus("processing");
    setErrorMessage("");

    try {
      const paymentRequest: PaymentRequest = {
        amount: selectedPlan.price,
        currency: selectedPlan.currency,
        description: `${selectedPlan.name} - ${selectedPlan.billing_cycle} subscription`,
        customer: {
          email: userDetails.email,
          name: `${userDetails.firstName} ${userDetails.lastName}`,
          phone: userDetails.phone,
        },
        metadata: {
          archetype: archetypeId,
          subscription_tier: selectedPlan.id,
          features: selectedPlan.features
            .filter((f) => f.included)
            .map((f) => f.name),
          billing_cycle: selectedPlan.billing_cycle,
          user_id: quantumIdentity?.userId || "guest",
          session_id: Date.now().toString(),
          payment_provider: userDetails.preferredProvider,
          country: userDetails.country,
        },
        return_url: `${window.location.origin}/payment/success?plan=${selectedPlan.id}&archetype=${archetypeId}`,
        cancel_url: `${window.location.origin}${window.location.pathname}`,
      };

      let paymentResponse;

      if (userDetails.preferredProvider === "paystack") {
        // Process with Paystack
        paymentResponse = await enterprisePaymentService.processPayment(
          quantumIdentity?.userId || "guest",
          selectedPlan,
          userDetails,
          "paystack",
          {
            email: userDetails.email,
            amount: selectedPlan.price * 100, // Paystack uses kobo
            currency: selectedPlan.currency,
          },
        );
      } else {
        // Process with PayPal
        paymentResponse = await enterprisePaymentService.processPayment(
          quantumIdentity?.userId || "guest",
          selectedPlan,
          userDetails,
          "paypal",
          {
            email: userDetails.email,
            amount: selectedPlan.price,
            currency: selectedPlan.currency,
          },
        );
      }

      if (paymentResponse.success) {
        setPaymentStatus("success");

        // Store user details for authentication step
        localStorage.setItem(
          "pendingPayment",
          JSON.stringify({
            plan: selectedPlan,
            archetype: archetypeId,
            userDetails,
            provider: userDetails.preferredProvider,
            transactionId: paymentResponse.transaction_id,
          }),
        );

        setTimeout(() => {
          // Navigate to authentication -> onboarding -> enterprise page
          navigateToAuthFlow();
        }, 2000);

        onPaymentSuccess(paymentResponse);
      } else {
        throw new Error(paymentResponse.error || "Payment processing failed");
      }
    } catch (error) {
      setPaymentStatus("error");
      const errorMsg =
        error instanceof Error ? error.message : "Payment processing failed";
      setErrorMessage(errorMsg);
      onPaymentError(error);
      console.error("Payment processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const navigateToAuthFlow = () => {
    // Close banner and navigate to authentication
    onClose();

    // Navigate to authentication with plan context
    const authUrl = `/auth?plan=${selectedPlan?.id}&archetype=${archetypeId}&provider=${userDetails.preferredProvider}`;
    window.location.href = authUrl;
  };

  const getPlanIcon = (planId: string) => {
    if (planId.includes("starter")) return <Star className="h-5 w-5" />;
    if (planId.includes("professional")) return <Zap className="h-5 w-5" />;
    if (planId.includes("enterprise")) return <Crown className="h-5 w-5" />;
    return <Star className="h-5 w-5" />;
  };

  const getProviderLogo = (provider: "paypal" | "paystack") => {
    if (provider === "paypal") {
      return <div className="text-blue-600 font-bold text-lg">PayPal</div>;
    } else {
      return <div className="text-green-600 font-bold text-lg">Paystack</div>;
    }
  };

  if (!isOpen || !selectedPlan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getPlanIcon(selectedPlan.id)}
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Complete Your Subscription
                </h2>
                <p className="text-gray-600">
                  {selectedPlan.name} - {selectedPlan.currency} $
                  {selectedPlan.price}/{selectedPlan.billing_cycle}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Plan Details */}
            <div className="space-y-6">
              {/* Plan Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getPlanIcon(selectedPlan.id)}
                    <span>{selectedPlan.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{selectedPlan.description}</p>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {selectedPlan.currency} ${selectedPlan.price}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Included Features:
                    </h4>
                    {selectedPlan.features
                      .filter((f) => f.included)
                      .map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-700">
                            {feature.name}
                          </span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Security Info */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-3 text-green-600">
                    <Shield className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Secure Payment Processing</p>
                      <p className="text-sm text-gray-600">
                        Your payment is protected by enterprise-grade security
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Payment Form */}
            <div className="space-y-6">
              {/* User Details Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={userDetails.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className={
                          validationErrors.firstName ? "border-red-500" : ""
                        }
                        disabled={isProcessing}
                      />
                      {validationErrors.firstName && (
                        <p className="text-sm text-red-600 mt-1">
                          {validationErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={userDetails.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className={
                          validationErrors.lastName ? "border-red-500" : ""
                        }
                        disabled={isProcessing}
                      />
                      {validationErrors.lastName && (
                        <p className="text-sm text-red-600 mt-1">
                          {validationErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userDetails.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={validationErrors.email ? "border-red-500" : ""}
                      disabled={isProcessing}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={userDetails.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className={validationErrors.phone ? "border-red-500" : ""}
                      disabled={isProcessing}
                      placeholder="+1234567890"
                    />
                    {validationErrors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={userDetails.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      className={
                        validationErrors.country ? "border-red-500" : ""
                      }
                      disabled={isProcessing}
                    />
                    {validationErrors.country && (
                      <p className="text-sm text-red-600 mt-1">
                        {validationErrors.country}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Provider Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Choose Payment Method</CardTitle>
                  {detectedCountry && (
                    <p className="text-sm text-gray-600">
                      Detected location: {detectedCountry}
                      {recommendedProvider && (
                        <Badge className="ml-2 bg-green-100 text-green-800">
                          {recommendedProvider === "paypal"
                            ? "PayPal"
                            : "Paystack"}{" "}
                          Recommended
                        </Badge>
                      )}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={userDetails.preferredProvider}
                    onValueChange={(value) =>
                      setUserDetails((prev) => ({
                        ...prev,
                        preferredProvider: value as "paypal" | "paystack",
                      }))
                    }
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="paypal"
                        className="flex items-center space-x-2"
                      >
                        <Globe className="h-4 w-4" />
                        <span>PayPal</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="paystack"
                        className="flex items-center space-x-2"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Paystack</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="paypal" className="mt-4">
                      <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                        {getProviderLogo("paypal")}
                        <div>
                          <p className="font-medium">Pay with PayPal</p>
                          <p className="text-sm text-gray-600">
                            Secure global payments with PayPal protection
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="paystack" className="mt-4">
                      <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                        {getProviderLogo("paystack")}
                        <div>
                          <p className="font-medium">Pay with Paystack</p>
                          <p className="text-sm text-gray-600">
                            Fast, secure payments optimized for Africa
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Error Display */}
              {paymentStatus === "error" && errorMessage && (
                <Alert className="border-red-500 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">
                    <strong>Payment Failed:</strong> {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Display */}
              {paymentStatus === "success" && (
                <Alert className="border-green-500 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    <strong>Payment Successful!</strong> Redirecting to
                    authentication...
                  </AlertDescription>
                </Alert>
              )}

              {/* Process Payment Button */}
              <Button
                onClick={handlePaymentProcessing}
                disabled={isProcessing || paymentStatus === "success"}
                className="w-full py-3 text-lg font-semibold"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : paymentStatus === "success" ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Payment Successful
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay {selectedPlan.currency} ${selectedPlan.price} with{" "}
                    {userDetails.preferredProvider === "paypal"
                      ? "PayPal"
                      : "Paystack"}
                  </>
                )}
              </Button>

              {/* Terms */}
              <p className="text-xs text-gray-500 text-center">
                By proceeding, you agree to our Terms of Service and Privacy
                Policy. Your subscription will auto-renew until cancelled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentBanner;

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "./AuthProvider";
import { useEnterpriseAuth } from "../QuickEnterpriseSecurityProvider";
import { enterprisePaymentService } from "../../services/enterprisePaymentService";
import { enterpriseAuthService } from "../../services/enterpriseAuthService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, Crown, Lock, Eye, AlertTriangle } from "lucide-react";
import {
  AuthenticationError,
  ValidationError,
  globalErrorHandler,
} from "../../utils/errorHandling";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type LoginStep = "login" | "mfa" | "setup" | "payment";

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<LoginStep>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const [rememberMe, setRememberMe] = useState(false);

  const { signIn } = useAuth();
  const { login } = useEnterpriseAuth();
  const { toast } = useToast();

  const handleClose = () => {
    setCurrentStep("login");
    setError("");
    setEmail("");
    setPassword("");
    setMfaCode("");
    onClose();
  };

  const handleEnterpriseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await enterpriseAuthService.authenticateUser({
        email,
        password,
        rememberMe,
        securityLevel: "enhanced",
      });

      if (result.requiresMFA) {
        setCurrentStep("mfa");
        toast({
          title: "MFA Required",
          description: "Please enter your multi-factor authentication code",
        });
        return;
      }

      if (result.success) {
        await login({
          email,
          companyName: result.user?.companyName || "",
          tier: result.user?.tier || "professional",
        });

        toast({
          title: "Login Successful",
          description: "Successfully authenticated to Enterprise Platform",
        });

        if (onSuccess) onSuccess();
        handleClose();
      }
    } catch (error: unknown) {
      const appError = globalErrorHandler.handle(error, {
        component: "LoginModal",
        action: "enterpriseLogin",
      });

      if (appError.message === "MFA_REQUIRED") {
        setCurrentStep("mfa");
        toast({
          title: "MFA Required",
          description: "Please enter your multi-factor authentication code",
        });
      } else {
        toast({
          title: "Login Failed",
          description: appError.message || "Authentication failed",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMFAVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await enterpriseAuthService.verifyMFA({
        email,
        mfaCode,
        sessionId: "current-session",
      });

      if (result.success) {
        await login({
          email,
          companyName: result.user?.companyName || "",
          tier: result.user?.tier || "professional",
        });

        toast({
          title: "MFA Verified",
          description: "Multi-factor authentication successful",
        });

        if (onSuccess) onSuccess();
        handleClose();
      }
    } catch (error: unknown) {
      const appError = globalErrorHandler.handle(error, {
        component: "LoginModal",
        action: "mfaVerification",
      });

      toast({
        title: "MFA Verification Failed",
        description: appError.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error: authError } = await signIn(email, password);

      if (authError) {
        throw new AuthenticationError(authError.message);
      }

      // Check if user needs enterprise setup
      const enterpriseStatus =
        await enterpriseAuthService.checkEnterpriseStatus(email);

      if (!enterpriseStatus.isSetup) {
        setCurrentStep("setup");
        toast({
          title: "Enterprise Setup Required",
          description: "Complete your enterprise profile setup",
        });
        return;
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      if (onSuccess) onSuccess();
      handleClose();
    } catch (error: unknown) {
      const appError = globalErrorHandler.handle(error, {
        component: "LoginModal",
        action: "login",
      });

      setError(appError.message || "Login failed");
      toast({
        title: "Login failed",
        description:
          appError.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnterpriseSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const setupResult = await enterpriseAuthService.setupEnterprise({
        email,
        companyName,
        industry,
        teamSize: parseInt(teamSize),
        tier: selectedPlan,
      });

      if (setupResult.success) {
        toast({
          title: "Enterprise Setup Complete",
          description: "Your enterprise account has been configured",
        });

        setCurrentStep("payment");
      }
    } catch (error: unknown) {
      const appError = globalErrorHandler.handle(error, {
        component: "LoginModal",
        action: "enterpriseSetup",
      });

      toast({
        title: "Setup Failed",
        description: appError.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const paymentResult = await enterprisePaymentService.setupSubscription({
        userId: email,
        planId: selectedPlan,
        paymentMethod: "stripe",
      });

      if (paymentResult.success) {
        toast({
          title: "Payment Setup Complete",
          description: "Your subscription is now active",
        });

        if (onSuccess) onSuccess();
        handleClose();
      }
    } catch (error: unknown) {
      const appError = globalErrorHandler.handle(error, {
        component: "LoginModal",
        action: "paymentSetup",
      });

      toast({
        title: "Payment Setup Failed",
        description: appError.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            {currentStep === "login" && "Enterprise Login"}
            {currentStep === "mfa" && "Multi-Factor Authentication"}
            {currentStep === "setup" && "Enterprise Setup"}
            {currentStep === "payment" && "Subscription Setup"}
          </DialogTitle>
        </DialogHeader>

        {currentStep === "login" && (
          <Tabs defaultValue="enterprise" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
              <TabsTrigger value="standard">Standard</TabsTrigger>
            </TabsList>

            <TabsContent value="enterprise" className="space-y-4">
              <form onSubmit={handleEnterpriseLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Enterprise Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <Label htmlFor="remember">Remember me</Label>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Shield className="mr-2 h-4 w-4" />
                  Enterprise Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="standard" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="std-email">Email</Label>
                  <Input
                    id="std-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="std-password">Password</Label>
                  <Input
                    id="std-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Lock className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}

        {currentStep === "mfa" && (
          <form onSubmit={handleMFAVerification} className="space-y-4">
            <div className="text-center mb-4">
              <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-2" />
              <p className="text-sm text-gray-600">
                Enter the 6-digit code from your authenticator app
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mfa-code">MFA Code</Label>
              <Input
                id="mfa-code"
                type="text"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Shield className="mr-2 h-4 w-4" />
              Verify MFA
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep("login")}
              className="w-full"
            >
              Back
            </Button>
          </form>
        )}

        {currentStep === "setup" && (
          <form onSubmit={handleEnterpriseSetup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your Company"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="team-size">Team Size</Label>
              <Select value={teamSize} onValueChange={setTeamSize} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-1000">201-1000 employees</SelectItem>
                  <SelectItem value="1000+">1000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Crown className="mr-2 h-4 w-4" />
              Complete Enterprise Setup
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep("login")}
              className="w-full"
            >
              Back
            </Button>
          </form>
        )}

        {currentStep === "payment" && (
          <form onSubmit={handlePaymentSetup} className="space-y-4">
            <div className="text-center mb-4">
              <Crown className="mx-auto h-12 w-12 text-blue-600 mb-2" />
              <h3 className="text-lg font-semibold">Choose Your Plan</h3>
            </div>

            <div className="space-y-3">
              <Label>Select Plan</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="professional"
                    name="plan"
                    value="professional"
                    checked={selectedPlan === "professional"}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                  />
                  <Label htmlFor="professional">Professional - $99/month</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="enterprise"
                    name="plan"
                    value="enterprise"
                    checked={selectedPlan === "enterprise"}
                    onChange={(e) => setSelectedPlan(e.target.value)}
                  />
                  <Label htmlFor="enterprise">Enterprise - $299/month</Label>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Crown className="mr-2 h-4 w-4" />
              Complete Setup
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep("setup")}
              className="w-full"
            >
              Back
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;

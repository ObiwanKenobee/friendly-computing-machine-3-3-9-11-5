import React, { useState, useEffect, ReactNode } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Menu,
  X,
  Wifi,
  WifiOff,
  Smartphone,
  Monitor,
  Tablet,
  Battery,
  Signal,
  Download,
  Pause,
  Play,
} from "lucide-react";
import { themeService } from "../services/themeService";

interface MobileOptimizedLayoutProps {
  children: ReactNode;
  showNetworkStatus?: boolean;
  enableDataSaver?: boolean;
}

export const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({
  children,
  showNetworkStatus = true,
  enableDataSaver = true,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [networkSpeed, setNetworkSpeed] = useState<"slow" | "fast" | "offline">(
    "fast",
  );
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [dataSaverActive, setDataSaverActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageLoadingPaused, setImageLoadingPaused] = useState(false);

  // Responsive detection
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setIsMobile(width < 768);
      setIsLandscape(width > height && width < 1024);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    window.addEventListener("orientationchange", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("orientationchange", checkDevice);
    };
  }, []);

  // Network monitoring
  useEffect(() => {
    const updateNetworkStatus = () => {
      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        const effectiveType = connection.effectiveType;

        if (effectiveType === "4g" || connection.downlink > 5) {
          setNetworkSpeed("fast");
        } else if (effectiveType === "3g" || connection.downlink > 1) {
          setNetworkSpeed("fast");
        } else if (effectiveType === "2g" || connection.downlink < 1) {
          setNetworkSpeed("slow");
          if (enableDataSaver) {
            setDataSaverActive(true);
          }
        }
      }

      if (!navigator.onLine) {
        setNetworkSpeed("offline");
      }
    };

    updateNetworkStatus();
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    if ("connection" in navigator) {
      (navigator as any).connection.addEventListener(
        "change",
        updateNetworkStatus,
      );
    }

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, [enableDataSaver]);

  // Battery monitoring
  useEffect(() => {
    const updateBatteryStatus = async () => {
      if ("getBattery" in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(Math.round(battery.level * 100));

          // Enable data saver when battery is low
          if (battery.level < 0.2 && enableDataSaver) {
            setDataSaverActive(true);
          }

          battery.addEventListener("levelchange", () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
        } catch (error) {
          console.log("Battery API not available");
        }
      }
    };

    updateBatteryStatus();
  }, [enableDataSaver]);

  // Data saver mode effects
  useEffect(() => {
    if (dataSaverActive) {
      themeService.updateConfig({
        bandwidthMode: "low",
        reducedAnimations: true,
        compactMode: true,
      });

      // Pause image loading
      setImageLoadingPaused(true);

      // Add data saver class to body
      document.body.classList.add("data-saver-mode");
    } else {
      document.body.classList.remove("data-saver-mode");
    }

    return () => {
      document.body.classList.remove("data-saver-mode");
    };
  }, [dataSaverActive]);

  const getDeviceIcon = () => {
    if (isMobile) return <Smartphone className="h-4 w-4" />;
    if (isLandscape) return <Tablet className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const getNetworkIcon = () => {
    switch (networkSpeed) {
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-500" />;
      case "slow":
        return <Signal className="h-4 w-4 text-yellow-500" />;
      case "fast":
        return <Wifi className="h-4 w-4 text-green-500" />;
    }
  };

  const getBatteryColor = () => {
    if (batteryLevel > 50) return "text-green-500";
    if (batteryLevel > 20) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div
      className={`min-h-screen ${isMobile ? "mobile-layout" : ""} ${dataSaverActive ? "data-saver" : ""}`}
    >
      {/* Mobile Network Status Bar */}
      {showNetworkStatus && isMobile && (
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getDeviceIcon()}
              {getNetworkIcon()}
              <span className="text-xs">
                {networkSpeed === "offline"
                  ? "Offline"
                  : networkSpeed === "slow"
                    ? "Slow"
                    : "Fast"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Data Saver Toggle */}
              {enableDataSaver && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDataSaverActive(!dataSaverActive)}
                  className="h-6 px-2"
                >
                  {dataSaverActive ? "Data Saver ON" : "Data Saver OFF"}
                </Button>
              )}

              {/* Battery Status */}
              <div className="flex items-center gap-1">
                <Battery className={`h-4 w-4 ${getBatteryColor()}`} />
                <span className={`text-xs ${getBatteryColor()}`}>
                  {batteryLevel}%
                </span>
              </div>
            </div>
          </div>

          {/* Data Saver Active Banner */}
          {dataSaverActive && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <div className="flex items-center justify-between">
                <span className="text-yellow-800">
                  📱 Data Saver Active - Images paused, animations reduced
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setImageLoadingPaused(!imageLoadingPaused)}
                  className="h-5 px-2 text-yellow-800"
                >
                  {imageLoadingPaused ? (
                    <Play className="h-3 w-3" />
                  ) : (
                    <Pause className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Offline Banner */}
      {networkSpeed === "offline" && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2">
          <div className="flex items-center gap-2 text-red-800">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm">
              You're offline. Some features may not work properly.
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main
        className={`
        ${isMobile ? "px-2 py-4" : "px-6 py-6"}
        ${dataSaverActive ? "compact-spacing" : ""}
        ${isLandscape ? "landscape-layout" : ""}
      `}
      >
        {children}
      </main>

      {/* Mobile-specific optimizations */}
      <style jsx global>{`
        .mobile-layout {
          font-size: 16px; /* Prevents zoom on iOS */
        }

        .mobile-layout input,
        .mobile-layout select,
        .mobile-layout textarea {
          font-size: 16px; /* Prevents zoom on focus */
        }

        .data-saver img {
          display: none;
        }

        .data-saver .data-saver-show {
          display: block !important;
        }

        .data-saver * {
          animation: none !important;
          transition: none !important;
        }

        .compact-spacing .space-y-6 > * + * {
          margin-top: 1rem !important;
        }

        .compact-spacing .space-y-4 > * + * {
          margin-top: 0.75rem !important;
        }

        .compact-spacing .p-6 {
          padding: 1rem !important;
        }

        .compact-spacing .p-4 {
          padding: 0.75rem !important;
        }

        .landscape-layout {
          max-height: 100vh;
          overflow-y: auto;
        }

        /* Touch-friendly button sizing */
        .mobile-layout button {
          min-height: 44px;
          min-width: 44px;
        }

        /* Improved scrolling on mobile */
        .mobile-layout {
          -webkit-overflow-scrolling: touch;
        }

        /* Reduce motion when data saver is active */
        .data-saver-mode *,
        .data-saver-mode *::before,
        .data-saver-mode *::after {
          animation-delay: -1ms !important;
          animation-duration: 1ms !important;
          animation-iteration-count: 1 !important;
          background-attachment: initial !important;
          scroll-behavior: auto !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }

        /* Low bandwidth optimizations */
        @media (max-width: 768px) {
          .recharts-wrapper {
            max-height: 200px !important;
          }

          .grid-cols-4 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .md\\:grid-cols-2 {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .mobile-layout {
            filter: contrast(1.2);
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .mobile-layout * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

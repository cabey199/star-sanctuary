import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { SUPPORTED_LANGUAGES } from "../../shared/types";

interface LanguageSelectorProps {
  variant?: "select" | "compact";
  className?: string;
}

export default function LanguageSelector({
  variant = "select",
  className = "",
}: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();

  const languageNames = {
    en: "English",
    am: "አማርኛ",
    ar: "العربية",
  };

  if (variant === "compact") {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <Globe className="w-4 h-4 text-gray-500" />
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-auto h-8 border-none shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <SelectItem key={code} value={code}>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{name}</span>
                  <span className="text-xs text-gray-500">
                    {languageNames[code as keyof typeof languageNames]}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {t("settings.language")}
      </label>
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-full">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
            <SelectItem key={code} value={code}>
              <div className="flex items-center space-x-3">
                <span className="font-medium">{name}</span>
                <span className="text-sm text-gray-500">
                  {languageNames[code as keyof typeof languageNames]}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// Quick language toggle buttons for header
export function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
        <Button
          key={code}
          variant={language === code ? "default" : "ghost"}
          size="sm"
          onClick={() => setLanguage(code as "en" | "am" | "ar")}
          className="h-8 px-2 text-xs"
        >
          {code.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}

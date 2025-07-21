import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Share2,
  Instagram,
  MessageCircle,
  Phone,
  Facebook,
  Twitter,
  Send,
  Copy,
  Eye,
  Download,
  Palette,
  Image as ImageIcon,
  Search,
  TrendingUp,
  Target,
  Globe,
  Heart,
  Star,
  Calendar,
  MapPin,
  Clock,
  Users,
  Zap,
  Sparkles,
  Megaphone,
  Gift,
  Tag,
} from "lucide-react";

interface PostTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  hashtags: string[];
  image?: string;
  style: {
    backgroundColor: string;
    textColor: string;
    fontWeight: "normal" | "bold";
    fontSize: "sm" | "base" | "lg";
  };
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  characterLimit: number;
  supportsImages: boolean;
  supportsHashtags: boolean;
}

interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  structuredData: boolean;
}

const PromotionTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState("social");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplate | null>(
    null,
  );
  const [customPost, setCustomPost] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [seoSettings, setSeoSettings] = useState<SEOSettings>({
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    structuredData: true,
  });

  const socialPlatforms: SocialPlatform[] = [
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "#E4405F",
      characterLimit: 2200,
      supportsImages: true,
      supportsHashtags: true,
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: MessageCircle,
      color: "#25D366",
      characterLimit: 4096,
      supportsImages: true,
      supportsHashtags: false,
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: Send,
      color: "#0088CC",
      characterLimit: 4096,
      supportsImages: true,
      supportsHashtags: false,
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "#1877F2",
      characterLimit: 63206,
      supportsImages: true,
      supportsHashtags: true,
    },
    {
      id: "twitter",
      name: "X (Twitter)",
      icon: Twitter,
      color: "#000000",
      characterLimit: 280,
      supportsImages: true,
      supportsHashtags: true,
    },
    {
      id: "messenger",
      name: "Messenger",
      icon: MessageCircle,
      color: "#006AFF",
      characterLimit: 20000,
      supportsImages: true,
      supportsHashtags: false,
    },
    {
      id: "sms",
      name: "SMS",
      icon: Phone,
      color: "#34C759",
      characterLimit: 160,
      supportsImages: false,
      supportsHashtags: false,
    },
  ];

  const postTemplates: PostTemplate[] = [
    {
      id: "1",
      name: "Grand Opening",
      category: "Announcement",
      content:
        "🎉 GRAND OPENING! We're thrilled to announce that {businessName} is now open! Book your appointment today and experience our premium {serviceType} services. Limited slots available!",
      hashtags: ["#GrandOpening", "#BookNow", "#PremiumService"],
      style: {
        backgroundColor: "#3B82F6",
        textColor: "#FFFFFF",
        fontWeight: "bold",
        fontSize: "lg",
      },
    },
    {
      id: "2",
      name: "Flash Sale",
      category: "Promotion",
      content:
        "⚡ FLASH SALE ALERT! ⚡ Get 20% OFF all {serviceType} services this week only! Don't miss out - book your slot now at {businessName}. Offer valid until {date}!",
      hashtags: ["#FlashSale", "#Discount", "#LimitedTime"],
      style: {
        backgroundColor: "#EF4444",
        textColor: "#FFFFFF",
        fontWeight: "bold",
        fontSize: "base",
      },
    },
    {
      id: "3",
      name: "Weekend Special",
      category: "Promotion",
      content:
        "🌟 Weekend Special at {businessName}! Treat yourself to our relaxing {serviceType} services. Perfect way to unwind after a busy week. Book your weekend appointment now!",
      hashtags: ["#WeekendSpecial", "#RelaxTime", "#BookingOpen"],
      style: {
        backgroundColor: "#8B5A3C",
        textColor: "#FFFFFF",
        fontWeight: "normal",
        fontSize: "base",
      },
    },
    {
      id: "4",
      name: "New Service Launch",
      category: "Announcement",
      content:
        "🆕 Exciting News! We're launching our new {serviceType} service at {businessName}! Be among the first to experience this amazing addition to our menu. Book now!",
      hashtags: ["#NewService", "#Innovation", "#BookFirst"],
      style: {
        backgroundColor: "#10B981",
        textColor: "#FFFFFF",
        fontWeight: "bold",
        fontSize: "base",
      },
    },
    {
      id: "5",
      name: "Customer Appreciation",
      category: "Thank You",
      content:
        "❤️ Thank you to all our amazing customers! Your trust and support mean the world to us at {businessName}. Ready for your next {serviceType} appointment?",
      hashtags: ["#ThankYou", "#CustomerLove", "#Grateful"],
      style: {
        backgroundColor: "#F59E0B",
        textColor: "#FFFFFF",
        fontWeight: "normal",
        fontSize: "base",
      },
    },
    {
      id: "6",
      name: "Limited Availability",
      category: "Urgency",
      content:
        "⏰ Only {slotsLeft} slots left this week at {businessName}! Don't wait - secure your {serviceType} appointment now. High demand, limited availability!",
      hashtags: ["#LimitedSlots", "#BookNow", "#HighDemand"],
      style: {
        backgroundColor: "#DC2626",
        textColor: "#FFFFFF",
        fontWeight: "bold",
        fontSize: "lg",
      },
    },
  ];

  const businessInfo = {
    name: "Elite Barber Shop",
    slug: "elite-barber",
    serviceType: "barbering",
    description: "Premium barbering services in the heart of the city",
    location: "Downtown District",
    phone: "+1 (555) 123-4567",
    email: "contact@elitebarber.com",
    website: `${window.location.origin}/elite-barber`,
    logo: "",
    primaryColor: "#8B5A3C",
    secondaryColor: "#5D3A28",
  };

  const fillTemplate = (template: PostTemplate) => {
    const currentDate = new Date();
    const weekEndDate = new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000,
    );

    return template.content
      .replace(/{businessName}/g, businessInfo.name)
      .replace(/{serviceType}/g, businessInfo.serviceType)
      .replace(/{location}/g, businessInfo.location)
      .replace(/{phone}/g, businessInfo.phone)
      .replace(/{date}/g, weekEndDate.toLocaleDateString())
      .replace(/{slotsLeft}/g, Math.floor(Math.random() * 5 + 3).toString())
      .replace(/{website}/g, businessInfo.website);
  };

  const generateSocialPost = (
    template: PostTemplate,
    platform: SocialPlatform,
  ) => {
    let content = fillTemplate(template);

    // Add platform-specific content
    if (platform.supportsHashtags && template.hashtags.length > 0) {
      content += "\n\n" + template.hashtags.join(" ");
    }

    // Add booking link
    content += `\n\n📅 Book now: ${businessInfo.website}`;

    // Trim to character limit
    if (content.length > platform.characterLimit) {
      content = content.substring(0, platform.characterLimit - 3) + "...";
    }

    return content;
  };

  const shareToSocial = (platform: SocialPlatform, content: string) => {
    const encodedContent = encodeURIComponent(content);
    const encodedUrl = encodeURIComponent(businessInfo.website);

    let shareUrl = "";

    switch (platform.id) {
      case "instagram":
        // Instagram doesn't have direct sharing URLs, copy to clipboard instead
        navigator.clipboard.writeText(content);
        alert(
          "Content copied to clipboard! Open Instagram and paste in a new post.",
        );
        return;

      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodedContent}`;
        break;

      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedContent}`;
        break;

      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedContent}`;
        break;

      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedContent}`;
        break;

      case "messenger":
        shareUrl = `https://www.messenger.com/t/?link=${encodedUrl}`;
        break;

      case "sms":
        shareUrl = `sms:?body=${encodedContent}`;
        break;

      default:
        navigator.clipboard.writeText(content);
        alert("Content copied to clipboard!");
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const generateSEOKeywords = () => {
    const baseKeywords = [
      businessInfo.serviceType,
      "booking",
      "appointment",
      businessInfo.location,
      "online booking",
      "schedule",
    ];

    setSeoSettings((prev) => ({
      ...prev,
      keywords: baseKeywords,
      metaTitle: `${businessInfo.name} - Book ${businessInfo.serviceType} Online`,
      metaDescription: `Book your ${businessInfo.serviceType} appointment at ${businessInfo.name} in ${businessInfo.location}. ${businessInfo.description}`,
      ogTitle: `${businessInfo.name} - Premium ${businessInfo.serviceType} Services`,
      ogDescription: `Experience premium ${businessInfo.serviceType} services at ${businessInfo.name}. Book your appointment online today!`,
    }));
  };

  useEffect(() => {
    generateSEOKeywords();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Promotion & Marketing Tools
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Boost your business with one-click social media sharing and SEO
            optimization
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          Marketing Suite
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="social" className="flex items-center">
            <Share2 className="h-4 w-4 mr-2" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center">
            <Sparkles className="h-4 w-4 mr-2" />
            Post Templates
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center">
            <Search className="h-4 w-4 mr-2" />
            SEO & Visibility
          </TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Megaphone className="h-5 w-5 mr-2" />
                One-Click Social Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {socialPlatforms.map((platform) => (
                  <Card
                    key={platform.id}
                    className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                      selectedPlatform === platform.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700"
                    }`}
                    onClick={() => setSelectedPlatform(platform.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
                        style={{ backgroundColor: platform.color }}
                      >
                        <platform.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-medium text-sm">{platform.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {platform.characterLimit} chars
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedPlatform && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">
                      Create Post for{" "}
                      {
                        socialPlatforms.find((p) => p.id === selectedPlatform)
                          ?.name
                      }
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPlatform("")}
                    >
                      Close
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="custom-post">Custom Message</Label>
                      <Textarea
                        id="custom-post"
                        value={customPost}
                        onChange={(e) => setCustomPost(e.target.value)}
                        placeholder={`Write your ${socialPlatforms.find((p) => p.id === selectedPlatform)?.name} post here...`}
                        rows={4}
                        maxLength={
                          socialPlatforms.find((p) => p.id === selectedPlatform)
                            ?.characterLimit
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {customPost.length}/
                        {
                          socialPlatforms.find((p) => p.id === selectedPlatform)
                            ?.characterLimit
                        }{" "}
                        characters
                      </p>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          const platform = socialPlatforms.find(
                            (p) => p.id === selectedPlatform,
                          )!;
                          const content =
                            customPost ||
                            `Check out ${businessInfo.name}! Book your ${businessInfo.serviceType} appointment online: ${businessInfo.website}`;
                          shareToSocial(platform, content);
                        }}
                        className="flex items-center"
                        style={{
                          backgroundColor: socialPlatforms.find(
                            (p) => p.id === selectedPlatform,
                          )?.color,
                        }}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Now
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const content =
                            customPost ||
                            `Check out ${businessInfo.name}! Book your ${businessInfo.serviceType} appointment online: ${businessInfo.website}`;
                          copyToClipboard(content);
                        }}
                        className="flex items-center"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Share Buttons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">📅 Promote Availability</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Share your available booking slots
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const content = `🗓️ Available slots this week at ${businessInfo.name}! Book your ${businessInfo.serviceType} appointment now: ${businessInfo.website}`;
                      setCustomPost(content);
                      setSelectedPlatform("whatsapp");
                    }}
                  >
                    Share Availability
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">⭐ Customer Reviews</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Showcase customer satisfaction
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const content = `⭐⭐⭐⭐⭐ Another happy customer at ${businessInfo.name}! Experience premium ${businessInfo.serviceType} services. Book now: ${businessInfo.website}`;
                      setCustomPost(content);
                      setSelectedPlatform("instagram");
                    }}
                  >
                    Share Reviews
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">🎁 Special Offers</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Promote discounts and deals
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const content = `🎁 Special offer alert! Book your ${businessInfo.serviceType} appointment this week and save! Limited time only at ${businessInfo.name}: ${businessInfo.website}`;
                      setCustomPost(content);
                      setSelectedPlatform("facebook");
                    }}
                  >
                    Share Offers
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">📍 Location & Contact</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Share business information
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const content = `📍 Visit us at ${businessInfo.name} in ${businessInfo.location}!\n📞 ${businessInfo.phone}\n🌐 Book online: ${businessInfo.website}`;
                      setCustomPost(content);
                      setSelectedPlatform("whatsapp");
                    }}
                  >
                    Share Info
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Catchy Post Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {postTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer transition-all hover:shadow-lg border"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <Badge variant="outline" className="text-xs mt-1">
                            {template.category}
                          </Badge>
                        </div>
                        <div
                          className="w-6 h-6 rounded"
                          style={{
                            backgroundColor: template.style.backgroundColor,
                          }}
                        ></div>
                      </div>

                      <div
                        className="p-3 rounded text-sm mb-3"
                        style={{
                          backgroundColor: template.style.backgroundColor,
                          color: template.style.textColor,
                          fontWeight: template.style.fontWeight,
                          fontSize:
                            template.style.fontSize === "sm"
                              ? "0.875rem"
                              : template.style.fontSize === "lg"
                                ? "1.125rem"
                                : "1rem",
                        }}
                      >
                        {fillTemplate(template).substring(0, 120)}...
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.hashtags.slice(0, 3).map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setIsPreviewOpen(true);
                          }}
                          className="flex items-center flex-1"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            const content = generateSocialPost(
                              template,
                              socialPlatforms[0],
                            );
                            setCustomPost(content);
                            setActiveTab("social");
                          }}
                          className="flex items-center flex-1"
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Template Preview Dialog */}
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Preview: {selectedTemplate?.name}</DialogTitle>
                <DialogDescription>
                  See how your post will look across different platforms
                </DialogDescription>
              </DialogHeader>

              {selectedTemplate && (
                <div className="space-y-4">
                  <div
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: selectedTemplate.style.backgroundColor,
                      color: selectedTemplate.style.textColor,
                      fontWeight: selectedTemplate.style.fontWeight,
                    }}
                  >
                    <div className="whitespace-pre-wrap">
                      {fillTemplate(selectedTemplate)}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedTemplate.hashtags.map((tag, idx) => (
                        <span key={idx} className="text-blue-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {socialPlatforms.slice(0, 4).map((platform) => (
                      <div key={platform.id} className="border rounded p-3">
                        <div className="flex items-center mb-2">
                          <platform.icon
                            className="h-4 w-4 mr-2"
                            style={{ color: platform.color }}
                          />
                          <span className="text-sm font-medium">
                            {platform.name}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {
                            generateSocialPost(selectedTemplate, platform)
                              .length
                          }
                          /{platform.characterLimit} chars
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    if (selectedTemplate) {
                      const content = generateSocialPost(
                        selectedTemplate,
                        socialPlatforms[0],
                      );
                      setCustomPost(content);
                      setActiveTab("social");
                      setIsPreviewOpen(false);
                    }
                  }}
                >
                  Use This Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                SEO Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="meta-title">SEO Title</Label>
                  <Input
                    id="meta-title"
                    value={seoSettings.metaTitle}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        metaTitle: e.target.value,
                      })
                    }
                    placeholder="Your Business Name - Book Online"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {seoSettings.metaTitle.length}/60 characters (optimal:
                    50-60)
                  </p>
                </div>

                <div>
                  <Label htmlFor="meta-description">SEO Description</Label>
                  <Textarea
                    id="meta-description"
                    value={seoSettings.metaDescription}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        metaDescription: e.target.value,
                      })
                    }
                    placeholder="Describe your business and services for search engines"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {seoSettings.metaDescription.length}/160 characters
                    (optimal: 150-160)
                  </p>
                </div>

                <div>
                  <Label htmlFor="keywords">SEO Keywords</Label>
                  <Input
                    id="keywords"
                    value={seoSettings.keywords.join(", ")}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        keywords: e.target.value
                          .split(",")
                          .map((k) => k.trim())
                          .filter((k) => k),
                      })
                    }
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate keywords with commas
                  </p>
                </div>

                <Button onClick={generateSEOKeywords} variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Auto-Generate SEO Content
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Social Media Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="og-title">Social Media Title</Label>
                  <Input
                    id="og-title"
                    value={seoSettings.ogTitle}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        ogTitle: e.target.value,
                      })
                    }
                    placeholder="Title when shared on social media"
                  />
                </div>

                <div>
                  <Label htmlFor="og-description">
                    Social Media Description
                  </Label>
                  <Textarea
                    id="og-description"
                    value={seoSettings.ogDescription}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        ogDescription: e.target.value,
                      })
                    }
                    placeholder="Description when shared on social media"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="og-image">Social Media Image URL</Label>
                  <Input
                    id="og-image"
                    value={seoSettings.ogImage}
                    onChange={(e) =>
                      setSeoSettings({
                        ...seoSettings,
                        ogImage: e.target.value,
                      })
                    }
                    placeholder="https://example.com/share-image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 1200x630px for best compatibility
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="structured-data"
                    checked={seoSettings.structuredData}
                    onCheckedChange={(checked) =>
                      setSeoSettings({
                        ...seoSettings,
                        structuredData: checked,
                      })
                    }
                  />
                  <Label htmlFor="structured-data">
                    Enable Rich Snippets (Schema.org)
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Performance Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <Target className="h-8 w-8 text-green-500 mb-2" />
                  <h4 className="font-medium mb-1">Local SEO</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Include your city and area in keywords for local discovery
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <Star className="h-8 w-8 text-yellow-500 mb-2" />
                  <h4 className="font-medium mb-1">Customer Reviews</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Encourage reviews to boost local search rankings
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <ImageIcon className="h-8 w-8 text-blue-500 mb-2" />
                  <h4 className="font-medium mb-1">Visual Content</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add high-quality images with descriptive alt tags
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <Clock className="h-8 w-8 text-purple-500 mb-2" />
                  <h4 className="font-medium mb-1">Regular Updates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Keep your content fresh with regular posts and updates
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromotionTools;

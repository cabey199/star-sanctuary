import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Image as ImageIcon,
  X,
  Edit,
  Trash2,
  Eye,
  Download,
  Star,
  Settings,
  Grid,
  List,
  Filter,
  Search,
  Plus,
  Camera,
  Palette,
  Move,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Crop,
  Maximize,
} from "lucide-react";

interface ImageAsset {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  category: "logo" | "banner" | "gallery" | "service" | "avatar" | "background";
  alt: string;
  caption?: string;
  uploadedAt: string;
  dimensions: {
    width: number;
    height: number;
  };
  isPublic: boolean;
  isPrimary?: boolean;
}

interface ImageGallerySettings {
  layout: "grid" | "masonry" | "carousel" | "slider";
  itemsPerRow: number;
  showCaptions: boolean;
  enableLightbox: boolean;
  enableDownload: boolean;
  sortBy: "newest" | "oldest" | "name" | "size";
}

const ImageUploadSystem: React.FC = () => {
  const [images, setImages] = useState<ImageAsset[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500",
      filename: "barbershop-interior.jpg",
      size: 245760,
      type: "image/jpeg",
      category: "gallery",
      alt: "Modern barbershop interior",
      caption: "Our modern and comfortable barbershop space",
      uploadedAt: "2024-01-15T10:30:00Z",
      dimensions: { width: 800, height: 600 },
      isPublic: true,
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500",
      filename: "haircut-service.jpg",
      size: 189440,
      type: "image/jpeg",
      category: "service",
      alt: "Professional haircut service",
      caption: "Premium haircut services by our expert barbers",
      uploadedAt: "2024-01-14T15:45:00Z",
      dimensions: { width: 600, height: 800 },
      isPublic: true,
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=500",
      filename: "spa-relaxation.jpg",
      size: 312320,
      type: "image/jpeg",
      category: "banner",
      alt: "Relaxing spa environment",
      caption: "Experience ultimate relaxation at our spa",
      uploadedAt: "2024-01-13T09:20:00Z",
      dimensions: { width: 1200, height: 400 },
      isPublic: true,
      isPrimary: true,
    },
  ]);

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageAsset | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [gallerySettings, setGallerySettings] = useState<ImageGallerySettings>({
    layout: "grid",
    itemsPerRow: 3,
    showCaptions: true,
    enableLightbox: true,
    enableDownload: false,
    sortBy: "newest",
  });

  const categories = [
    { id: "all", label: "All Images", count: images.length },
    {
      id: "logo",
      label: "Logos",
      count: images.filter((img) => img.category === "logo").length,
    },
    {
      id: "banner",
      label: "Banners",
      count: images.filter((img) => img.category === "banner").length,
    },
    {
      id: "gallery",
      label: "Gallery",
      count: images.filter((img) => img.category === "gallery").length,
    },
    {
      id: "service",
      label: "Services",
      count: images.filter((img) => img.category === "service").length,
    },
    {
      id: "avatar",
      label: "Avatars",
      count: images.filter((img) => img.category === "avatar").length,
    },
    {
      id: "background",
      label: "Backgrounds",
      count: images.filter((img) => img.category === "background").length,
    },
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileUpload = async (files: File[]) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        alert(
          `Invalid file type: ${file.name}. Only JPG, PNG, WebP, and GIF are allowed.`,
        );
        continue;
      }

      if (file.size > maxSize) {
        alert(`File too large: ${file.name}. Maximum size is 10MB.`);
        continue;
      }

      // Create object URL for preview
      const url = URL.createObjectURL(file);

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        const newImage: ImageAsset = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          url,
          filename: file.name,
          size: file.size,
          type: file.type,
          category: "gallery",
          alt: file.name.replace(/\.[^/.]+$/, ""),
          caption: "",
          uploadedAt: new Date().toISOString(),
          dimensions: { width: img.width, height: img.height },
          isPublic: true,
        };

        setImages((prev) => [newImage, ...prev]);
      };
      img.src = url;
    }

    setUploadDialogOpen(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(Array.from(e.target.files));
    }
  };

  const filteredImages = images.filter((image) => {
    const matchesCategory =
      selectedCategory === "all" || image.category === selectedCategory;
    const matchesSearch =
      searchTerm === "" ||
      image.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (image.caption &&
        image.caption.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (gallerySettings.sortBy) {
      case "newest":
        return (
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
      case "oldest":
        return (
          new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
        );
      case "name":
        return a.filename.localeCompare(b.filename);
      case "size":
        return b.size - a.size;
      default:
        return 0;
    }
  });

  const deleteImage = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    setSelectedImages((prev) => prev.filter((id) => id !== imageId));
  };

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId],
    );
  };

  const deleteSelectedImages = () => {
    setImages((prev) => prev.filter((img) => !selectedImages.includes(img.id)));
    setSelectedImages([]);
  };

  const toggleImagePublic = (imageId: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, isPublic: !img.isPublic } : img,
      ),
    );
  };

  const setPrimaryImage = (imageId: string, category: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary:
          img.id === imageId && img.category === category
            ? true
            : img.category === category
              ? false
              : img.isPrimary,
      })),
    );
  };

  const updateImageDetails = (
    imageId: string,
    updates: Partial<ImageAsset>,
  ) => {
    setImages((prev) =>
      prev.map((img) => (img.id === imageId ? { ...img, ...updates } : img)),
    );
    setEditingImage(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Image Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Upload, organize, and display images for your business
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload Images
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Upload New Images</DialogTitle>
                <DialogDescription>
                  Upload JPG, PNG, WebP, or GIF images up to 10MB each
                </DialogDescription>
              </DialogHeader>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Supports: JPG, PNG, WebP, GIF (max 10MB each)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </Label>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gallery">Image Gallery</TabsTrigger>
          <TabsTrigger value="display">Display Settings</TabsTrigger>
          <TabsTrigger value="public">Public Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-6">
          {/* Filters and Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center"
                >
                  {category.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
              >
                {viewMode === "grid" ? (
                  <List className="h-4 w-4" />
                ) : (
                  <Grid className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedImages.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm font-medium">
                {selectedImages.length} image(s) selected
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedImages([])}
                >
                  Clear Selection
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Selected
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete Selected Images
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedImages.length}{" "}
                        selected image(s)? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={deleteSelectedImages}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Images
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          {/* Image Grid/List */}
          {sortedImages.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ImageIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No Images Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm || selectedCategory !== "all"
                    ? "No images match your current filters"
                    : "Start by uploading your first images"}
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? `grid grid-cols-1 md:grid-cols-${gallerySettings.itemsPerRow} lg:grid-cols-${gallerySettings.itemsPerRow + 1} gap-4`
                  : "space-y-4"
              }
            >
              {sortedImages.map((image) => (
                <Card
                  key={image.id}
                  className={`relative group cursor-pointer transition-all hover:shadow-lg ${
                    selectedImages.includes(image.id)
                      ? "ring-2 ring-blue-500"
                      : ""
                  } ${viewMode === "list" ? "flex" : ""}`}
                  onClick={() => toggleImageSelection(image.id)}
                >
                  <div
                    className={`relative ${viewMode === "list" ? "w-32 h-24" : "aspect-square"}`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover rounded-lg"
                    />

                    {/* Overlay Controls */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 bg-white/90"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingImage(image);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 bg-white/90"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Image
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "
                                  {image.filename}"? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteImage(image.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="absolute top-2 left-2">
                        <div className="flex flex-col space-y-1">
                          {image.isPrimary && (
                            <Badge className="bg-yellow-500 text-white text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Primary
                            </Badge>
                          )}
                          <Badge
                            variant={image.isPublic ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {image.isPublic ? "Public" : "Private"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Info */}
                  <CardContent
                    className={`${viewMode === "list" ? "flex-1 p-4" : "p-3"}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm truncate">
                          {image.filename}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {image.category}
                        </Badge>
                      </div>

                      {image.caption && gallerySettings.showCaptions && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {image.caption}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {image.dimensions.width} × {image.dimensions.height}
                        </span>
                        <span>{formatFileSize(image.size)}</span>
                      </div>

                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleImagePublic(image.id);
                          }}
                        >
                          {image.isPublic ? "Make Private" : "Make Public"}
                        </Button>

                        {image.category !== "logo" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs h-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrimaryImage(image.id, image.category);
                            }}
                          >
                            Set Primary
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Display Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="layout">Gallery Layout</Label>
                  <select
                    id="layout"
                    value={gallerySettings.layout}
                    onChange={(e) =>
                      setGallerySettings((prev) => ({
                        ...prev,
                        layout: e.target.value as any,
                      }))
                    }
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="grid">Grid Layout</option>
                    <option value="masonry">Masonry Layout</option>
                    <option value="carousel">Carousel Slider</option>
                    <option value="slider">Full-width Slider</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="itemsPerRow">Items Per Row</Label>
                  <select
                    id="itemsPerRow"
                    value={gallerySettings.itemsPerRow}
                    onChange={(e) =>
                      setGallerySettings((prev) => ({
                        ...prev,
                        itemsPerRow: parseInt(e.target.value),
                      }))
                    }
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                    <option value={5}>5 Columns</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="sortBy">Sort Images By</Label>
                  <select
                    id="sortBy"
                    value={gallerySettings.sortBy}
                    onChange={(e) =>
                      setGallerySettings((prev) => ({
                        ...prev,
                        sortBy: e.target.value as any,
                      }))
                    }
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">File Name</option>
                    <option value="size">File Size</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showCaptions">Show Image Captions</Label>
                  <input
                    type="checkbox"
                    id="showCaptions"
                    checked={gallerySettings.showCaptions}
                    onChange={(e) =>
                      setGallerySettings((prev) => ({
                        ...prev,
                        showCaptions: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enableLightbox">Enable Lightbox View</Label>
                  <input
                    type="checkbox"
                    id="enableLightbox"
                    checked={gallerySettings.enableLightbox}
                    onChange={(e) =>
                      setGallerySettings((prev) => ({
                        ...prev,
                        enableLightbox: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="enableDownload">Allow Image Downloads</Label>
                  <input
                    type="checkbox"
                    id="enableDownload"
                    checked={gallerySettings.enableDownload}
                    onChange={(e) =>
                      setGallerySettings((prev) => ({
                        ...prev,
                        enableDownload: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="public" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Public Gallery Preview</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Preview how your images will appear on your public booking page
              </p>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4">Gallery</h3>
                <div
                  className={`grid grid-cols-${gallerySettings.itemsPerRow} gap-4`}
                >
                  {images
                    .filter((img) => img.isPublic)
                    .slice(0, 6)
                    .map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        {gallerySettings.showCaptions && image.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 rounded-b-lg">
                            <p className="text-sm">{image.caption}</p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                {images.filter((img) => img.isPublic).length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No public images to display. Make some images public to see
                    them here.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Image Dialog */}
      {editingImage && (
        <Dialog open={true} onOpenChange={() => setEditingImage(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Image Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-filename">Filename</Label>
                <Input
                  id="edit-filename"
                  value={editingImage.filename}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      filename: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="edit-alt">Alt Text</Label>
                <Input
                  id="edit-alt"
                  value={editingImage.alt}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      alt: e.target.value,
                    })
                  }
                  placeholder="Describe the image for accessibility"
                />
              </div>

              <div>
                <Label htmlFor="edit-caption">Caption</Label>
                <Input
                  id="edit-caption"
                  value={editingImage.caption || ""}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      caption: e.target.value,
                    })
                  }
                  placeholder="Optional caption for display"
                />
              </div>

              <div>
                <Label htmlFor="edit-category">Category</Label>
                <select
                  id="edit-category"
                  value={editingImage.category}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="logo">Logo</option>
                  <option value="banner">Banner</option>
                  <option value="gallery">Gallery</option>
                  <option value="service">Service</option>
                  <option value="avatar">Avatar</option>
                  <option value="background">Background</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingImage(null)}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  updateImageDetails(editingImage.id, editingImage)
                }
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ImageUploadSystem;

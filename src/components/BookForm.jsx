import { useState, useEffect } from "react";
import { X, BookOpen, User, Building, Calendar, Upload } from "lucide-react";
import { validateBook } from "../utils/validation";

// Form field component
const FormField = ({ label, error, required, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
      {!required && <span className="text-gray-400">(Optional)</span>}
    </label>
    {children}
    {error && (
      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
        ⚠️ {error}
      </p>
    )}
  </div>
);

export default function BookForm({ book, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    publishedDate: "",
    description: "",
    image: "",
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        author: book.author || "",
        publisher: book.publisher || "",
        publishedDate: book.publishedDate || "",
        description: book.description || "",
        image: book.image || "",
      });
      if (book.image) setImagePreview(book.image);
    }
  }, [book]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateBook(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Only JPG, PNG, and WEBP images are allowed",
      }));
      return;
    }
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size should be less than 5MB",
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      handleChange("image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    handleChange("image", "");
    const fileInput = document.getElementById("imageInput");
    if (fileInput) fileInput.value = "";
  };

  const inputClass = (hasError) =>
    `w-full px-4 py-3 bg-white border-2 ${hasError ? "border-red-500" : "border-gray-200"} rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-gray-900 placeholder-gray-400`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-white">
                <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" />
                {book ? "Edit Book" : "Add New Book"}
              </h2>
              <p className="text-white/90 text-sm mt-1">
                Fill in all required fields
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Image Upload */}
            <div className="sm:col-span-2">
              <FormField label="Book Cover Image" error={errors.image}>
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-all bg-gray-50">
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="imageInput"
                      className="cursor-pointer flex flex-col items-center gap-3"
                    >
                      <div className="bg-purple-100 p-4 rounded-full">
                        <Upload className="text-purple-600" size={32} />
                      </div>
                      <div>
                        <p className="text-gray-900 font-semibold mb-1">
                          Click to upload book cover
                        </p>
                        <p className="text-sm text-gray-600">
                          JPG, PNG, or WEBP (Max 5MB)
                        </p>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="relative border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-6 right-6 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all shadow-lg"
                    >
                      <X size={20} />
                    </button>
                    <p className="text-sm text-green-600 mt-3 text-center font-medium">
                      ✓ Image uploaded successfully
                    </p>
                  </div>
                )}
              </FormField>
            </div>

            {/* Title */}
            <div className="sm:col-span-2">
              <FormField label="Book Title" error={errors.title} required>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className={inputClass(errors.title)}
                  placeholder="Enter book title"
                  maxLength={200}
                />
              </FormField>
            </div>

            {/* Author */}
            <div>
              <FormField label="Author" error={errors.author} required>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => handleChange("author", e.target.value)}
                    className={`pl-10 ${inputClass(errors.author)}`}
                    placeholder="Author name"
                    maxLength={100}
                  />
                </div>
              </FormField>
            </div>

            {/* Publisher */}
            <div>
              <FormField label="Publisher" error={errors.publisher} required>
                <div className="relative">
                  <Building
                    className="absolute left-3 top-3.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={formData.publisher}
                    onChange={(e) => handleChange("publisher", e.target.value)}
                    className={`pl-10 ${inputClass(errors.publisher)}`}
                    placeholder="Publisher name"
                    maxLength={150}
                  />
                </div>
              </FormField>
            </div>

            {/* Published Date */}
            <div className="sm:col-span-2">
              <FormField
                label="Published Date"
                error={errors.publishedDate}
                required
              >
                <div className="relative">
                  <Calendar
                    className="absolute left-3 top-3.5 text-gray-400"
                    size={18}
                  />
                  <input
                    type="date"
                    value={formData.publishedDate}
                    onChange={(e) =>
                      handleChange("publishedDate", e.target.value)
                    }
                    max={new Date().toISOString().split("T")[0]}
                    className={`pl-10 ${inputClass(errors.publishedDate)}`}
                  />
                </div>
              </FormField>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <FormField
                label="Description"
                error={errors.description}
                required
              >
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows="4"
                  className={`${inputClass(errors.description)} resize-none`}
                  placeholder="Enter a detailed description of the book..."
                  maxLength={5000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 10 characters required
                </p>
              </FormField>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {book ? "✓ Update Book" : "+ Add Book"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all border border-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

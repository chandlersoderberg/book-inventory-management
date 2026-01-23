/**
 * Validate book form data
 */
export const validateBook = (data) => {
  const errors = {};
  
  // Title
  if (!data.title?.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.trim().length < 2) {
    errors.title = 'Title must be at least 2 characters';
  } else if (data.title.trim().length > 200) {
    errors.title = 'Title must not exceed 200 characters';
  } else if (/\d/.test(data.title)) {
    errors.title = 'Title cannot contain numbers';
  }
  
  // Author
  if (!data.author?.trim()) {
    errors.author = 'Author is required';
  } else if (data.author.trim().length < 2) {
    errors.author = 'Author name must be at least 2 characters';
  } else if (data.author.trim().length > 100) {
    errors.author = 'Author name must not exceed 100 characters';
  } else if (/\d/.test(data.author)) {
    errors.author = 'Author name cannot contain numbers';
  } else if (!/^[a-zA-Z\s\-.]+$/.test(data.author.trim())) {
    errors.author = 'Author name can only contain letters, spaces, hyphens, and periods';
  }
  
  // Publisher
  if (!data.publisher?.trim()) {
    errors.publisher = 'Publisher is required';
  } else if (data.publisher.trim().length < 2) {
    errors.publisher = 'Publisher must be at least 2 characters';
  } else if (data.publisher.trim().length > 150) {
    errors.publisher = 'Publisher must not exceed 150 characters';
  } else if (/\d/.test(data.publisher)) {
    errors.publisher = 'Publisher name cannot contain numbers';
  }
  
  // Published Date
  if (!data.publishedDate) {
    errors.publishedDate = 'Published date is required';
  } else {
    const selectedDate = new Date(data.publishedDate);
    const currentDate = new Date();
    
    if (isNaN(selectedDate.getTime())) {
      errors.publishedDate = 'Invalid date format';
    } else if (selectedDate > currentDate) {
      errors.publishedDate = 'Published date cannot be in the future';
    }
  }
  
  // Description
  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  } else if (data.description.trim().length > 5000) {
    errors.description = 'Description must not exceed 5000 characters';
  }

  // Image (Optional)
  if (data.image?.trim()) {
    const base64Pattern = /^data:image\/(jpeg|jpg|png|webp);base64,/;
    const urlPattern = /^https?:\/\/.+/;
    
    if (!base64Pattern.test(data.image) && !urlPattern.test(data.image)) {
      errors.image = 'Invalid image format';
    }
    
    if (base64Pattern.test(data.image)) {
      const approximateSize = (data.image.length * 0.75) / (1024 * 1024);
      if (approximateSize > 5) {
        errors.image = 'Image size exceeds 5MB limit';
      }
    }
  }
  
  return errors;
};

/**
 * Validate image file before upload
 */
export const validateImageFile = (file) => {
  const errors = {};
  
  if (!file) return errors;
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    errors.image = 'Only JPG, PNG, and WEBP images are allowed';
    return errors;
  }
  
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    errors.image = 'Image size should be less than 5MB';
  }
  
  return errors;
};
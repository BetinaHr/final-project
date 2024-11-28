export const getErrorMessage = (err) => {
    switch (err.name) {
        case 'ValidationError': {
            // Extract the first validation error message
            const firstError = Object.values(err.errors).at(0)?.message;
            return firstError || 'Validation failed.';
        }
        case 'MongoServerError': {
            // Handle MongoDB-specific errors (e.g., duplicate key)
            if (err.code === 11000) {
                const field = Object.keys(err.keyValue).at(0);
                return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
            }
            return 'Database error.';
        }
        default:
            // Handle generic errors
            return err.message || 'An unexpected error occurred.';
    }
};

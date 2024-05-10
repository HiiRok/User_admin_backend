# Backend in Node.js

Use Postman or any other HTTP client to test the API endpoints.

## Project Structure

The project follows the MVC (Model-View-Controller) architecture. Here's the structure of the project:

- `models/`: Contains Mongoose models for MongoDB schema.
- `routes/`: Contains route handlers for API endpoints.
- `middlewares/`: Contains middleware functions for authentication and authorization.
- `utils/`: Contains utility functions used throughout the project.
- `app.js`: Entry point of the application.

## API Endpoints

The following API endpoints are available:

- `/signup`: Register a new user.
- `/login`: Log in with existing credentials.
- `/logout`: Log out the user.
- `/user-profile`: Get user profile details.
- `/update-profile`: Update user profile details.
- `/toggle-access`: Toggle user profile access type (public/private).
- `/admin/users`: Get all user profiles (admin only).

## Dependencies

- `express`: Web framework for Node.js.
- `mongoose`: MongoDB object modeling tool.
- `jsonwebtoken`: JSON Web Token implementation.
- `dotenv`: Environment variable loader.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

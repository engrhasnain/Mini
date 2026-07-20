# MiniEcommerce Backend Documentation

This folder contains the backend application for MiniEcommerce, built with Python and FastAPI. It provides RESTful APIs for product management, user authentication, cart operations, order processing, and admin features.

---

## Setup & Installation

1. **Clone the repository**
2. **Create and activate a virtual environment**
	 - Windows: `python -m venv .venv && .venv\Scripts\activate`
	 - Linux/Mac: `python3 -m venv .venv && source .venv/bin/activate`
3. **Install dependencies**
	 - `pip install -r requirements.txt`
4. **Configure environment variables**
	 - Create a `.env` file in `backend/` with:
		 ```env
		 DATABASE_URL=sqlite:///./app.db
		 SECRET_KEY=your_secret_key
		 ALGORITHM=HS256
		 ACCESS_TOKEN_EXPIRE_MINUTES=30
		 ```
5. **Run database migrations** (if using Alembic):
	 - `alembic upgrade head`
6. **Start the server**
	 - `uvicorn app.main:app --reload`

---

## API Documentation

- Interactive OpenAPI docs available at [`/docs`](http://localhost:8000/docs) when server is running.
- Example request/response for registration:
	- **POST /auth/register**
		```json
		{
			"username": "john",
			"email": "john@example.com",
			"password": "strongpassword"
		}
		```
		Response:
		```json
		{
			"id": 1,
			"username": "john",
			"email": "john@example.com",
			"role": "user"
		}
		```

---

## Testing

- **Run tests:**
	- `pytest`
- **Linting & formatting:**
	- `black .`
	- `flake8 .`

---

## Migration & Database

- **Alembic** is recommended for schema migrations. See `alembic.ini` and migration scripts.
- **Default database:** SQLite for development; can be switched to PostgreSQL/MySQL in `.env`.

---

## Extending & Customizing

- Add new routers in `app/routers/` for new features.
- Add new models in `app/models/` and schemas in `app/schemas/`.
- Update `app/core/config.py` for new settings.
- Integrate third-party services in `app/utils/`.

---

## Monitoring & Logging

- Use FastAPI's built-in logging or integrate with `loguru` for advanced logging.
- Monitor API usage and errors via external tools (e.g., Sentry).

---

## Example API Usage

- **Get products:**
	- `GET /products`
	- Response:
		```json
		[
			{
				"id": 1,
				"name": "Product A",
				"price": 19.99,
				"stock": 10
			}
		]
		```
- **Add to cart:**
	- `POST /cart/add`
		```json
		{
			"product_id": 1,
			"quantity": 2
		}
		```

---

## References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Pytest Documentation](https://docs.pytest.org/)

---

## Features
...existing code...
## API Endpoints

API endpoints are organized by feature in `app/routers/`. Each router handles a specific domain:

- **Auth (`routers/auth.py`)**
	- `POST /auth/register`: Register a new user
	- `POST /auth/login`: Authenticate user and return JWT
	- `GET /auth/me`: Get current user info
- **Products (`routers/products.py`)**
	- `GET /products`: List all products
	- `GET /products/{id}`: Get product details
	- `POST /products`: Create product (admin)
	- `PUT /products/{id}`: Update product (admin)
	- `DELETE /products/{id}`: Delete product (admin)
- **Cart (`routers/cart.py`)**
	- `GET /cart`: Get current user's cart
	- `POST /cart/add`: Add product to cart
	- `POST /cart/remove`: Remove product from cart
	- `POST /cart/update`: Update cart item quantity
- **Orders (`routers/orders.py`)**
	- `GET /orders`: List user's orders
	- `POST /orders`: Place a new order
	- `GET /orders/{id}`: Get order details
- **Admin (`routers/admin.py`)**
	- `GET /admin/users`: List all users
	- `GET /admin/orders`: List all orders
	- `GET /admin/products`: List all products
	- Additional endpoints for admin management

All endpoints use JWT authentication where required and return JSON responses.

## Models

Database models are defined in `app/models/`:

- **User**: Stores user info, hashed password, role (user/admin)
- **Product**: Product details (name, description, price, stock, image)
- **Cart**: User cart, links user to products and quantities
- **Order**: Order records, links user, products, status, timestamps

Models use SQLAlchemy for ORM mapping and relationships.

## Database Schemas

Pydantic schemas in `app/schemas/` define request and response formats:

- **UserSchema, UserCreate, UserOut**: For user registration, login, and output
- **ProductSchema, ProductCreate, ProductUpdate**: For product CRUD
- **CartSchema, CartItem, CartUpdate**: For cart operations
- **OrderSchema, OrderCreate, OrderOut**: For order processing

These schemas ensure type safety and validation for all API interactions.

## Services & Utilities

Business logic and utility functions are organized for maintainability:

- **Authentication Service**: Handles password hashing, JWT creation/validation
- **Database Service**: Session management, CRUD operations
- **Security Utilities**: Role checks, dependency injection for protected routes
- **Core Utilities**: Common helpers for error handling, response formatting

Services are implemented in `app/core/` and `app/utils/` for separation of concerns and reusability.

# MiniEcommerce Backend Documentation

This folder contains the backend application for MiniEcommerce, built with Python and FastAPI. It provides RESTful APIs for product management, user authentication, cart operations, order processing, and admin features.

## Features

- **User Authentication**: Secure registration, login, and JWT-based session management.
- **Product Management**: CRUD operations for products, including admin-only endpoints.
- **Cart Management**: Add, update, and remove products from user carts.
- **Order Processing**: Place orders, view order history, and manage order status.
- **Admin Dashboard**: Endpoints for managing users, products, and orders.
- **Role-Based Access Control**: Protects sensitive endpoints for admin users.
- **Database Integration**: Uses SQLAlchemy for ORM and database operations.
- **Validation & Serialization**: Pydantic schemas for request/response validation.
- **Error Handling**: Consistent error responses and exception management.

## Technical Overview

- **Framework**: FastAPI for high-performance, async REST APIs.
- **Database**: SQLAlchemy ORM, configured in `app/database.py`.
- **Configuration**: Settings managed in `app/core/config.py` (e.g., database URL, secret keys).
- **Security**: JWT authentication, password hashing, and dependency-based access control in `app/core/security.py` and `app/core/dependencies.py`.
- **Routing**: API endpoints organized in `app/routers/` by feature (auth, products, cart, orders, admin).
- **Models**: Database models defined in `app/models/` (user, product, cart, order).
- **Schemas**: Pydantic schemas in `app/schemas/` for data validation and serialization.
- **Utils**: Utility functions in `app/utils/` for common tasks.

## Data Flow Example

1. **User Registration/Login**: Auth endpoints validate input, hash passwords, and issue JWT tokens. User info and tokens are stored securely.
2. **Product CRUD**: Admin endpoints allow creation, update, and deletion of products. Public endpoints fetch product lists and details.
3. **Cart Operations**: Cart endpoints update user cart in the database and return current cart state.
4. **Order Placement**: Order endpoints validate cart, create order records, and update product stock.
5. **Admin Actions**: Admin endpoints in `routers/admin.py` allow management of users, products, and orders.

## Key Implementation Choices

- **FastAPI**: Chosen for async support, automatic docs, and type hints.
- **SQLAlchemy**: Robust ORM for database operations.
- **Pydantic**: Ensures data validation and serialization.
- **JWT Authentication**: Secure, stateless session management.
- **Modular Routing**: Organized routers for maintainability and scalability.

## Security Considerations

- Passwords are hashed before storage.
- JWT tokens are used for authentication and authorization.
- Role checks protect admin endpoints.
- Input validation prevents common attacks.

## Testing & Quality

- Use `pytest` for automated testing.
- Linting and formatting via `black` and `flake8`.
- Modular code for maintainability and extensibility.

## Deployment & Environment Setup

- **Environment Variables**: Configure secrets and database URLs in `.env` or via environment variables.
- **Production Server**: Use `uvicorn` or `gunicorn` for running FastAPI in production.
- **Database Migration**: Use Alembic for schema migrations if needed.

## Extensibility & Customization

- Add new features by creating routers and models in `app/`.
- Update schemas for new data structures.
- Integrate third-party services via utility modules.


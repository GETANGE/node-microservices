# Node Microservices Project 🚀

This repository showcases a microservices-based architecture implemented with Node.js, aiming to demonstrate proficiency in building distributed systems.

---

## ⚙️ Technologies Used

* **Node.js** – JavaScript runtime environment 🟢
* **Express.js** – Web framework for Node.js 🌐
* **MongoDB** – NoSQL database for data persistence 🍃
* **Mongoose** – ODM for MongoDB 📄
* **Redis** – In-memory data structure store, used for caching and message brokering 🧠
* **RabbitMQ** – Message broker for asynchronous communication between services 🐇
* **Docker & Docker Compose** – Containerization and orchestration tools 🐳

---

## 🧱 Microservices Overview

The application is divided into the following microservices:

1. **API Gateway**: Serves as the single entry point for client requests 🚪
2. **Identity Service**: Handles user authentication and authorization 🔐
3. **Media Service**: Manages media uploads and processing 🖼️
4. **Post Service**: Manages creation, retrieval, and manipulation of posts 📝
5. **Search Service**: Provides search functionality across posts and media 🔍

---

## 🗂️ Project Structure

```bash
node-microservices/
├── api-gateway/          # Entry point for all client requests
├── identity-service/     # User authentication and authorization
├── media-service/        # Media upload and processing
├── post-service/         # Post management
├── search-service/       # Search functionality
├── docker-compose.yml    # Docker Compose configuration
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have the following installed:

* [Docker](https://www.docker.com/) 🐳
* [Docker Compose](https://docs.docker.com/compose/) 🧩

### ⚙️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/GETANGE/node-microservices.git
   cd node-microservices
   ```

2. **Start the services using Docker Compose:**

   ```bash
   docker-compose up --build
   ```

   This command will build and start all the microservices along with their dependencies.

---

## 📫 API Endpoints

Each microservice exposes specific endpoints. Below is a summary:

### 🌐 API Gateway

* `POST /api/auth/register` – Register a new user ✍️
* `POST /api/auth/login` – Authenticate a user 🔑
* `GET /api/posts` – Retrieve all posts 📄
* `POST /api/posts` – Create a new post 📝
* `POST /api/media/upload` – Upload media content 📤
* `GET /api/search?query=...` – Search posts and media 🔍

*Note: All requests should be directed to the API Gateway, which will route them to the appropriate service.*

---

## 🧰 Development

To work on a specific service:

1. **Navigate to the service directory:**

   ```bash
   cd <service-name>
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Start the service:**

   ```bash
   pnpm start
   ```

Ensure that the necessary environment variables are set, either through a `.env` file or your system's environment settings.

---

## 🧪 Testing

Each service includes its own set of tests. To run tests for a service:

1. **Navigate to the service directory:**

   ```bash
   cd <service-name>
   ```

2. **Run the tests:**

   ```bash
   pnpm test
   ```

---

## 📦 Deployment

For production deployment, it's recommended to:

* Use a process manager like PM2 for managing Node.js processes 🔁
* Set up reverse proxies (e.g., Nginx) for handling HTTPS and domain routing 🌐
* Implement monitoring and logging solutions for observability 📊

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

This project was developed to demonstrate knowledge in building distributed systems using Node.js and related technologies.

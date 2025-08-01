# 🩺 Wellness Guard – Backend Microservices

A Node.js-based backend system for a **medication reminder application**. This repository follows a **microservice architecture**, with services for authentication, notifications, and medication tracking. It also includes Kubernetes infrastructure configurations for **AWS EKS** deployment.

## License

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.

## 📦 Microservices

- **Auth Service** – Handles user authentication with **Google OAuth** and **Facebook OAuth**, along with JWT token management.
- **Notification Service** – Sends alerts and messages via **AWS SNS/SES** and listens to Kafka events.
- **Medication Service** – Manages medication schedules and event publishing.
- **Infra** – Contains Kubernetes manifests for deployment on AWS EKS.

---

## ☁️ Technologies Used

- **Node.js** with **TypeScript** and Express
- **PostgreSQL** as primary relational database
- **MongoDB** for notifications and medication data storage
- **Kafka** for event-driven communication
- **AWS SNS**, **SES**, and **EKS**
- **Google OAuth** and **Facebook OAuth** for user authentication
- **Docker** for containerization of all services
- **Kubernetes** with `kubectl`, `eksctl`, and optionally `kind` or `minikube`

---

## ⚙️ Environment Configuration

All services use a **single shared `.env` file in the root**.

Create the file by copying from the example:

```bash
cp .env.example .env
```

## 🧪 Running the Application

You can run the microservices either locally with **Docker** or deploy them to a **Kubernetes** cluster using `kubectl`.

---

### 🚀 Run Locally with Docker

1. **Build Docker images for each microservice:**

```bash
docker build -t wellness-auth ./auth
docker build -t wellness-notification ./notification
docker build -t wellness-medication ./medication


docker run --env-file .env -p 3001:3001 wellness-auth
docker run --env-file .env -p 5000:5000 wellness-notification
docker run --env-file .env -p 6000:6000 wellness-medication


2. **OR Run with Kubernetes locally:**

kind create cluster --name wellness-local
kind load docker-image wellness-auth --name wellness-local
kind load docker-image wellness-notification --name wellness-local
kind load docker-image wellness-medication --name wellness-local
kubectl apply -f infra/
kubectl create configmap env-config --from-env-file=.env --namespace=default
# or (recommended for secrets):
kubectl create secret generic env-secret --from-env-file=.env --namespace=default

minikube start

eval $(minikube docker-env)
docker build -t wellness-auth ./auth
docker build -t wellness-notification ./notification
docker build -t wellness-medication ./medication


```

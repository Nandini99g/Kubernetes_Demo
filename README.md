# Simple K8s Web App 

A tiny, hands-on project to learn Kubernetes by deploying a minimal Node.js web app in containers. This README walks you step-by-step from code → Docker → local Kubernetes cluster (kind or Minikube) → verify and practice common Kubernetes operations.

## Table of contents

Project overview

Repository structure

Prerequisites

Quick start (recommended: kind)

Alternative: Run with Minikube

Build, deploy, and verify (detailed)

Useful kubectl commands & examples

Advanced exercises (next steps)

Troubleshooting tips

License & notes

## Project overview

This project contains:

--> A tiny Node.js HTTP app (app.js) that replies with a JSON payload including the handling pod name and version,
--> A minimal Dockerfile,
--> Kubernetes manifests (k8s/) for Deployment, Service, and optional HorizontalPodAutoscaler (HPA).

Goal: practice deploying, scaling, updating, and debugging an app in Kubernetes.

Repository structure
.
├─ app.js
├─ package.json
├─ Dockerfile
├─ README.md
└─ k8s/
   ├─ deployment.yaml
   ├─ service.yaml

Prerequisites

Install the following on your development machine (choose one local cluster: kind or Minikube):

--> Node.js (18+ or 20+) — run app locally and build image
Check: node -v

--> Docker (Docker Desktop on Windows/macOS or Docker Engine on Linux)
Check: docker --version

--> kubectl — Kubernetes CLI
Check: kubectl version --client

--> kind (recommended for WSL users) or Minikube
--->kind: kind --version
--->minikube: minikube version

-->curl for testing endpoints

WSL notes: If using WSL on Windows, prefer kind (runs inside Docker) or configure Minikube to use the Docker driver and enable Docker Desktop WSL integration.

## Quick start (recommended: kind)

-->These commands assume you are in the project root.

Create a kind cluster

## install kind if not already installed (see prerequisites)
kind create cluster


## Build Docker image and load into kind

docker build -t simple-k8s-app:1.0 .
kind load docker-image simple-k8s-app:1.0


Apply Kubernetes manifests

kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
## optional:
kubectl apply -f k8s/hpa.yaml


## Port-forward to access app

kubectl port-forward svc/simple-k8s 8080:80
open http://localhost:8000


Test in a separate terminal

curl http://localhost:8000
## Example response:
 {"message":"Hello from simple-k8s-app","pod":"simple-k8s-7cbd54f7bf-b5p8x","version":"v1"}

## Alternative: Run with Minikube

If you prefer Minikube and have Docker Desktop or a VM driver:

## Start minikube with Docker driver (WSL users require Docker Desktop)

minikube start --driver=docker


## Build the image inside Minikube’s Docker daemon so it doesn’t need a registry:

eval $(minikube docker-env)
docker build -t simple-k8s-app:1.0 .
## revert env if needed: eval $(minikube docker-env -u)


## Apply manifests and access:

kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
minikube service simple-k8s --url   # prints a URL you can curl

Build, deploy, and verify (detailed)
1. Build Docker image
docker build -t simple-k8s-app:1.0 .

2. (kind) Load image into cluster
kind load docker-image simple-k8s-app:1.0

3. Deploy to cluster
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

4. Check resources
kubectl get pods -l app=simple-k8s
kubectl get svc simple-k8s
kubectl describe deployment simple-k8s

5. Access the app
Port-forward (recommended for local testing):
kubectl port-forward svc/simple-k8s 8000:80
then open http://localhost:8000

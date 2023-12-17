resource "kubernetes_namespace" "backend_ns" {
    metadata {
        name = var.namespace_name
    }
}

resource "kubernetes_deployment" "backend_deployment" {
    metadata {
        name = "backend-deployment"
        namespace = var.namespace_name
        labels = {
          app = "backend"
        }
    }
    spec {
      replicas = 2
      selector {
        match_labels = {
          app = "backend"
        }
      }
      template {
        metadata {
            labels = {
              app = "backend"
            } 
        }
        spec {
          container {
            image = "backend:test"
            name = "backend"
            resources {
              limits = {
                cpu = "0.5"
                memory = "512Mi"
              }
              requests = {
                cpu = "250m"
                memory = "50Mi"
              }
            }
            port {
              name = "http"
              container_port = 3000
            }
          }
        }
      }
    }
    depends_on = [ kubernetes_namespace.backend_ns ]
}

resource "kubernetes_service" "backend_service" {
    metadata {
      name = "backend-svc"
      namespace = "backend"
    }
    spec {
        selector = {
          app = "backend"
        }
        port {
            protocol = "TCP"
            port = 3000
            target_port = "http"
        }
    }
    depends_on = [ kubernetes_namespace.backend_ns ]
}
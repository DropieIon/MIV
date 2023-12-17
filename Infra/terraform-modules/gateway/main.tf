resource "kubernetes_namespace" "ingress-apisix" {
  metadata {
    name = var.namespace
  }
}

resource "helm_release" "apisix" {
  chart      = "apisix"
  name       = "apisix"
  repository = "https://charts.apiseven.com"
  namespace  = var.namespace
#   version    = "6.24.1"
  values = [ yamlencode(var.chart_values) ]

  depends_on = [ kubernetes_namespace.ingress-apisix ]
}

resource "kubernetes_manifest" "backend-route" {
  manifest = {
    apiVersion = "apisix.apache.org/v2"
    kind       = "ApisixRoute"

    metadata = {
      namespace = "backend"
      name = "api-routes"
    }

    spec = {
      http = [
        {
          name = "backend-route",
          match = {
            paths = ["/login"],
          },
          backends = [
            {
              serviceName = "backend-svc",
              servicePort = 3000,
            }
          ]
        }
      ]
    }
  }
}
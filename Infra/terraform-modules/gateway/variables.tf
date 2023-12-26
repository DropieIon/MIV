variable "kube_config" {
  type    = string
  default = "~/.kube/config"
}

variable "namespace" {
  type = string
}

variable "chart_values" {
  type = object({
    gateway = object({
      type = string
    })
    ingress-controller = object({
      enabled = bool
      config = object({
        apisix = object({
          serviceNamespace = string
        })
      })
    })
  })
}
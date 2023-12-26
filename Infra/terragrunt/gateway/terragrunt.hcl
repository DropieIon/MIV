terraform {
  source = "../../terraform-modules/gateway//"
}

# for getting providers
include {
    path = find_in_parent_folders("providers.hcl")
}

inputs = {
    namespace = "ingress-test"
    chart_values = {
        gateway = {
            type = "LoadBalancer"
        }
        ingress-controller = {
            enabled = true
            config = {
                apisix = {
                serviceNamespace = "ingress-test"
                }
            }
        }
    }
}
generate "provider" {
  path      = "master_provider.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF

provider "helm" {
  kubernetes {
    config_path = pathexpand("~/.kube/config")
  }
}

provider "kubernetes" {
  config_path = pathexpand("~/.kube/config")
}

EOF
}

generate "versions" {
  path      = "master_versions_override.tf"
  if_exists = "overwrite_terragrunt"
  contents  = <<EOF
    terraform {
      required_providers {
        kubernetes = {
            source = "hashicorp/kubernetes"
            version = "2.24.0"
        }
        helm = {
            source = "hashicorp/helm"
            version = "2.12.1"
        }
      }
    }
EOF
}

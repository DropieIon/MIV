terraform {
  source = "../../terraform-modules/backend//"
}

# for getting providers
include {
    path = find_in_parent_folders("providers.hcl")
}

inputs = {
    namespace_name = "backend"
}
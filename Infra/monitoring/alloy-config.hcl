logging {
  level  = "debug"
  format = "logfmt"
  write_to = [loki.process.alloy.receiver]
}

discovery.docker "linux" {
  host = "unix:///var/run/docker.sock"
}

// Define a relabeling rule to create a service name from the container name.
discovery.relabel "logs_integrations_docker" {
      targets = []
  
      rule {
          source_labels = ["__meta_docker_container_name"]
          regex = "/(.*)"
          target_label = "service_name"
      }

  }


// Configure a loki.source.docker component to collect logs from Docker containers.
loki.source.docker "default" {
  host       = "unix:///var/run/docker.sock"
  targets    = discovery.docker.linux.targets
  labels     = {"platform" = "docker"}
  relabel_rules = discovery.relabel.logs_integrations_docker.rules
  forward_to = [loki.write.default.receiver]
}

loki.process "alloy" {
  stage.labels {
    values = {
      service_name = "alloy",
    }
  }
  forward_to = [loki.write.default.receiver]
}

loki.write "default" {
  endpoint {
    url = "http://loki:3100/loki/api/v1/push"
  }
}
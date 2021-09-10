output "instance_ip_addr" {
  value       = aws_instance.backend_api_instance.private_ip
  description = "The private IP address of the server instance."
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.backend_api_instance.public_ip
}

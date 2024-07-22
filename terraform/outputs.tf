output "elb_dns_name" {
  value = aws_elb.nodejs_elb.dns_name
}

output "api_url" {
  value = "http://${aws_elb.nodejs_elb.dns_name}"
  description = "URL for the Node.js API"
}

output "cassandra_eip" {
  value = aws_eip.cassandra_eip.public_ip
  description = "Elastic IP for Cassandra DB"
}

output "nodejs_api_eip" {
  value       = aws_eip.nodejs_api_eip.public_ip
  description = "Elastic IP for Node.js API"
}
output "elb_dns_name" {
  value = aws_elb.nodejs_elb.dns_name
}

output "api_url" {
  value = "http://${aws_elb.nodejs_elb.dns_name}"
  description = "URL for the Node.js API"
}
provider "aws" {
  region = "eu-west-1"
}

resource "aws_security_group" "nodejs_sg" {
  name_prefix = "nodejs_sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    owner = "thashil.naidoo@bbd.co.za"
    created-using = "terraform"
  }
}

resource "aws_instance" "nodejs_api" {
  ami           = "ami-0c38b837cd80f13bb"
  instance_type = "t2.micro"
  key_name      = "cassandra_kp"
  security_groups = [aws_security_group.nodejs_sg.name]

  tags = {
    Name = "NodeJS-API"
    owner = "thashil.naidoo@bbd.co.za"
    created-using = "terraform"
  }

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y nodejs npm
              EOF
}

resource "aws_elb" "nodejs_elb" {
  name               = "nodejs-elb"
  availability_zones = ["eu-west-1a", "eu-west-1b"]

  listener {
    instance_port     = 80
    instance_protocol = "HTTP"
    lb_port           = 80
    lb_protocol       = "HTTP"
  }

  health_check {
    target              = "HTTP:80/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  instances = [aws_instance.nodejs_api.id]

  tags = {
    Name = "NodeJS-API-ELB"
    owner = "thashil.naidoo@bbd.co.za"
    created-using = "terraform"
  }
}

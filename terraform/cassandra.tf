resource "aws_security_group" "cassandra_sg" {
  name_prefix = "cassandra_sg"

  ingress {
    from_port   = 9042
    to_port     = 9042
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

resource "aws_instance" "cassandra" {
  ami           = "ami-0c38b837cd80f13bb"
  instance_type = "t2.micro"
  key_name      = "cassandra_kp"
  security_groups = [aws_security_group.cassandra_sg.name]

  tags = {
    Name = "CassandraDB"
    owner = "thashil.naidoo@bbd.co.za"
    created-using = "terraform"
  }

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y openjdk-11-jdk
              echo "deb http://www.apache.org/dist/cassandra/debian 311x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
              curl https://www.apache.org/dist/cassandra/KEYS | sudo apt-key add -
              sudo apt-get update -y
              sudo apt-get install -y cassandra
              sudo service cassandra start
              EOF
}

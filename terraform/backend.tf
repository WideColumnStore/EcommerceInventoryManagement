terraform {
  backend "s3" {
    bucket         = "cassandra-state-bucket"
    key            = "terraform.tfstate"   
    region         = "eu-west-1"                   
  }
}

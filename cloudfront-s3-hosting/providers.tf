# Provider requirements
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0" # Any 6.x version
    }
  }
}
# AWS provider config
provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      environment = "dev"
      created_by  = "terraform"
    }
  }
}

/*locals {
  all_instance_ids = aws_instance.my_instance[*].id
}*/

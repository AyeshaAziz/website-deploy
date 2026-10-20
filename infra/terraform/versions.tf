terraform {
  required_version = ">= 1.6"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
  # TODO: configure remote state (S3 backend + DynamoDB lock) before first apply
}

provider "aws" {
  region = var.aws_region
}

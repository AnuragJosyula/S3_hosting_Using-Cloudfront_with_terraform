variable "region" {
  type = string
}

variable "instance_count" {
  type = number
}

variable "ami_id" {
  type = string
}

variable "monitoring" {
  description = "Enable detailed monitoring for the EC2 instance"
  type        = bool
  default     = true
}

variable "associate_public_ip_address" {
  description = "Enable public IP address for the EC2 instance"
  type        = bool
  default     = true
}

variable "allowed_vms" {
  description = "List of allowed VMs"
  type        = list(string)
  default     = ["t2.micro", "t2.small", "t2.medium"]
}

variable "cidr_block" {
  description = "CIDR block for the VPC"
  type        = list(string)
  default     = ["10.0.0.0/24"]
}


variable "tags" {
  description = "common tags for all resources"
  type        = map(string)
  default = {
    environment = "dev"
    Name        = "dev-instance"
    created_by  = "terraform"
  }
}

variable "ingress_rules" {
  type = list(object({
    from_port   = number
    to_port     = number
    protocol    = string
    cidr_blocks = list(string)
    description = string
  }))

  default = [
    {
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
      description = "Allow HTTP traffic"
    },
    {
      from_port   = 443
      to_port     = 443
      protocol    = "tcp"
      cidr_blocks = ["0.0.0.0/0"]
      description = "Allow HTTPS traffic"
    }
  ]
}

variable "bucket_name" {
  type = string
  default = "anurag-s3-cloudfront-hosting"
}


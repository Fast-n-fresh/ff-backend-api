variable "instance_name" {
  description = "Value of the Name tag for the EC2 instance"
  type        = string
  default     = "ec2-instance"
}
variable "instance_type" {
  description = "Value of the type of EC2 instance"
  type        = string
  default     = "t2.micro"
}
variable "access_key" {
  description = "Value of the AWS Access Key"
  type        = string
}
variable "secret_key" {
  description = "Value of the AWS Secret Key"
  type        = string
}
variable "region" {
  description = "Value of the region for EC2"
  type        = string
  default     = "us-east-1"
}
variable "ami" {
  description = "Value of the ami of EC2 instance"
  type        = string
  default     = "ami-2757f631"
}
variable "key_name" {
  type = string
}
variable "vpc_security_group_ids" {
  default = []
  type    = list(string)
}

# Day 1 footprint (see plan, section 8): single-AZ, small instances, no Redis.
# Implemented: media bucket. TODO in order: VPC, RDS (db.t4g.small), ALB,
# EC2 ASG (2 x t3a.small) or equivalent, CloudFront, Secrets Manager, CloudWatch alarms.

resource "aws_s3_bucket" "media" {
  bucket = "itqa-media-${var.environment}"
}

resource "aws_s3_bucket_public_access_block" "media" {
  bucket                  = aws_s3_bucket.media.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "media" {
  bucket = aws_s3_bucket.media.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "aws:kms"
    }
  }
}

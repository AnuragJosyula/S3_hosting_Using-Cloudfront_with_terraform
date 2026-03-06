resource "aws_s3_bucket" "my_website_bucket" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_public_access_block" "s3_hosting_block" {
  bucket     = aws_s3_bucket.my_website_bucket.id
  depends_on = [aws_s3_bucket.my_website_bucket]

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_cloudfront_origin_access_control" "s3_hosting_oac" {
  name                              = "s3_hosting_oac"
  description                       = "OAC for S3 hosting"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_s3_bucket_policy" "s3_hosting_policy" {
  bucket     = aws_s3_bucket.my_website_bucket.id
  depends_on = [aws_s3_bucket_public_access_block.s3_hosting_block]
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontService(s3_hosting)"
        Action = ["s3:GetObject", "s3:ListBucket"]
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Resource = [
          aws_s3_bucket.my_website_bucket.arn,
          "${aws_s3_bucket.my_website_bucket.arn}/*"
        ]
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.s3_hosting_distribution.arn
          }
        }
      }
    ]
  })
}

resource "aws_s3_object" "s3_hosting_object" {
  bucket   = aws_s3_bucket.my_website_bucket.id
  for_each = fileset("${path.module}/www", "**/*")
  key      = each.value
  source   = "${path.module}/www/${each.value}"
  etag     = filemd5("${path.module}/www/${each.value}")
  content_type = lookup({
    "html" = "text/html",
    "css"  = "text/css",
    "js"   = "application/javascript",
    "json" = "application/json",
    "png"  = "image/png",
    "jpg"  = "image/jpeg",
    "jpeg" = "image/jpeg",
    "gif"  = "image/gif",
    "svg"  = "image/svg+xml",
    "ico"  = "image/x-icon",
    "txt"  = "text/plain"
  }, split(".", each.value)[length(split(".", each.value)) - 1], "application/octet-stream")
}

resource "aws_cloudfront_distribution" "s3_hosting_distribution" {
  enabled             = true
  default_root_object = "index.html"

  origin {
    domain_name              = aws_s3_bucket.my_website_bucket.bucket_regional_domain_name
    origin_id                = local.s3_origin_id
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_hosting_oac.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = local.s3_origin_id
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

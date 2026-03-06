# ☁️ Static Website Hosting with S3 & CloudFront — Terraform + GitHub Actions

Infrastructure-as-Code project that deploys a **static website** on AWS using **S3** for storage and **CloudFront** as a global CDN, all provisioned with **Terraform** and automated via **GitHub Actions**.

---

## 🏗️ Architecture

```
┌──────────────┐        ┌──────────────────┐        ┌────────────┐
│   Browser    │──────▶│   CloudFront      │──────▶│  S3 Bucket  │
│   (HTTPS)    │◀──────│   Distribution    │◀──────│  (Private)  │
└──────────────┘        └──────────────────┘        └────────────┘
                              │
                              ├─ Origin Access Control (OAC)
                              ├─ HTTPS redirect
                              └─ Default root: index.html
```

**Key design choices:**

- S3 bucket is **fully private** — no public access
- CloudFront uses **OAC (Origin Access Control)** for secure S3 access
- Viewer traffic is **redirected to HTTPS**
- Terraform state stored in a **remote S3 backend** with state locking

---

## 📁 Project Structure

```
.
├── .github/workflows/
│   └── action.yml              # GitHub Actions CI/CD pipeline
├── cloudfront-s3-hosting/
│   ├── main.tf                 # S3, CloudFront, OAC, bucket policy
│   ├── variables.tf            # Input variables (bucket name)
│   ├── providers.tf            # AWS provider config
│   ├── backend.tf              # Remote S3 backend for state
│   ├── outputs.tf              # Output values
│   └── www/                    # Static website files
│       ├── index.html
│       ├── style.css
│       └── script.js
└── README.md
```

---

## 🔧 AWS Resources Created

| Resource | Purpose |
|---|---|
| `aws_s3_bucket` | Stores website files (private) |
| `aws_s3_bucket_public_access_block` | Blocks all public access to S3 |
| `aws_s3_bucket_policy` | Allows CloudFront-only access via OAC |
| `aws_s3_object` | Uploads all files from `www/` with correct content types |
| `aws_cloudfront_origin_access_control` | Secures the S3 ↔ CloudFront connection |
| `aws_cloudfront_distribution` | CDN that serves the website globally over HTTPS |

---

## 🚀 CI/CD Pipeline — GitHub Actions

The pipeline uses **`workflow_dispatch`** (manual trigger) so you control exactly when infrastructure changes are applied.

### How to run

1. Go to **Actions** tab → **"Terraform Plan/Apply"**
2. Click **"Run workflow"**
3. Choose action:
   - `plan` → Preview what Terraform will change (safe, no modifications)
   - `apply` → Actually create/modify the infrastructure

### Pipeline steps

```
Checkout → Configure AWS Creds → Setup Terraform → Init → Validate → Plan → Apply (if selected)
```

### Required GitHub configuration

| Type | Name | Where to set |
|---|---|---|
| **Secret** | `AWS_ACCESS_KEY_ID` | Settings → Secrets → Actions |
| **Secret** | `AWS_SECRET_ACCESS_KEY` | Settings → Secrets → Actions |
| **Variable** | `AWS_REGION` | Settings → Variables → Actions |

---

## ⚙️ Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.10
- AWS CLI configured with valid credentials
- An S3 bucket for Terraform state backend (`dante-bucket-tfstate`)

---

## 🖥️ Local Usage

```bash
cd cloudfront-s3-hosting

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Deploy infrastructure
terraform apply

# Destroy infrastructure
terraform destroy
```

---

## 📝 Variables

| Variable | Type | Default | Description |
|---|---|---|---|
| `bucket_name` | `string` | `anurag-s3-cloudfront-hosting` | Name of the S3 bucket for hosting |

---

## 🛡️ Security

- S3 bucket has **all public access blocked**
- CloudFront uses **Origin Access Control (OAC)** — the modern replacement for OAI
- Bucket policy only allows access from the specific CloudFront distribution
- All viewer traffic is **redirected to HTTPS**
- AWS credentials are stored as **GitHub Secrets** (never in code), Further Implementation - Github OIDC provider
- Terraform state is stored in a **remote S3 backend**

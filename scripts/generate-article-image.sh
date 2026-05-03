#!/bin/bash
# ============================================
# 🎨 Article Hero Image Generator
# ============================================
# Generates a hero image for an article using GPT-5.4 image via 9Router
# Then uploads to R2 (images.aicopyrightlegal.com)
#
# Usage: ./generate-article-image.sh "Article Title" "slug" ["category"]
#
# Output: URL of uploaded image on R2

TITLE="${1:?Usage: generate-article-image.sh 'Article Title' 'slug' ['category']}"
SLUG="${2:?Slug required}"
CATEGORY="${3:-News}"

API_KEY="sk-e47874a3-55ae-45d1-9ec3-d7cfc7df3b22-lr4kkk-704f04d7"
ENDPOINT="http://localhost:20128/v1/images/generations"
R2_UPLOAD_URL="https://api.aicopyrightlegal.com/api/images"
R2_API_KEY="acl-dashboard-2026-secret"

OUTPUT_PNG="/tmp/article-hero-${SLUG}.png"
OUTPUT="/tmp/article-hero-${SLUG}.webp"

# Build a prompt that creates a professional editorial illustration
PROMPT="Professional editorial illustration for a legal technology news article titled '${TITLE}'. Category: ${CATEGORY}. Style: modern, clean, minimalist digital art with blue and purple tones. Include subtle visual elements related to AI, copyright law, digital rights, or technology. No text in the image. Wide landscape format, suitable as a blog hero image. High quality, editorial magazine style."

# WebP quality (82 = good balance of quality/size, typically 100-200KB)
WEBP_QUALITY=82

echo "🎨 Generating hero image for: ${TITLE}"
echo "   Slug: ${SLUG}"
echo "   Category: ${CATEGORY}"

# Generate image via 9Router
RESPONSE=$(curl -s --max-time 180 -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d "{\"model\":\"cx/gpt-5.4-image\",\"prompt\":\"${PROMPT}\",\"n\":1,\"size\":\"1536x1024\",\"quality\":\"high\",\"output_format\":\"png\"}")

# Extract and save image (as PNG first)
IMAGE_URL=$(echo "$RESPONSE" | python3 -c "
import json, sys, base64, os
try:
    data = json.load(sys.stdin)
    if 'error' in data:
        print('ERROR:' + json.dumps(data['error']), file=sys.stderr)
        sys.exit(1)
    if 'data' in data and data['data']:
        b64 = data['data'][0].get('b64_json', '')
        if b64:
            img = base64.b64decode(b64)
            with open('$OUTPUT_PNG', 'wb') as f:
                f.write(img)
            print('OK')
        else:
            url = data['data'][0].get('url', '')
            if url:
                print('URL:' + url)
            else:
                print('ERROR:no image data', file=sys.stderr)
                sys.exit(1)
    else:
        print('ERROR:unexpected response', file=sys.stderr)
        sys.exit(1)
except Exception as e:
    print(f'ERROR:{e}', file=sys.stderr)
    sys.exit(1)
")

if [ $? -ne 0 ]; then
    echo "❌ Image generation failed"
    exit 1
fi

if [ ! -f "$OUTPUT_PNG" ]; then
    echo "❌ Image file not created"
    exit 1
fi

PNG_KB=$(( $(stat -f%z "$OUTPUT_PNG" 2>/dev/null || stat -c%s "$OUTPUT_PNG" 2>/dev/null) / 1024 ))
echo "✅ PNG generated (${PNG_KB} KB)"

# Convert PNG → WebP (massive size reduction)
echo "🔄 Converting to WebP (quality ${WEBP_QUALITY})..."
cwebp -q $WEBP_QUALITY -resize 1536 0 "$OUTPUT_PNG" -o "$OUTPUT" 2>/dev/null

if [ ! -f "$OUTPUT" ]; then
    echo "⚠️  WebP conversion failed, using PNG"
    OUTPUT="$OUTPUT_PNG"
else
    WEBP_KB=$(( $(stat -f%z "$OUTPUT" 2>/dev/null || stat -c%s "$OUTPUT" 2>/dev/null) / 1024 ))
    echo "✅ WebP: ${WEBP_KB} KB (was ${PNG_KB} KB PNG, ${WEBP_KB}/${PNG_KB} = $(( WEBP_KB * 100 / PNG_KB ))% of original)"
    rm -f "$OUTPUT_PNG"
fi

# Upload to R2 via API
echo "📤 Uploading to R2..."
UPLOAD_RESPONSE=$(curl -s --max-time 30 -X POST "$R2_UPLOAD_URL" \
  -H "Authorization: Bearer $R2_API_KEY" \
  -F "file=@${OUTPUT};type=image/webp;filename=hero-${SLUG}.webp" \
  -F "alt=${TITLE}" \
  -F "folder=heroes")

R2_URL=$(echo "$UPLOAD_RESPONSE" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    url = data.get('url', data.get('image', {}).get('url', ''))
    if url:
        print(url)
    else:
        print('ERROR', file=sys.stderr)
        print(json.dumps(data)[:200], file=sys.stderr)
        sys.exit(1)
except:
    sys.exit(1)
")

if [ $? -ne 0 ] || [ -z "$R2_URL" ]; then
    echo "❌ Upload to R2 failed"
    echo "   Local file: $OUTPUT"
    exit 1
fi

echo "✅ Uploaded to R2: $R2_URL"

# Update article in D1 with featured_image
echo "📝 Updating article featured_image..."
CF_ACCOUNT="49d1b0abd51a707d6a1b155b929b900a"
CF_DB="f2e9b1f3-b70f-4842-8743-08a790b5fdef"

curl -s -X POST "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/d1/database/${CF_DB}/query" \
  -H "X-Auth-Email: agusharyanto1290@gmail.com" \
  -H "X-Auth-Key: 826336a7416cad1a44d5984b7b33f7fe80c0e" \
  -H "Content-Type: application/json" \
  -d "{\"sql\":\"UPDATE articles SET featured_image = ? WHERE slug = ?\",\"params\":[\"${R2_URL}\",\"${SLUG}\"]}" > /dev/null

echo "✅ Done! Article '${SLUG}' now has hero image: ${R2_URL}"

# Cleanup
rm -f "$OUTPUT" "$OUTPUT_PNG"

#!/bin/bash

# Region Admin API Test Script
# This script tests all CRUD operations for the Region Admin API

BASE_URL="http://localhost:3000/api"
REGION_ADMIN_ENDPOINT="$BASE_URL/region-admin"

echo "=================================="
echo "Region Admin API Test Script"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if server is running
echo -e "${YELLOW}Checking if server is running...${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "404\|200"; then
    echo -e "${GREEN}✓ Server is running${NC}"
else
    echo -e "${RED}✗ Server is not running. Please start the server first.${NC}"
    exit 1
fi

echo ""
echo "=================================="
echo "Note: You need to be authenticated as SUPER_ADMIN to test these endpoints"
echo "Please provide your access token:"
read -r ACCESS_TOKEN

if [ -z "$ACCESS_TOKEN" ]; then
    echo -e "${RED}✗ Access token is required${NC}"
    exit 1
fi

echo ""
echo "=================================="
echo "Test 1: Create Region Admin"
echo "=================================="

CREATE_RESPONSE=$(curl -s -X POST "$REGION_ADMIN_ENDPOINT" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "name": "Test Region Admin",
    "email": "test.regionadmin@example.com",
    "phone": "+919876543210",
    "password": "TestPass123",
    "state": "Maharashtra",
    "city": "Mumbai",
    "pincode": "400001",
    "location": "Test Region Office"
  }')

echo "$CREATE_RESPONSE" | jq '.'

# Extract ID from response
REGION_ADMIN_ID=$(echo "$CREATE_RESPONSE" | jq -r '.id')

if [ "$REGION_ADMIN_ID" != "null" ] && [ -n "$REGION_ADMIN_ID" ]; then
    echo -e "${GREEN}✓ Region Admin created successfully${NC}"
    echo "ID: $REGION_ADMIN_ID"
else
    echo -e "${RED}✗ Failed to create Region Admin${NC}"
    echo "Response: $CREATE_RESPONSE"
fi

echo ""
echo "=================================="
echo "Test 2: Get All Region Admins"
echo "=================================="

ALL_RESPONSE=$(curl -s -X GET "$REGION_ADMIN_ENDPOINT" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$ALL_RESPONSE" | jq '.'

if echo "$ALL_RESPONSE" | jq -e '. | type == "array"' > /dev/null; then
    COUNT=$(echo "$ALL_RESPONSE" | jq '. | length')
    echo -e "${GREEN}✓ Retrieved $COUNT region admin(s)${NC}"
else
    echo -e "${RED}✗ Failed to retrieve region admins${NC}"
fi

echo ""
echo "=================================="
echo "Test 3: Get Region Admin by ID"
echo "=================================="

if [ -n "$REGION_ADMIN_ID" ] && [ "$REGION_ADMIN_ID" != "null" ]; then
    GET_ONE_RESPONSE=$(curl -s -X GET "$REGION_ADMIN_ENDPOINT/$REGION_ADMIN_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    
    echo "$GET_ONE_RESPONSE" | jq '.'
    
    if echo "$GET_ONE_RESPONSE" | jq -e '.id' > /dev/null; then
        echo -e "${GREEN}✓ Retrieved region admin successfully${NC}"
    else
        echo -e "${RED}✗ Failed to retrieve region admin${NC}"
    fi
else
    echo -e "${YELLOW}⊘ Skipping - No region admin ID available${NC}"
fi

echo ""
echo "=================================="
echo "Test 4: Update Region Admin"
echo "=================================="

if [ -n "$REGION_ADMIN_ID" ] && [ "$REGION_ADMIN_ID" != "null" ]; then
    UPDATE_RESPONSE=$(curl -s -X PATCH "$REGION_ADMIN_ENDPOINT/$REGION_ADMIN_ID" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -d '{
        "name": "Updated Test Region Admin",
        "city": "Pune"
      }')
    
    echo "$UPDATE_RESPONSE" | jq '.'
    
    if echo "$UPDATE_RESPONSE" | jq -e '.name' | grep -q "Updated"; then
        echo -e "${GREEN}✓ Region admin updated successfully${NC}"
    else
        echo -e "${RED}✗ Failed to update region admin${NC}"
    fi
else
    echo -e "${YELLOW}⊘ Skipping - No region admin ID available${NC}"
fi

echo ""
echo "=================================="
echo "Test 5: Get Statistics"
echo "=================================="

STATS_RESPONSE=$(curl -s -X GET "$REGION_ADMIN_ENDPOINT/statistics" \
  -H "Authorization: Bearer $ACCESS_TOKEN")

echo "$STATS_RESPONSE" | jq '.'

if echo "$STATS_RESPONSE" | jq -e '.total' > /dev/null; then
    echo -e "${GREEN}✓ Retrieved statistics successfully${NC}"
else
    echo -e "${RED}✗ Failed to retrieve statistics${NC}"
fi

echo ""
echo "=================================="
echo "Test 6: Delete Region Admin"
echo "=================================="

if [ -n "$REGION_ADMIN_ID" ] && [ "$REGION_ADMIN_ID" != "null" ]; then
    DELETE_RESPONSE=$(curl -s -X DELETE "$REGION_ADMIN_ENDPOINT/$REGION_ADMIN_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    
    echo "$DELETE_RESPONSE" | jq '.'
    
    if echo "$DELETE_RESPONSE" | jq -e '.message' | grep -q "deleted successfully"; then
        echo -e "${GREEN}✓ Region admin deleted successfully${NC}"
    else
        echo -e "${RED}✗ Failed to delete region admin${NC}"
    fi
else
    echo -e "${YELLOW}⊘ Skipping - No region admin ID available${NC}"
fi

echo ""
echo "=================================="
echo "All tests completed!"
echo "=================================="

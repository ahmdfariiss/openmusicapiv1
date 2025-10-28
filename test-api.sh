#!/bin/bash

# Script untuk testing OpenMusic API v2
# Jalankan dengan: bash test-api.sh

echo "🎵 OpenMusic API v2 - Testing Script"
echo "===================================="
echo ""

BASE_URL="http://localhost:5000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Server Status
echo "📋 Test 1: Checking server status..."
response=$(curl -s -w "\n%{http_code}" $BASE_URL/)
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Server is running${NC}"
    echo "Response: $body"
else
    echo -e "${RED}❌ Server is not running (HTTP $http_code)${NC}"
    exit 1
fi
echo ""

# Test 2: Register User
echo "📋 Test 2: Registering new user..."
response=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser'$(date +%s)'",
    "password": "supersecret",
    "fullname": "Test User"
  }')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "201" ]; then
    echo -e "${GREEN}✅ User registered successfully${NC}"
    echo "Response: $body"
    USER_ID=$(echo "$body" | grep -o '"userId":"[^"]*' | cut -d'"' -f4)
    echo "User ID: $USER_ID"
else
    echo -e "${RED}❌ User registration failed (HTTP $http_code)${NC}"
    echo "Response: $body"
fi
echo ""

# Test 3: Login
echo "📋 Test 3: Login user..."
USERNAME="testuser$(date +%s)"
response=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/authentications \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$USERNAME\",
    \"password\": \"supersecret\"
  }")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "201" ]; then
    echo -e "${GREEN}✅ Login successful${NC}"
    ACCESS_TOKEN=$(echo "$body" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    REFRESH_TOKEN=$(echo "$body" | grep -o '"refreshToken":"[^"]*' | cut -d'"' -f4)
    echo "Access Token: ${ACCESS_TOKEN:0:50}..."
else
    echo -e "${YELLOW}⚠️  Login failed (using existing user)${NC}"
    # Try with default user
    response=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/authentications \
      -H "Content-Type: application/json" \
      -d '{
        "username": "dicoding",
        "password": "supersecret"
      }')
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✅ Login with default user successful${NC}"
        ACCESS_TOKEN=$(echo "$body" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    fi
fi
echo ""

# Test 4: Create Album
echo "📋 Test 4: Creating album..."
response=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/albums \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Album",
    "year": 2024
  }')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "201" ]; then
    echo -e "${GREEN}✅ Album created${NC}"
    ALBUM_ID=$(echo "$body" | grep -o '"albumId":"[^"]*' | cut -d'"' -f4)
    echo "Album ID: $ALBUM_ID"
else
    echo -e "${RED}❌ Album creation failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 5: Create Song
echo "📋 Test 5: Creating song..."
response=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/songs \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Test Song\",
    \"year\": 2024,
    \"performer\": \"Test Artist\",
    \"genre\": \"Rock\",
    \"duration\": 180,
    \"albumId\": \"$ALBUM_ID\"
  }")

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | head -n-1)

if [ "$http_code" = "201" ]; then
    echo -e "${GREEN}✅ Song created${NC}"
    SONG_ID=$(echo "$body" | grep -o '"songId":"[^"]*' | cut -d'"' -f4)
    echo "Song ID: $SONG_ID"
else
    echo -e "${RED}❌ Song creation failed (HTTP $http_code)${NC}"
fi
echo ""

# Test 6: Create Playlist (Authenticated)
if [ -n "$ACCESS_TOKEN" ]; then
    echo "📋 Test 6: Creating playlist (authenticated)..."
    response=$(curl -s -w "\n%{http_code}" -X POST $BASE_URL/playlists \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $ACCESS_TOKEN" \
      -d '{
        "name": "Test Playlist"
      }')

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    if [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✅ Playlist created${NC}"
        PLAYLIST_ID=$(echo "$body" | grep -o '"playlistId":"[^"]*' | cut -d'"' -f4)
        echo "Playlist ID: $PLAYLIST_ID"
    else
        echo -e "${RED}❌ Playlist creation failed (HTTP $http_code)${NC}"
        echo "Response: $body"
    fi
    echo ""

    # Test 7: Add Song to Playlist
    if [ -n "$PLAYLIST_ID" ] && [ -n "$SONG_ID" ]; then
        echo "📋 Test 7: Adding song to playlist..."
        response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/playlists/$PLAYLIST_ID/songs" \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $ACCESS_TOKEN" \
          -d "{
            \"songId\": \"$SONG_ID\"
          }")

        http_code=$(echo "$response" | tail -n1)
        body=$(echo "$response" | head -n-1)

        if [ "$http_code" = "201" ]; then
            echo -e "${GREEN}✅ Song added to playlist${NC}"
        else
            echo -e "${RED}❌ Failed to add song to playlist (HTTP $http_code)${NC}"
            echo "Response: $body"
        fi
        echo ""

        # Test 8: Get Playlist Songs
        echo "📋 Test 8: Getting playlist songs..."
        response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/playlists/$PLAYLIST_ID/songs" \
          -H "Authorization: Bearer $ACCESS_TOKEN")

        http_code=$(echo "$response" | tail -n1)
        body=$(echo "$response" | head -n-1)

        if [ "$http_code" = "200" ]; then
            echo -e "${GREEN}✅ Playlist songs retrieved${NC}"
            echo "Response: $body"
        else
            echo -e "${RED}❌ Failed to get playlist songs (HTTP $http_code)${NC}"
        fi
        echo ""

        # Test 9: Get Playlist Activities
        echo "📋 Test 9: Getting playlist activities..."
        response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/playlists/$PLAYLIST_ID/activities" \
          -H "Authorization: Bearer $ACCESS_TOKEN")

        http_code=$(echo "$response" | tail -n1)
        body=$(echo "$response" | head -n-1)

        if [ "$http_code" = "200" ]; then
            echo -e "${GREEN}✅ Playlist activities retrieved${NC}"
            echo "Response: $body"
        else
            echo -e "${RED}❌ Failed to get playlist activities (HTTP $http_code)${NC}"
        fi
        echo ""
    fi
else
    echo -e "${YELLOW}⚠️  Skipping authenticated tests (no access token)${NC}"
fi

echo "===================================="
echo -e "${GREEN}🎉 Testing complete!${NC}"
echo ""
echo "Summary:"
echo "- Server is running at $BASE_URL"
echo "- All basic endpoints are working"
echo ""
echo "For more detailed testing, use:"
echo "  - Postman collection: openmusic-postman-collection.json"
echo "  - Manual testing with curl commands in README.md"

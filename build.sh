echo "building shop-prices.."
# cd ./shop-prices
git pull
export PUBLIC_URL=https://test.domain/shop-prices
export REACT_APP_PUBLIC_ROOT=/shop-prices
export REACT_APP_BACKEND_URL=https://api.domain/shop-prices/api/v2
# heap out of memory fix:
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
# cd ..
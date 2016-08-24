pm2 delete onere
pm2 start onere.js --watch --ignore-watch="test .sh$ doc ui example"


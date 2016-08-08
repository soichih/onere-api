pm2 delete onore
pm2 start onore.js --watch --ignore-watch="test .sh$ doc ui example"


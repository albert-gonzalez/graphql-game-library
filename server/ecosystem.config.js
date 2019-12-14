module.exports = {
    apps : [{
        name: "games",
        script: "dist/init.js",
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
};

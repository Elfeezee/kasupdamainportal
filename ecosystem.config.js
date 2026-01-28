module.exports = {
  apps: [
    {
      name: 'kasupda',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: '4500',
        GOOGLE_APPLICATION_CREDENTIALS: '/var/secrets/firebase-sa.json'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      instances: 1,
      exec_mode: 'fork',
      restart_delay: 5000
    }
  ]
};

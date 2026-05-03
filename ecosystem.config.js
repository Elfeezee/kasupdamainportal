module.exports = {
  apps: [
    {
      name: 'kasupda',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: '4500',
        GOOGLE_APPLICATION_CREDENTIALS: '/var/secrets/firebase-sa.json',
        DB_HOST: 'localhost',
        DB_USER: 'kasupda_user',
        DB_PASSWORD: 'kasupda_pass',
        DB_NAME: 'kasupda',
        AUTH_SECRET: '29MoU+wtUObQ8p0SHjESEXu1Enp6qOtaCczTFQRjOYw=',
        AUTH_TRUST_HOST: 'true',
        AUTH_URL: 'https://kasupda.org',
        NEXTAUTH_URL: 'https://kasupda.org'
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

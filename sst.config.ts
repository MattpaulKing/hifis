/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "hifis",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const vpc = new sst.aws.Vpc("vpc");
    const cluster = new sst.aws.Cluster("cluster", { vpc });
    const bucket = new sst.aws.Bucket("bucket", { access: "public" })
    const redis = new sst.aws.Redis("redis", {
      vpc, dev: {
        host: "localhost",
        port: 6379
      }
    });
    const db = new sst.aws.Postgres("db", {
      vpc, dev: {
        username: "postgres",
        password: "postgres",
        database: "postgres",
        port: 5432
      }
    });

    cluster.addService("hifis-service", {
      link: [bucket, redis, db],
      loadBalancer: {
        ports: [{ listen: "80/http", forward: "3000/http" }],
      },
      dev: {
        command: "npm run dev && bun run --hot ./src/auth/authorizer.ts",
      },
    });
  },
});
